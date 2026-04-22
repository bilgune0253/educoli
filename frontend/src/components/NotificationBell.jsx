import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get("/notifications/unread-count");
        setUnreadCount(res.data.unreadCount);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUnread();
  }, []);

  return (
    <Link
      to="/notifications"
      className="relative flex items-center justify-center rounded-2xl border border-slate-300 bg-white p-2 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
    >
      {/* SVG ICON */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        className="text-slate-700 dark:text-slate-200 transition hover:scale-110"
        viewBox="0 0 16 16"
      >
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
      </svg>

      {/* UNREAD BADGE */}
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}

export default NotificationBell;