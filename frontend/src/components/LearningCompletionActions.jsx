
import { useState } from "react";
import {
  CheckCircle2, Clock3, AlertTriangle, Flag
} from "lucide-react";
import api from "../services/api";

export default function LearningCompletionActions({
  item, user, onUpdated
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!item || !user) return null;

  const isStudent =
    String(item.student_id) === String(user.id);

  const selectedOffer = item.offers?.find(
    (offer) => offer.status === "accepted"
  );

  const isSelectedTutor =
    selectedOffer &&
    String(selectedOffer.tutor_id) === String(user.id);

  const performAction = async (endpoint, confirmation) => {
    if (!window.confirm(confirmation)) return;

    setBusy(true);
    setError("");

    try {
      await api.patch(
        `/learning-requests/${item.id}/${endpoint}`
      );
      if (onUpdated) await onUpdated();
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Үйлдэл амжилтгүй боллоо"
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10">
          <Flag size={21} />
        </div>
        <div>
          <h3 className="text-xl font-bold">
            Хичээлийн явц
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Сургалтын дуусгалт болон баталгаажуулалт
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
          {error}
        </p>
      )}

      {item.status === "matched" && isSelectedTutor && (
        <div className="rounded-2xl bg-indigo-50 p-5 dark:bg-indigo-500/10">
          <p className="mb-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Хичээл дууссан бол суралцагчид баталгаажуулах хүсэлт илгээнэ.
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              performAction(
                "request-completion",
                "Хичээл дууссаныг суралцагчид мэдэгдэх үү?"
              )
            }
            className="ui-button ui-button-primary disabled:opacity-50"
          >
            <CheckCircle2 size={17} />
            {busy ? "Түр хүлээнэ үү..." : "Хичээл дууссан"}
          </button>
        </div>
      )}

      {item.status === "completion_pending" && isStudent && (
        <div className="rounded-2xl bg-amber-50 p-5 dark:bg-amber-500/10">
          <div className="mb-3 flex items-center gap-2 font-bold text-amber-700 dark:text-amber-300">
            <Clock3 size={19} />
            Баталгаажуулалт хүлээгдэж байна
          </div>
          <p className="mb-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Багш хичээл дууссаныг мэдэгдлээ.
            Та баталгаажуулах уу?
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                performAction(
                  "confirm-completion",
                  "Хичээл дууссаныг баталгаажуулах уу? Чат архивлагдана."
                )
              }
              className="ui-button bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <CheckCircle2 size={17} />
              Баталгаажуулах
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                performAction(
                  "dispute-completion",
                  "Хичээл дуусаагүй гэж мэдэгдэх үү?"
                )
              }
              className="ui-button border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 disabled:opacity-50"
            >
              <AlertTriangle size={17} />
              Татгалзах
            </button>
          </div>
        </div>
      )}

      {item.status === "completion_pending" && isSelectedTutor && (
        <div className="flex items-center gap-3 rounded-2xl bg-amber-50 p-5 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
          <Clock3 size={20} />
          Суралцагчийн баталгаажуулалтыг хүлээж байна.
        </div>
      )}

      {item.status === "completed" && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-5 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          <CheckCircle2 size={21} />
          Хичээл амжилттай дууссан. Чат архивлагдсан.
        </div>
      )}

      {item.status === "disputed" && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 p-5 text-sm font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
          <AlertTriangle size={21} />
          Хичээлийн дуусгалттай холбоотой маргаан үүссэн.
          Админы шийдвэрийг хүлээнэ.
        </div>
      )}
    </div>
  );
}
