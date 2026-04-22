import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        <p className="mb-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Student dashboard
        </p>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">
          My Requests
        </h1>
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
              {/* HEADER */}
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {r.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Оюутан багш:{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {r.tutor_name}
                    </span>
                  </p>

                  {/* ✅ PAID BADGE */}
                  {r.is_paid && (
                    <span className="inline-block mt-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      ✔ Paid
                    </span>
                  )}
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                    r.status
                  )}`}
                >
                  {r.status}
                </span>
              </div>

              {/* DETAILS */}
              <div className="space-y-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                <p>
                  <span className="font-semibold">Description:</span> {r.description}
                </p>
                <p>
                  <span className="font-semibold">Type:</span> {r.type}
                </p>
                <p>
                  <span className="font-semibold">Date & time:</span>{" "}
                  {r.schedule ? new Date(r.schedule).toLocaleString() : "Not set"}
                </p>
                <p>
                  <span className="font-semibold">Grade:</span> {r.grade}
                </p>

                {r.proof_image && (
                  <div>
                    <p className="mb-2 font-semibold">Grade proof:</p>
                    <img
                      src={r.proof_image}
                      alt="Grade proof"
                      className="max-h-64 w-full rounded-2xl border border-slate-200 object-cover dark:border-slate-700"
                    />
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to={`/my-requests/${r.id}`}
                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  View Details
                </Link>

                {/* 💳 PAY BUTTON */}
                {r.status === "accepted" && !r.is_paid && (
                  <button
                    onClick={async () => {
                      try {
                        await api.post("/payments", {
                          request_id: r.id,
                        });

                        alert("Payment successful!");
                        window.location.reload();
                      } catch (err) {
                        alert(err.response?.data?.error || "Payment failed");
                      }
                    }}
                    className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Pay Now 💳
                  </button>
                )}

                {/* 🔓 JOIN BUTTON */}
                {r.status === "accepted" && r.is_paid && r.meeting_link && (
                  <a
                    href={r.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Join Lesson
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

export default MyRequests;