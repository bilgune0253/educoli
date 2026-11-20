
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, CalendarDays, GraduationCap,
  ImageIcon, MapPin, UserRound, X
} from "lucide-react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import Card from "../components/ui/Card";
import StatusBadge from "../components/ui/StatusBadge";

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const { data } = await api.get("/requests/my");
        const found = data.find(
          (item) => String(item.id) === String(id)
        );

        if (!active) return;

        if (found) {
          setRequest(found);
        } else {
          setError("Request not found");
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.error ||
            "Failed to load request details"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [id]);

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
      <div className="rounded-xl bg-indigo-100 p-2.5 text-indigo-600 dark:bg-indigo-500/20">
        <Icon size={19} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">
          {label}
        </p>
        <p className="mt-1 break-words font-semibold text-slate-900 dark:text-white">
          {value || "Not set"}
        </p>
      </div>
    </div>
  );

  return (
    <PageContainer className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="ui-button ui-button-outline mb-8"
        >
          <ArrowLeft size={17} /> Back
        </button>

        {loading ? (
          <div className="ui-card h-72 animate-pulse" />
        ) : error || !request ? (
          <Card>
            <p role="alert" className="text-rose-600">
              {error || "Request not found"}
            </p>
          </Card>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                  Course Request
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  {request.title}
                </h1>
                <p className="mt-3 text-sm text-slate-500">
                  Request #{request.id}
                </p>
              </div>
              <StatusBadge status={request.status} />
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
              <div className="space-y-6">
                <Card>
                  <h2 className="mb-4 text-xl font-bold">
                    About this course
                  </h2>
                  <p className="whitespace-pre-line leading-8 text-slate-600 dark:text-slate-300">
                    {request.description || "No description"}
                  </p>
                </Card>

                {request.proof_image && (
                  <Card>
                    <div className="mb-5 flex items-center gap-3">
                      <ImageIcon
                        size={21}
                        className="text-indigo-600"
                      />
                      <h2 className="text-xl font-bold">
                        Grade Proof
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowImage(true)}
                      className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <img
                        src={request.proof_image}
                        alt="Grade proof"
                        className="max-h-96 w-full object-contain"
                      />
                    </button>

                    <p className="mt-3 text-xs text-slate-500">
                      Click the image to view full size.
                    </p>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card>
                  <h2 className="mb-5 text-xl font-bold">
                    Request Information
                  </h2>

                  <div className="space-y-3">
                    <InfoItem
                      icon={UserRound}
                      label="Tutor"
                      value={request.tutor_name}
                    />
                    <InfoItem
                      icon={GraduationCap}
                      label="Course type"
                      value={request.type}
                    />
                    <InfoItem
                      icon={CalendarDays}
                      label="Schedule"
                      value={
                        request.schedule
                          ? new Date(request.schedule).toLocaleString()
                          : "Not set"
                      }
                    />
                    <InfoItem
                      icon={GraduationCap}
                      label="Grade / GPA"
                      value={request.grade}
                    />
                  </div>

                  {request.status === "accepted" &&
                    request.meeting_link && (
                    <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                      <div className="mb-3 flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-300">
                        <MapPin size={18} />
                        Lesson Access
                      </div>

                      {request.type === "online" ? (
                        <a
                          href={request.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="ui-button bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Join Lesson
                        </a>
                      ) : (
                        <p className="break-words text-sm">
                          {request.meeting_link}
                        </p>
                      )}
                    </div>
                  )}
                </Card>

                <Card>
                  <h3 className="font-bold">
                    Request Status
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                    Accepted requests provide access to the
                    lesson details. Pending requests are
                    waiting for tutor approval.
                  </p>
                </Card>
              </div>
            </div>

            {showImage && request.proof_image && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Full grade proof"
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-5"
                onClick={() => setShowImage(false)}
              >
                <button
                  type="button"
                  onClick={() => setShowImage(false)}
                  aria-label="Close"
                  className="absolute right-6 top-6 rounded-full bg-white p-3 text-slate-900"
                >
                  <X size={20} />
                </button>

                <img
                  src={request.proof_image}
                  alt="Full grade proof"
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-[85vh] max-w-full rounded-xl object-contain"
                />
              </div>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}
