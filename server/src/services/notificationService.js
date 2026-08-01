import { supabaseAdmin } from "../config/supabase.js";

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
        message: "Your account is ready. Configure your first mock interview to start practicing.",
        link_url: "/interview-setup",
        read: false,
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
    message,
    link_url: linkUrl,
    read: false,
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
        message,
        link_url: linkUrl,
        read: false,
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

  const unreadCount = notifs.filter((n) => !n.read).length;
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
  const userNotifs = memoryNotificationsStore.get(userId) || [];
  const found = userNotifs.find((n) => n.id === notificationId);
  if (found) {
    found.read = true;
  }

  try {
    if (!userId.startsWith("demo-user-") && !notificationId.startsWith("notif-")) {
      await supabaseAdmin
        .from("notifications")
        .update({ read: true })
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
  const userNotifs = memoryNotificationsStore.get(userId) || [];
  for (const n of userNotifs) {
    n.read = true;
  }

  try {
    if (!userId.startsWith("demo-user-")) {
      await supabaseAdmin
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .catch(() => {});
    }
  } catch {
    // Memory fallback
  }

  return { success: true };
}
