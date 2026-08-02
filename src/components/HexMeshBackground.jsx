import React, { useEffect, useRef, useCallback } from 'react';

/*──────────────────────────────────────────────────────────────────────────────
  HexMeshBackground — interactive hexagonal grid canvas
  ──────────────────────────────────────────────────────────────────────────────
  Renders a full-viewport, fixed-position canvas of outline-only hexagons that
  respond to cursor proximity with glow, scale, opacity shift, and subtle
  spring-displacement of neighbors.

  Colors are derived from the CrackIt Tailwind palette so this component
  integrates with the landing page without hardcoding unrelated values.
──────────────────────────────────────────────────────────────────────────────*/

// ── Theme colors (pulled from tailwind.config.js) ────────────────────────────
const COLORS = {
  background: '#fcf9f4',
  // Idle hex outline – faint lavender-gray (outline-variant from theme)
  idleStroke: 'rgba(198, 197, 213, 0.10)',
  // Active hex outline – primary indigo (lightened by 25%)
  activeStrokeR: 110,
  activeStrokeG: 123,
  activeStrokeB: 205,
  // Glow – primary at very low alpha (lightened by 25%)
  glowR: 110,
  glowG: 123,
  glowB: 205,
  // Subtle fill darkening on hover – surface-variant tone
  fillR: 198,
  fillG: 197,
  fillB: 213,
};

// ── Grid / geometry constants ────────────────────────────────────────────────
const HEX_RADIUS = 21.375;              // flat-top radius (px) — 25% smaller than previous 28.5
const HEX_SPACING = 2.25;              // gap between hexagons (scaled proportionally)
const SQRT3 = Math.sqrt(3);
const COL_STEP = (HEX_RADIUS + HEX_SPACING) * 1.5;
const ROW_STEP = (HEX_RADIUS + HEX_SPACING) * SQRT3;

// ── Interaction constants ────────────────────────────────────────────────────
const INFLUENCE_RADIUS_HEXES = 7;
const INFLUENCE_RADIUS_PX = INFLUENCE_RADIUS_HEXES * HEX_RADIUS * 1.6;

// ── Animation tuning ─────────────────────────────────────────────────────────
const ACTIVATION_LERP = 0.07;           // ~350ms to reach target at 60fps
const RECOVERY_LERP = 0.035;            // ~500ms recovery (slightly slower)
const ELASTIC_AMOUNT = 0.025;           // subtle elastic overshoot on recovery
const IDLE_BREATH_SPEED = 0.09;       // slow sinusoidal breathing rhythm
const IDLE_BREATH_AMP = 0.04;      // Increased by 5% from 0.002996
const IDLE_WAVE_SPREAD = 0.02;           // 0 = uniform breathing (all hexagons pulse together)

// ── Hex animated-state defaults ──────────────────────────────────────────────
const DEFAULT_STATE = {
  opacity: 0,
  strokeWidth: 0,
  scale: 0,
  glowAlpha: 0,
  fillAlpha: 0,
  dx: 0,
  dy: 0,
};

// ── Target values at full activation ─────────────────────────────────────────
const ACTIVE_OPACITY = 0.05;       // Increased by 5% from 0.038948
const ACTIVE_STROKE_WIDTH = 1.4;
const ACTIVE_SCALE = 0.08;              // scale *addition* (1 + 0.08)
const ACTIVE_GLOW_ALPHA = 0.014;   // Increased by 5% from 0.0008988
const ACTIVE_FILL_ALPHA = 0.003; // Increased by 5% from 0.00002247
const SPRING_PUSH_PX = 1.8;            // max neighbor displacement in px

// ── Precompute flat-top hexagon unit vertices ────────────────────────────────
const HEX_VERTICES = [];
for (let i = 0; i < 6; i++) {
  const angle = (Math.PI / 3) * i;
  HEX_VERTICES.push({ x: Math.cos(angle), y: Math.sin(angle) });
}

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function HexMeshBackground() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    hexagons: [],
    mouse: { x: -9999, y: -9999 },
    animFrame: 0,
    startTime: performance.now(),
  });

  // ── Build hexagon grid ─────────────────────────────────────────────────────
  const buildGrid = useCallback((width, height) => {
    const hexagons = [];
    const padX = HEX_RADIUS * 2;
    const padY = HEX_RADIUS * 2;

    let idx = 0;
    for (let col = -1; col * COL_STEP - padX < width + padX; col++) {
      const cx = col * COL_STEP;
      const isOddCol = col & 1;
      const yOffset = isOddCol ? ROW_STEP / 2 : 0;

      for (let row = -1; (row * ROW_STEP + yOffset) - padY < height + padY; row++) {
        const cy = row * ROW_STEP + yOffset;
        hexagons.push({
          cx,
          cy,
          col,
          row,
          idx: idx++,
          // animated state (current)
          opacity: 0,
          strokeWidth: 0,
          scale: 0,
          glowAlpha: 0,
          fillAlpha: 0,
          dx: 0,
          dy: 0,
          // target state
          tOpacity: 0,
          tStrokeWidth: 0,
          tScale: 0,
          tGlowAlpha: 0,
          tFillAlpha: 0,
          tDx: 0,
          tDy: 0,
        });
      }
    }
    return hexagons;
  }, []);

  // ── Main effect: setup canvas, listeners, animation loop ───────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    const state = stateRef.current;
    let running = true;

    // ── Resize handler ─────────────────────────────────────────────────────
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.hexagons = buildGrid(w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Pointer tracking ───────────────────────────────────────────────────
    const onPointerMove = (e) => {
      state.mouse.x = e.clientX;
      state.mouse.y = e.clientY;
    };
    const onPointerLeave = () => {
      state.mouse.x = -9999;
      state.mouse.y = -9999;
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerleave', onPointerLeave);

    // ── Draw a single hexagon ──────────────────────────────────────────────
    const drawHex = (cx, cy, radius) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const vx = cx + HEX_VERTICES[i].x * radius;
        const vy = cy + HEX_VERTICES[i].y * radius;
        if (i === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
    };

    // ── Smooth lerp with elastic overshoot on recovery ─────────────────────
    const springLerp = (current, target, isActivating) => {
      if (isActivating) {
        return current + (target - current) * ACTIVATION_LERP;
      }
      // Recovery with subtle elastic overshoot
      const diff = target - current;
      const progress = 1 - Math.abs(diff) / (Math.abs(current) + 0.001);
      const elastic = 1 + ELASTIC_AMOUNT * Math.sin(progress * Math.PI);
      return current + diff * RECOVERY_LERP * elastic;
    };

    // ── Animation loop ─────────────────────────────────────────────────────
    const tick = () => {
      if (!running) return;
      const now = performance.now();
      const elapsed = now - state.startTime;
      const { hexagons, mouse } = state;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Clear
      ctx.fillStyle = COLORS.background;
      ctx.fillRect(0, 0, w, h);

      const influenceR2 = INFLUENCE_RADIUS_PX * INFLUENCE_RADIUS_PX;

      // ── Phase 1: Compute targets ───────────────────────────────────────
      // Find the closest hex to cursor for spring displacement source
      let closestIdx = -1;
      let closestDist = Infinity;

      for (let i = 0; i < hexagons.length; i++) {
        const hex = hexagons[i];
        const mdx = mouse.x - hex.cx;
        const mdy = mouse.y - hex.cy;
        const dist2 = mdx * mdx + mdy * mdy;

        if (dist2 < closestDist) {
          closestDist = dist2;
          closestIdx = i;
        }

        if (dist2 < influenceR2) {
          const dist = Math.sqrt(dist2);
          // Quadratic falloff — smooth, no hard edge
          const t = 1 - (dist / INFLUENCE_RADIUS_PX);
          const influence = t * t;

          hex.tOpacity = ACTIVE_OPACITY * influence;
          hex.tStrokeWidth = ACTIVE_STROKE_WIDTH * influence;
          hex.tScale = ACTIVE_SCALE * influence;
          hex.tGlowAlpha = ACTIVE_GLOW_ALPHA * influence;
          hex.tFillAlpha = ACTIVE_FILL_ALPHA * influence;
        } else {
          hex.tOpacity = 0;
          hex.tStrokeWidth = 0;
          hex.tScale = 0;
          hex.tGlowAlpha = 0;
          hex.tFillAlpha = 0;
        }
        hex.tDx = 0;
        hex.tDy = 0;
      }

      // ── Phase 2: Spring displacement from closest hex ──────────────────
      if (closestIdx >= 0 && closestDist < influenceR2) {
        const src = hexagons[closestIdx];
        const srcScale = src.tScale;
        if (srcScale > 0.001) {
          for (let i = 0; i < hexagons.length; i++) {
            if (i === closestIdx) continue;
            const hex = hexagons[i];
            const ddx = hex.cx - src.cx;
            const ddy = hex.cy - src.cy;
            const dd = Math.sqrt(ddx * ddx + ddy * ddy);

            // Only push immediate & near neighbors (within ~2.5 hex radii)
            if (dd < HEX_RADIUS * 3.5 && dd > 0.1) {
              const pushStrength = srcScale / ACTIVE_SCALE;  // 0..1
              const distFalloff = 1 - (dd / (HEX_RADIUS * 3.5));
              const push = SPRING_PUSH_PX * pushStrength * distFalloff * distFalloff;
              hex.tDx += (ddx / dd) * push;
              hex.tDy += (ddy / dd) * push;
            }
          }
        }
      }

      // ── Phase 3: Animate current → target, then draw ───────────────────
      for (let i = 0; i < hexagons.length; i++) {
        const hex = hexagons[i];

        // Determine if activating or recovering
        const activating = hex.tOpacity > hex.opacity + 0.000078645;

        hex.opacity = springLerp(hex.opacity, hex.tOpacity, activating);
        hex.strokeWidth = springLerp(hex.strokeWidth, hex.tStrokeWidth, activating);
        hex.scale = springLerp(hex.scale, hex.tScale, activating);
        hex.glowAlpha = springLerp(hex.glowAlpha, hex.tGlowAlpha, activating);
        hex.fillAlpha = springLerp(hex.fillAlpha, hex.tFillAlpha, activating);
        hex.dx = springLerp(hex.dx, hex.tDx, activating);
        hex.dy = springLerp(hex.dy, hex.tDy, activating);

        // ── Idle breathing ─────────────────────────────────────────────
        const breath = Math.sin(elapsed * IDLE_BREATH_SPEED + hex.idx * IDLE_WAVE_SPREAD);
        const idleOpacity = 0.079 + breath * IDLE_BREATH_AMP;

        // Composite opacity: idle base + interaction boost
        const finalOpacity = Math.min(1, idleOpacity + hex.opacity);
        const finalStrokeWidth = 0.3 + hex.strokeWidth;
        const finalScale = 1 + hex.scale;
        const drawRadius = HEX_RADIUS * finalScale;
        const drawCx = hex.cx + hex.dx;
        const drawCy = hex.cy + hex.dy;

        // Skip off-screen hexagons
        if (drawCx + drawRadius < -20 || drawCx - drawRadius > w + 20 ||
          drawCy + drawRadius < -20 || drawCy - drawRadius > h + 20) {
          continue;
        }

        // ── Draw glow layer (wider, softer stroke) ─────────────────────
        if (hex.glowAlpha > 0.000056175) {
          ctx.save();
          ctx.strokeStyle = `rgba(${COLORS.glowR}, ${COLORS.glowG}, ${COLORS.glowB}, ${hex.glowAlpha * 0.5})`;
          ctx.lineWidth = finalStrokeWidth + 5;
          ctx.lineJoin = 'round';
          drawHex(drawCx, drawCy, drawRadius + 2);
          ctx.stroke();
          ctx.restore();
        }

        // ── Draw subtle fill darkening ─────────────────────────────────
        if (hex.fillAlpha > 0.0000011235) {
          ctx.fillStyle = `rgba(${COLORS.fillR}, ${COLORS.fillG}, ${COLORS.fillB}, ${hex.fillAlpha})`;
          drawHex(drawCx, drawCy, drawRadius);
          ctx.fill();
        }

        // ── Draw hex outline ───────────────────────────────────────────
        if (hex.opacity > 0.000393225) {
          // Blend from idle color toward active primary based on activation
          const activeBlend = Math.min(1, hex.opacity / ACTIVE_OPACITY);
          const r = Math.round(198 + (COLORS.activeStrokeR - 198) * activeBlend);
          const g = Math.round(197 + (COLORS.activeStrokeG - 197) * activeBlend);
          const b = Math.round(213 + (COLORS.activeStrokeB - 213) * activeBlend);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${finalOpacity})`;
        } else {
          ctx.strokeStyle = `rgba(198, 197, 213, ${finalOpacity})`;
        }
        ctx.lineWidth = finalStrokeWidth;
        ctx.lineJoin = 'miter';
        drawHex(drawCx, drawCy, drawRadius);
        ctx.stroke();
      }

      state.animFrame = requestAnimationFrame(tick);
    };

    state.animFrame = requestAnimationFrame(tick);

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      running = false;
      cancelAnimationFrame(state.animFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [buildGrid]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    />
  );
}
