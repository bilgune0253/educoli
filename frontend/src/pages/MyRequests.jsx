import { useEffect, useState } from "react";
import api from "../services/api";

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

  const getStatusClass = (status) => {
    if (status === "accepted") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }
    if (status === "rejected") {
      return "bg-rose-50 text-rose-700 border border-rose-200";
    }
    return "bg-amber-50 text-amber-700 border border-amber-200";
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-indigo-600">Student dashboard</p>
        <h1 className="text-4xl font-bold text-slate-900">My Requests</h1>
        <p className="mt-2 text-slate-500">
          Track all course requests you have sent.
        </p>
      </div>

      {message && (
        <p className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {message}
        </p>
      )}

      {requests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No requests found yet.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {requests.map((r) => (
            <div
              key={r.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{r.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Tutor: <span className="font-medium text-slate-700">{r.tutor_name}</span>
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                    r.status
                  )}`}
                >
                  {r.status}
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                {r.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRequests;