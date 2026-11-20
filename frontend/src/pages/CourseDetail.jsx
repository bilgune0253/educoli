
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, GraduationCap, Image, X } from "lucide-react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import VerifiedBadge from "../components/VerifiedBadge";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    api.get(`/courses/${id}`)
      .then(({ data }) => setCourse(data))
      .catch(() => setError("Хичээлийн мэдээллийг ачаалж чадсангүй."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <PageContainer className="py-10 sm:py-14">
      <Button variant="outline" onClick={() => navigate(-1)}>
        <ArrowLeft size={17} /> Back
      </Button>

      {loading ? (
        <Card className="mt-8 animate-pulse">
          Loading course details...
        </Card>
      ) : error || !course ? (
        <Card className="mt-8 text-rose-600">
          {error || "Course not found"}
        </Card>
      ) : (
        <>
          <div className="my-8">
            <span className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-600 dark:bg-indigo-500/10">
              {course.type || "Course"}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-3xl whitespace-pre-line leading-8 text-slate-500 dark:text-slate-400">
              {course.description}
            </p>
          </div>

          <div className="grid items-start gap-7 lg:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              <Card>
                <h2 className="mb-6 text-xl font-bold">
                  Course Information
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">
                  {[
                    {
                      icon: CalendarDays,
                      label: "Schedule",
                      value: course.schedule
                        ? new Date(course.schedule).toLocaleString()
                        : "Not set"
                    },
                    {
                      icon: GraduationCap,
                      label: "Grade / GPA",
                      value: course.grade || "—"
                    }
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
                      <Icon size={20} className="mb-3 text-indigo-500" />
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="mt-1 font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {course.proof_image && (
                <Card>
                  <div className="mb-5 flex items-center gap-2">
                    <Image size={20} className="text-indigo-500" />
                    <h2 className="text-xl font-bold">Grade Proof</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowImage(true)}
                    className="w-full overflow-hidden rounded-xl"
                    aria-label="View full grade proof"
                  >
                    <img
                      src={course.proof_image}
                      alt="Grade proof"
                      className="max-h-96 w-full object-contain"
                    />
                  </button>
                  <p className="mt-3 text-xs text-slate-500">
                    Click the image to enlarge.
                  </p>
                </Card>
              )}
            </div>

            <Card className="lg:sticky lg:top-24">
              <p className="text-sm text-slate-500">Course Price</p>
              <p className="mt-2 text-4xl font-extrabold text-indigo-600">
                ₮{Number(course.price || 0).toLocaleString()}
              </p>

              <div className="my-6 border-t border-slate-100 dark:border-slate-800" />

              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Tutor
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-600">
                  {course.tutor_name?.charAt(0) || "T"}
                </div>
                <div>
                  <div className="flex items-center gap-1 font-bold">
                    {course.tutor_name}
                    {course.tutor_is_verified && <VerifiedBadge />}
                  </div>
                  <p className="text-xs text-slate-500">
                    {course.tutor_student_code}
                  </p>
                </div>
              </div>

              <Link
                to={`/tutors/${course.tutor_id}`}
                className="ui-button ui-button-primary mt-6 w-full"
              >
                View Tutor Profile
              </Link>
            </Card>
          </div>
        </>
      )}

      {showImage && course?.proof_image && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Grade proof image"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-5"
          onClick={() => setShowImage(false)}
        >
          <button
            onClick={() => setShowImage(false)}
            aria-label="Close image"
            className="absolute right-6 top-6 rounded-full bg-white p-3 text-slate-900"
          >
            <X size={20} />
          </button>
          <img
            src={course.proof_image}
            alt="Full grade proof"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
          />
        </div>
      )}
    </PageContainer>
  );
}
