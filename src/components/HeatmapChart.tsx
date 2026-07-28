import React, { useMemo } from 'react';

interface HeatmapCell {
  id: number;
  level: number;
  colorClass: string;
}

export const HeatmapChart: React.FC = () => {
  const heatmapCells: HeatmapCell[] = useMemo(() => {
    const cells: HeatmapCell[] = [];
    const colors = ['bg-surface-container', 'bg-tertiary-fixed-dim', 'bg-tertiary-fixed', 'bg-tertiary'];
    for (let i = 0; i < 364; i++) {
      const level = Math.floor(Math.random() * 4);
      cells.push({
        id: i,
        level,
        colorClass: colors[level]
      });
    }
    return cells;
  }, []);

  return (
    <section className="col-span-12 bg-surface-container-lowest rounded-[24px] p-6 md:p-8 shadow-[0_10px_30px_rgba(65,81,187,0.08)] border border-surface-variant/30">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-md text-headline-md font-bold text-[20px]">Practice Activity</h3>
        <div className="flex items-center gap-2 text-label-sm text-xs text-on-surface-variant font-semibold">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-[3px] bg-surface-container"></div>
            <div className="w-3 h-3 rounded-[3px] bg-tertiary-fixed-dim"></div>
            <div className="w-3 h-3 rounded-[3px] bg-tertiary-fixed"></div>
            <div className="w-3 h-3 rounded-[3px] bg-tertiary"></div>
          </div>
          <span>More</span>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-[900px]">
          {heatmapCells.map((cell) => (
            <div
              key={cell.id}
              className={`w-[14px] h-[14px] rounded-[3px] transition-all cursor-pointer ${cell.colorClass} hover:ring-2 hover:ring-primary/40`}
              title={`Activity level: ${cell.level}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeatmapChart;
