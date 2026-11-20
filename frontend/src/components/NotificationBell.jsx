
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchUnread = async () => {
      try {
        const res = await api.get("/notifications/unread-count");

        if (active) {
          setUnreadCount(Number(res.data.unreadCount) || 0);
        }
      } catch (err) {
        console.error("Unread notifications error:", err);
      }
    };

    // Анх ачаалагдах үед
    fetchUnread();

    // Notification уншсан үед
    window.addEventListener(
      "notifications-updated",
      fetchUnread
    );

    // Өөр tab-аас буцаж ирэх үед
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchUnread();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    window.addEventListener("focus", fetchUnread);

    return () => {
      active = false;

      window.removeEventListener(
        "notifications-updated",
        fetchUnread
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

      window.removeEventListener("focus", fetchUnread);
    };
  }, []);

  return (
    <Link
      to="/notifications"
      aria-label={
        unreadCount > 0
          ? `${unreadCount} unread notifications`
          : "Notifications"
      }
      className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-300 bg-white transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        fill="currentColor"
        className="text-slate-700 dark:text-slate-200"
        viewBox="0 0 16 16"
      >
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
      </svg>

      {unreadCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white shadow-sm">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}

export default NotificationBell;
