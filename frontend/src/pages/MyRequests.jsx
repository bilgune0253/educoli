
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ClipboardList, MessageCircle } from "lucide-react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import StatusBadge from "../components/ui/StatusBadge";
import RequestCard from "../components/ui/RequestCard";
import StatCard from "../components/StatCard";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [learningRequests, setLearningRequests] = useState([]);
  const [error, setError] = useState("");
  const [learningError, setLearningError] = useState("");
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [courses, learning] = await Promise.allSettled([
        api.get("/requests/my"),
        api.get("/learning-requests/my")
      ]);

      if (courses.status === "fulfilled") {
        setRequests(courses.value.data);
      } else {
        setError(
          courses.reason.response?.data?.error ||
          "Failed to load requests"
        );
      }

      if (learning.status === "fulfilled") {
        setLearningRequests(learning.value.data);
      } else {
        setLearningError(
          learning.reason.response?.data?.error ||
          "Learning Requests ачаалж чадсангүй"
        );
      }

      setLoading(false);
    };

    load();
  }, []);

  const pay = async (requestId) => {
    setPayingId(requestId);
    try {
      await api.post("/payments", { request_id: requestId });
      alert("Payment successful!");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || "Payment failed");
    } finally {
      setPayingId(null);
    }
  };

  const count = (status) =>
    requests.filter((r) => r.status === status).length;

  return (
    <PageContainer className="py-10 sm:py-14">
      <PageHeader
        eyebrow="Student Workspace"
        title="My Requests"
        description="Илгээсэн хичээлийн хүсэлтүүд болон өөрийн нийтэлсэн суралцах хүсэлтүүдийг удирдаарай."
      />

      {error && (
        <p role="alert" className="mb-5 rounded-xl bg-rose-50 p-4 text-rose-600">
          {error}
        </p>
      )}

      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total" value={requests.length} />
        <StatCard label="Pending" value={count("pending")} color="text-amber-600" />
        <StatCard label="Accepted" value={count("accepted")} color="text-emerald-600" />
        <StatCard label="Rejected" value={count("rejected")} color="text-rose-600" />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Course Requests</h2>
        <Link to="/courses" className="text-sm font-semibold text-indigo-600">
          Browse Courses
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2">
          {[1, 2].map((n) => (
            <div key={n} className="ui-card h-72 animate-pulse" />
          ))}
        </div>
      ) : requests.length ? (
        <div className="grid items-stretch gap-5 md:grid-cols-2">
          {requests.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              onPay={pay}
              paying={payingId !== null}
            />
          ))}
        </div>
      ) : (
        <Card className="py-14 text-center">
          <ClipboardList size={36} className="mx-auto text-indigo-400" />
          <h3 className="mt-4 font-bold">No course requests yet</h3>
          <p className="mt-2 text-sm text-slate-500">
            Хичээл сонгон хүсэлт илгээснээр энд харагдана.
          </p>
        </Card>
      )}

      <section className="mt-14">
        <PageHeader
          eyebrow="Learning Marketplace"
          title="My Learning Requests"
          description="Өөрийн нийтэлсэн суралцах хүсэлтүүд"
          action={
            <Link
              to="/learning-requests/new"
              className="ui-button ui-button-primary"
            >
              <Plus size={17} /> Шинэ хүсэлт
            </Link>
          }
        />

        {learningError && (
          <p role="alert" className="mb-5 text-rose-600">
            {learningError}
          </p>
        )}

        {learningRequests.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {learningRequests.map((item) => (
              <Card key={item.id} hover>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                    {item.subject}
                  </span>
                  <StatusBadge status={item.status} />
                </div>

                <h3 className="mt-4 text-xl font-bold">
                  {item.topic}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-5 space-y-2 text-sm text-slate-500">
                  <p>Ирсэн санал: {item.offer_count}</p>
                  {item.selected_tutor && (
                    <p>Сонгосон багш: <strong>{item.selected_tutor}</strong></p>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    to={`/learning-requests/${item.id}`}
                    className="ui-button ui-button-outline"
                  >
                    View Details
                  </Link>

                  {item.status === "matched" && item.conversation_id && (
                    <Link
                      to={`/messages?chat=${item.conversation_id}`}
                      className="ui-button ui-button-primary"
                    >
                      <MessageCircle size={16} /> Chat
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : !loading && !learningError && (
          <Card className="py-12 text-center">
            <p className="text-sm text-slate-500">
              Одоогоор Learning Request байхгүй.
            </p>
          </Card>
        )}
      </section>
    </PageContainer>
  );
}
