import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import PageContainer from "../components/PageContainer";

function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await api.get("/requests/my");
        const found = res.data.find((item) => String(item.id) === String(id));

        if (!found) {
          setMessage("Request not found");
          return;
        }

        setRequest(found);
      } catch (err) {
        setMessage(err.response?.data?.error || "Failed to load request details");
      }
    };

    fetchRequest();
  }, [id]);

  const getStatusClass = (status) => {
    if (status === "accepted") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20";
    }
    if (status === "rejected") {
      return "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20";
    }
    return "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20";
  };

  if (message) {
    return (
      <PageContainer className="py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            ← Back
          </button>

          <p className="text-slate-600 dark:text-slate-300">{message}</p>
        </div>
      </PageContainer>
    );
  }

  if (!request) {
    return (
      <PageContainer className="py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-300">Loading request details...</p>
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

        <span className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${getStatusClass(request.status)}`}>
          {request.status}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6">
            <p className="mb-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Request Detail
            </p>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {request.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
              {request.description}
            </p>
          </div>

          {request.proof_image && (
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Дүнгийн баталгаа (зураг)
                </p>
                <button
                  onClick={() => setShowImage(true)}
                  className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  View full image
                </button>
              </div>

              <img
                src={request.proof_image}
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
              хүсэлтийн мэдээлэл
            </h2>

            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Оюутан багш
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {request.tutor_name}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Хичээлийн төрөл
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {request.type}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Schedule
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {request.schedule
                    ? new Date(request.schedule).toLocaleString()
                    : "Not set"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Grade / GPA
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {request.grade}
                </p>
              </div>

              {request.status === "accepted" && request.meeting_link && (
                <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                    Meeting Link
                  </p>
                  <a
                    href={request.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Join Lesson
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-lg dark:border-slate-800 dark:from-slate-900 dark:to-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Хүсэлтийн мэдээлэл
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Хүлээгдэж буй болон татгалзсан хүсэлтүүд нь үндсэн хичээлийн дэлгэрэнгүй мэдээллийг харуулдаг.
               Хүлээн авсан хүсэлтүүд нь хичээл орох төрлөөс хамаарч хичээл заах анги болон meeting холбоос зэрэг хичээлд бүрэн хандах боломжийг нээж өгдөг.
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
              src={request.proof_image}
              alt="Full grade proof"
              className="max-h-[90vh] max-w-[90vw] rounded-3xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </PageContainer>
  );
}

export default RequestDetail;