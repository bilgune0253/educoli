import { useEffect, useState } from "react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to load notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      fetchNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PageContainer className="py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Updates
          </p>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">
            Notifications
          </h1>
        </div>

        <button
          onClick={markAllAsRead}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Mark all as read
        </button>
      </div>

      {message && (
        <p className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
          {message}
        </p>
      )}

      {notifications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-3xl border p-5 shadow-sm transition dark:bg-slate-900 ${
                n.is_read
                  ? "border-slate-200 bg-white dark:border-slate-800"
                  : "border-indigo-200 bg-indigo-50 dark:border-indigo-500/20 dark:bg-indigo-500/10"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {n.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {n.message}
                  </p>
                  <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>

                {!n.is_read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

export default Notifications;