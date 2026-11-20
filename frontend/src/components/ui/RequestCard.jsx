
import { Link } from "react-router-dom";
import {
  ArrowUpRight, CalendarDays, CreditCard,
  GraduationCap, Video
} from "lucide-react";
import Card from "./Card";
import Button from "./Button";
import StatusBadge from "./StatusBadge";
import VerifiedBadge from "../VerifiedBadge";

export default function RequestCard({
  request: r,
  onPay,
  paying = false
}) {
  const canAccess = r.status === "accepted" && r.is_paid;

  return (
    <Card hover className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-xl font-bold">{r.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-1 text-sm text-slate-500">
            <span>Багш: {r.tutor_name}</span>
            {r.tutor_is_verified && <VerifiedBadge />}
          </div>
        </div>
        <StatusBadge status={r.status} />
      </div>

      {r.is_paid && (
        <span className="mt-4 w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          Төлбөр төлөгдсөн
        </span>
      )}

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {r.description}
      </p>

      <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-800/60">
        <div className="flex items-center gap-3">
          <GraduationCap size={17} className="text-indigo-500" />
          <span>{r.type} · Grade: {r.grade || "—"}</span>
        </div>

        <div className="flex items-center gap-3">
          <CalendarDays size={17} className="text-indigo-500" />
          <span>
            {r.schedule
              ? new Date(r.schedule).toLocaleString()
              : "Хуваарь тодорхойгүй"}
          </span>
        </div>

        {r.proof_image && (
          <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
            <p className="mb-2 text-xs font-semibold text-slate-500">
              Дүнгийн нотлох зураг
            </p>
            <img
              src={r.proof_image}
              alt="Grade proof"
              className="max-h-40 w-full rounded-xl object-contain"
            />
          </div>
        )}
      </div>

      {canAccess && r.meeting_link && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <p className="mb-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            {r.type === "online" ? "Meeting link" : "Хичээлийн байр"}
          </p>
          {r.type === "online" ? (
            <a
              href={r.meeting_link}
              target="_blank"
              rel="noreferrer"
              className="break-all text-sm text-indigo-600 underline"
            >
              {r.meeting_link}
            </a>
          ) : (
            <p className="text-sm">{r.meeting_link}</p>
          )}
        </div>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        <Link
          to={`/my-requests/${r.id}`}
          className="ui-button ui-button-outline flex-1"
        >
          Details <ArrowUpRight size={16} />
        </Link>

        {r.status === "accepted" && !r.is_paid && (
          <Button disabled={paying} onClick={() => onPay(r.id)}>
            <CreditCard size={16} />
            {paying ? "Processing..." : "Pay Now"}
          </Button>
        )}

        {canAccess && r.meeting_link && r.type === "online" && (
          <a
            href={r.meeting_link}
            target="_blank"
            rel="noreferrer"
            className="ui-button bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Video size={16} /> Join Lesson
          </a>
        )}
      </div>
    </Card>
  );
}
