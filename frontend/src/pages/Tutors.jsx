
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Search, Star, Users } from "lucide-react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import VerifiedBadge from "../components/VerifiedBadge";

export default function Tutors() {
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/tutors")
      .then(({ data }) => setTutors(data))
      .catch((err) =>
        setError(err.response?.data?.error || "Failed to load tutors")
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() =>
    tutors.filter((t) =>
      [t.name, t.email, t.total_courses, t.average_rating]
        .join(" ").toLowerCase().includes(search.toLowerCase())
    ), [tutors, search]);

  return (
    <PageContainer className="py-10 sm:py-14">
      <PageHeader
        eyebrow="Our Community"
        title="Find your perfect tutor."
        description="Мэдлэг, туршлагатай оюутан багш нарыг олж, тэдний хичээл болон үнэлгээтэй танилцаарай."
      />

      <div className="ui-card mb-8 flex items-center gap-3 p-4">
        <Search size={20} className="shrink-0 text-slate-400" />
        <input
          className="w-full bg-transparent text-sm outline-none"
          placeholder="Search tutors by name, email, rating..."
          aria-label="Search tutors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-bold">Explore Tutors</h2>
        <span className="text-sm text-slate-500">
          {filtered.length} tutors
        </span>
      </div>

      {error && <p role="alert" className="mb-6 text-rose-600">{error}</p>}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="ui-card h-72 animate-pulse" />
          ))}
        </div>
      ) : filtered.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((tutor) => (
            <Card key={tutor.id} hover className="flex flex-col">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-bold text-indigo-600 dark:bg-indigo-500/20">
                  {tutor.name?.charAt(0)?.toUpperCase() || "T"}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1">
                    <h3 className="font-bold">{tutor.name}</h3>
                    {tutor.is_verified && <VerifiedBadge />}
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {tutor.student_code}
                  </p>
                  <p className="mt-1 truncate text-sm text-slate-500">
                    {tutor.email}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                  <BookOpen size={18} className="mb-2 text-indigo-500" />
                  <p className="text-xl font-bold">{tutor.total_courses}</p>
                  <p className="text-xs text-slate-500">Courses</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                  <Star size={18} className="mb-2 text-amber-500" />
                  <p className="text-xl font-bold">
                    {Number(tutor.average_rating || 0).toFixed(1)}
                  </p>
                  <p className="text-xs text-slate-500">Average rating</p>
                </div>
              </div>

              <Link
                to={`/tutors/${tutor.id}`}
                className="ui-button ui-button-outline mt-6 w-full"
              >
                View Profile <ArrowUpRight size={16} />
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-16 text-center">
          <Users size={36} className="mx-auto text-indigo-400" />
          <h3 className="mt-4 font-bold">No tutors found</h3>
          <p className="mt-2 text-sm text-slate-500">
            Try another search.
          </p>
        </Card>
      )}
    </PageContainer>
  );
}
