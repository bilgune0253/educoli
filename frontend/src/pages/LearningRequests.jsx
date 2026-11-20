
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Plus, Search, Users } from "lucide-react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";

const statusStyles = {
  open: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  matched: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
  closed: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
};

const statusLabels = {
  open: "Нээлттэй",
  matched: "Багш сонгосон",
  closed: "Хаагдсан"
};

export default function LearningRequests() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  useEffect(() => {
    api.get("/learning-requests")
      .then(({ data }) => setItems(data))
      .catch(() => setError("Хүсэлтүүдийг ачаалж чадсангүй."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((item) =>
    [item.subject, item.topic, item.description]
      .join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <PageContainer className="py-10 sm:py-14">
      <PageHeader
        eyebrow="Peer Learning"
        title="Суралцах хүсэлтүүд"
        description="Бусад суралцагчдын хайж буй хичээл, сэдвүүдтэй танилцаарай."
        action={user?.role === "student" && (
          <Link to="/learning-requests/new" className="ui-button ui-button-primary">
            <Plus size={18} /> Хүсэлт нийтлэх
          </Link>
        )}
      />

      <div className="ui-card mb-8 flex items-center gap-3 p-4">
        <Search size={20} className="text-slate-400" />
        <input
          aria-label="Хичээл, сэдэв хайх"
          placeholder="Хичээл эсвэл сэдвээр хайх..."
          className="w-full bg-transparent text-sm outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-bold">Available Requests</h2>
        <span className="text-sm text-slate-500">
          {filtered.length} results
        </span>
      </div>

      {error && <p role="alert" className="mb-6 text-rose-600">{error}</p>}

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="ui-card h-56 animate-pulse" />
          ))}
        </div>
      ) : filtered.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((item) => (
            <Link
              key={item.id}
              to={`/learning-requests/${item.id}`}
              className="group block"
            >
              <Card hover className="h-full">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                    {item.subject}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyles[item.status] || statusStyles.closed
                  }`}>
                    {statusLabels[item.status] || item.status}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold group-hover:text-indigo-600">
                  {item.topic}
                </h3>
                <p className="mt-3 line-clamp-3 min-h-18 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800">
                  <span className="flex items-center gap-2">
                    <Users size={15} /> {item.student_name}
                  </span>
                  <span className="flex items-center gap-2">
                    <BookOpen size={15} />
                    {item.offer_count} санал · {item.preferred_format}
                  </span>
                  <ArrowUpRight size={17} className="text-indigo-600" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="py-16 text-center">
          <BookOpen size={36} className="mx-auto text-indigo-400" />
          <h3 className="mt-4 font-bold">Хүсэлт олдсонгүй</h3>
          <p className="mt-2 text-sm text-slate-500">
            Өөр түлхүүр үгээр хайж үзээрэй.
          </p>
        </Card>
      )}
    </PageContainer>
  );
}
