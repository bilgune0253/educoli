
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Star } from "lucide-react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import StatCard from "../components/StatCard";
import VerifiedBadge from "../components/VerifiedBadge";

export default function TutorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setProfile(null);
    setError("");
    api.get(`/tutors/${id}`)
      .then(({ data }) => setProfile(data))
      .catch((err) =>
        setError(err.response?.data?.error || "Failed to load tutor profile")
      );
  }, [id]);

  return (
    <PageContainer className="py-10 sm:py-14">
      <Button variant="outline" onClick={() => navigate(-1)}>
        <ArrowLeft size={17} /> Back
      </Button>

      {error ? (
        <Card className="mt-8 text-rose-600">{error}</Card>
      ) : !profile ? (
        <Card className="mt-8 animate-pulse">
          Loading tutor profile...
        </Card>
      ) : (
        <>
          <Card className="my-8">
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-3xl font-bold text-indigo-600 dark:bg-indigo-500/20">
                {profile.tutor.name?.charAt(0) || "T"}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Student Tutor
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-extrabold">
                    {profile.tutor.name}
                  </h1>
                  {profile.tutor.is_verified && <VerifiedBadge />}
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {profile.tutor.student_code}
                </p>
                <p className="mt-1 break-all text-sm text-slate-500">
                  {profile.tutor.email}
                </p>
              </div>
            </div>
          </Card>

          <div className="mb-8 grid gap-5 sm:grid-cols-3">
            <StatCard
              label="Total Courses"
              value={profile.stats.totalCourses}
            />
            <StatCard
              label="Average Rating"
              value={profile.stats.averageRating}
              color="text-amber-600"
            />
            <StatCard
              label="Total Reviews"
              value={profile.stats.totalReviews}
              color="text-emerald-600"
            />
          </div>

          <div className="grid items-start gap-7 lg:grid-cols-2">
            <Card>
              <h2 className="mb-6 text-xl font-bold">Tutor Courses</h2>
              {profile.courses.length ? (
                <div className="space-y-3">
                  {profile.courses.map((course) => (
                    <Link
                      key={course.id}
                      to={`/courses/${course.id}`}
                      className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40 dark:border-slate-800 dark:hover:bg-slate-800"
                    >
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <p className="mt-2 text-xs text-slate-500">
                          {course.type} · ₮{Number(course.price || 0).toLocaleString()}
                        </p>
                      </div>
                      <ArrowUpRight size={18} className="shrink-0 text-indigo-600" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No courses yet.</p>
              )}
            </Card>

            <Card>
              <h2 className="mb-6 text-xl font-bold">Student Reviews</h2>
              {profile.reviews.length ? (
                <div className="space-y-4">
                  {profile.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">
                          {review.student_name}
                        </p>
                        <span className="flex items-center gap-1 text-sm font-bold text-amber-600">
                          <Star size={15} fill="currentColor" />
                          {review.rating}/5
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-300">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No reviews yet.</p>
              )}
            </Card>
          </div>
        </>
      )}
    </PageContainer>
  );
}
