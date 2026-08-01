import { supabaseAdmin } from "../config/supabase.js";

/**
 * Notification schema (001_schema.sql):
 *   id           UUID
 *   user_id      UUID
 *   type         TEXT
 *   title        TEXT
 *   payload_json JSONB   ← message, link_url, and any extra metadata live here
 *   read_at      TIMESTAMPTZ   ← NULL = unread; set to now() when read
 *   created_at   TIMESTAMPTZ
 *
 * NOTE: there is NO top-level `read` boolean, `message`, or `link_url` column.
 * All helpers below normalise the in-memory shape to match the DB shape so that
 * memory-fallback objects and DB rows can be used interchangeably.
 */

// Memory fallback store for notifications
const memoryNotificationsStore = new Map([
  [
    "demo-user-urja-12345",
    [
      {
        id: "notif-welcome-1",
        user_id: "demo-user-urja-12345",
        type: "welcome",
        title: "Welcome to CrackIt AI!",
        payload_json: {
          message: "Your account is ready. Configure your first mock interview to start practicing.",
          link_url: "/interview-setup",
        },
        read_at: null,
        created_at: new Date().toISOString(),
      },
    ],
  ],
]);

export async function createNotification(userId, type, title, message, linkUrl = null) {
  console.log(`🔔 [Notification Engine] Triggering notification for '${userId}': ${title}`);

  const notifObj = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    user_id: userId,
    type,
    title,
    payload_json: { message, link_url: linkUrl },
    read_at: null,
    created_at: new Date().toISOString(),
  };

  const userNotifs = memoryNotificationsStore.get(userId) || [];
  userNotifs.unshift(notifObj);
  memoryNotificationsStore.set(userId, userNotifs);

  try {
    if (!userId.startsWith("demo-user-")) {
      await supabaseAdmin.from("notifications").insert({
        user_id: userId,
        type,
        title,
        payload_json: { message, link_url: linkUrl },
        // read_at defaults to NULL (unread) — no need to set it
      }).catch(() => {});
    }
  } catch {
    // Memory fallback handles it
  }

  return notifObj;
}

export async function getUserNotifications(userId, page = 1, limit = 10) {
  let notifs = memoryNotificationsStore.get(userId) || [];

  try {
    if (!userId.startsWith("demo-user-")) {
      const { data } = await supabaseAdmin
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        notifs = data;
      }
    }
  } catch {
    // Memory fallback
  }

  // read_at === null means unread (schema-aligned)
  const unreadCount = notifs.filter((n) => n.read_at === null).length;
  const startIndex = (page - 1) * limit;
  const paginated = notifs.slice(startIndex, startIndex + limit);

  return {
    notifications: paginated,
    unread_count: unreadCount,
    total: notifs.length,
    page,
    limit,
  };
}

export async function markNotificationRead(userId, notificationId) {
  const readAt = new Date().toISOString();

  // Update in-memory store (works for both demo and real users)
  const userNotifs = memoryNotificationsStore.get(userId) || [];
  const found = userNotifs.find((n) => n.id === notificationId);
  if (found) {
    found.read_at = readAt;
  }

  try {
    // Only skip DB call for in-memory-only demo-generated IDs (start with "notif-")
    if (!userId.startsWith("demo-user-") && !notificationId.startsWith("notif-")) {
      await supabaseAdmin
        .from("notifications")
        .update({ read_at: readAt })
        .eq("id", notificationId)
        .eq("user_id", userId)
        .catch(() => {});
    }
  } catch {
    // Memory fallback
  }

  return { success: true, notificationId };
}

export async function markAllNotificationsRead(userId) {
  const readAt = new Date().toISOString();

  const userNotifs = memoryNotificationsStore.get(userId) || [];
  for (const n of userNotifs) {
    n.read_at = readAt;
  }

  try {
    if (!userId.startsWith("demo-user-")) {
      await supabaseAdmin
        .from("notifications")
        .update({ read_at: readAt })
        .eq("user_id", userId)
        .catch(() => {});
    }
  } catch {
    // Memory fallback
  }

  return { success: true };
}
