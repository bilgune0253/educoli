
import { useEffect, useState } from "react";
import { Check, ClipboardList, X } from "lucide-react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import StatusBadge from "../components/ui/StatusBadge";
import StatCard from "../components/StatCard";
import VerifiedBadge from "../components/VerifiedBadge";

export default function TutorRequests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      const { data } = await api.get("/requests/tutor");
      setRequests(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load tutor requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    setError("");

    try {
      await api.put(`/requests/${id}`, { status });
      await fetchRequests();
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const count = (status) =>
    requests.filter((r) => r.status === status).length;

  const filtered = filter === "all"
    ? requests
    : requests.filter((r) => r.status === filter);

  const filters = [
    ["all", "All"],
    ["pending", "Pending"],
    ["accepted", "Accepted"],
    ["rejected", "Rejected"]
  ];

  return (
    <PageContainer className="py-10 sm:py-14">
      <PageHeader
        eyebrow="Tutor Workspace"
        title="Manage your requests."
        description="Хичээлд бүртгүүлэх хүсэлтүүдийг шалгаж, хүлээн авах эсвэл татгалзаарай."
      />

      {error && (
        <p role="alert" className="mb-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
          {error}
        </p>
      )}

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total" value={requests.length} />
        <StatCard label="Pending" value={count("pending")} color="text-amber-600" />
        <StatCard label="Accepted" value={count("accepted")} color="text-emerald-600" />
        <StatCard label="Rejected" value={count("rejected")} color="text-rose-600" />
      </div>

      <div className="mb-7 flex flex-wrap gap-2">
        {filters.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filter === value
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="ui-card h-56 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-16 text-center">
          <ClipboardList size={38} className="mx-auto text-indigo-400" />
          <h3 className="mt-4 text-lg font-bold">
            No requests found
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Энэ төлөвтэй хүсэлт одоогоор алга.
          </p>
        </Card>
      ) : (
        <div className="grid items-start gap-5 md:grid-cols-2">
          {filtered.map((request) => (
            <Card key={request.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-xl font-bold">
                    {request.title}
                  </h3>

                  <div className="mt-3 flex flex-wrap items-center gap-1 text-sm text-slate-500">
                    <span>Student:</span>
                    <span className="font-semibold text-slate-800 dark:text-white">
                      {request.student_name}
                    </span>
                    {request.student_is_verified && <VerifiedBadge />}
                  </div>

                  {request.student_code && (
                    <p className="mt-1 text-xs text-slate-400">
                      {request.student_code}
                    </p>
                  )}

                  <p className="mt-1 break-all text-sm text-slate-500">
                    {request.student_email}
                  </p>
                </div>

                <StatusBadge status={request.status} />
              </div>

              {request.status === "pending" && (
                <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                  <Button
                    disabled={busyId !== null}
                    onClick={() => updateStatus(request.id, "accepted")}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Check size={17} />
                    {busyId === request.id ? "Updating..." : "Accept"}
                  </Button>

                  <Button
                    variant="danger"
                    disabled={busyId !== null}
                    onClick={() => updateStatus(request.id, "rejected")}
                    className="flex-1"
                  >
                    <X size={17} />
                    Reject
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
