import { useEffect, useState } from "react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import StatCard from "../components/StatCard";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const res = await api.get("/requests/my");
        setRequests(res.data);
      } catch (err) {
        setMessage(err.response?.data?.error || "Failed to load requests");
      }
    };

    fetchMyRequests();
  }, []);

  const accepted = requests.filter((r) => r.status === "accepted").length;
  const pending = requests.filter((r) => r.status === "pending").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;

  const getStatusClass = (status) => {
    if (status === "accepted") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20";
    }
    if (status === "rejected") {
      return "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20";
    }
    return "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20";
  };

  return (
    <PageContainer className="py-10">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">Student dashboard</p>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">My Requests</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Track all course requests you have sent.
        </p>
      </div>

      {message && (
        <p className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
          {message}
        </p>
      )}

      <div className="mb-10 grid gap-5 md:grid-cols-4">
        <StatCard label="Total" value={requests.length} color="text-slate-900 dark:text-white" />
        <StatCard label="Accepted" value={accepted} color="text-emerald-600" />
        <StatCard label="Pending" value={pending} color="text-amber-600" />
        <StatCard label="Rejected" value={rejected} color="text-rose-600" />
      </div>

      {requests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No requests found yet.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {requests.map((r) => (
            <div
              key={r.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{r.title}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Tutor: <span className="font-medium text-slate-700 dark:text-slate-200">{r.tutor_name}</span>
                  </p>
                </div>

                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(r.status)}`}>
                  {r.status}
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                {r.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

export default MyRequests;