
import { useEffect, useState } from "react";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const notifyNavbar = () => {
    window.dispatchEvent(new Event("notifications-updated"));
  };

  const markAsRead = async (id) => {
    setBusy(true);
    try {
      await api.put(`/notifications/${id}/read`);
      await fetchNotifications();
      notifyNavbar();
    } catch (err) {
      setError(err.response?.data?.error || "Notification шинэчилж чадсангүй.");
    } finally {
      setBusy(false);
    }
  };

  const markAllAsRead = async () => {
    setBusy(true);
    try {
      await api.put("/notifications/read-all");
      await fetchNotifications();
      notifyNavbar();
    } catch (err) {
      setError(err.response?.data?.error || "Notifications шинэчилж чадсангүй.");
    } finally {
      setBusy(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filtered = filter === "unread"
    ? notifications.filter((n) => !n.is_read)
    : notifications;

  return (
    <PageContainer className="py-10 sm:py-14">
      <PageHeader
        eyebrow="Activity Center"
        title="Notifications."
        description="Таны хүсэлт, хичээл болон бусад үйл ажиллагаатай холбоотой шинэ мэдээллүүд."
        action={
          <Button
            variant="outline"
            disabled={busy || loading || unreadCount === 0}
            onClick={markAllAsRead}
          >
            <CheckCheck size={17} />
            Mark all as read
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10">
              <Bell size={23} />
            </div>
            <div>
              <p className="text-2xl font-extrabold">
                {notifications.length}
              </p>
              <p className="text-sm text-slate-500">
                Total notifications
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-500/10">
              <Inbox size={23} />
            </div>
            <div>
              <p className="text-2xl font-extrabold">
                {unreadCount}
              </p>
              <p className="text-sm text-slate-500">
                Unread notifications
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-6 flex gap-2">
        {[
          ["all", "All"],
          ["unread", "Unread"]
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              filter === value
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            {label}
            {value === "unread" && unreadCount > 0 && (
              <span className="ml-2">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mb-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
          {error}
        </p>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="ui-card h-28 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-16 text-center">
          <Bell size={38} className="mx-auto text-indigo-400" />
          <h3 className="mt-4 text-lg font-bold">
            {filter === "unread"
              ? "You're all caught up!"
              : "No notifications yet"}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Шинэ мэдэгдэл ирэх үед энд харагдана.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-2xl border p-5 transition sm:p-6 ${
                notification.is_read
                  ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                  : "border-indigo-200 bg-indigo-50/70 dark:border-indigo-500/20 dark:bg-indigo-500/10"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`hidden shrink-0 rounded-xl p-3 sm:block ${
                  notification.is_read
                    ? "bg-slate-100 text-slate-500 dark:bg-slate-800"
                    : "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20"
                }`}>
                  <Bell size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">
                      {notification.title}
                    </h3>

                    {!notification.is_read && (
                      <span className="h-2 w-2 rounded-full bg-indigo-600" />
                    )}
                  </div>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {notification.message}
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>

                {!notification.is_read && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CheckCheck size={15} />
                    <span className="hidden sm:inline">Mark as read</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
