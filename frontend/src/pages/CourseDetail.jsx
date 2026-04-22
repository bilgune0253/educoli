import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import PageContainer from "../components/PageContainer";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) {
    return (
      <PageContainer className="py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-300">Loading course details...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          ← Back
        </button>

        <span className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          {course.type}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6">
            <p className="mb-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Course Detail
            </p>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {course.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
              {course.description}
            </p>
          </div>

          {course.proof_image && (
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Grade proof screenshot
                </p>
                <button
                  onClick={() => setShowImage(true)}
                  className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  View full image
                </button>
              </div>

              <img
                src={course.proof_image}
                alt="Grade proof"
                onClick={() => setShowImage(true)}
                className="h-[320px] w-full cursor-pointer rounded-3xl border border-slate-200 object-cover transition hover:scale-[1.01] dark:border-slate-800"
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">
              Хичээлийн мэдээлэл
            </h2>

            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Оюутан багш
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {course.tutor_name}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Schedule
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {course.schedule
                    ? new Date(course.schedule).toLocaleString()
                    : "Not set"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Grade / GPA
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {course.grade}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Price
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  ₮ {course.price}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-lg dark:border-slate-800 dark:from-slate-900 dark:to-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Суралцсан баталгаа
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Энэ хичээлийг аль хэдийн амжилттай судалсан оюутан багш бэлтгэж, 
              сурлагын амжилтын нотолгоо хавсаргасан болно.
            </p>
          </div>
        </div>
      </div>

      {showImage && (
        <div
          onClick={() => setShowImage(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div className="relative max-h-[95vh] max-w-[95vw]">
            <button
              onClick={() => setShowImage(false)}
              className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-2 text-sm font-bold text-slate-900 shadow hover:bg-white"
            >
              ✕
            </button>

            <img
              src={course.proof_image}
              alt="Full grade proof"
              className="max-h-[90vh] max-w-[90vw] rounded-3xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </PageContainer>
  );
}

export default CourseDetail;