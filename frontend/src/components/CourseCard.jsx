
import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, GraduationCap } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import VerifiedBadge from "./VerifiedBadge";

export default function CourseCard({ course, onRequest, canRequest = false }) {
  return (
    <Card hover className="flex h-full flex-col" padding={false}>
      <div className="flex items-center justify-between gap-3 p-5 pb-0">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          {course.type || "Course"}
        </span>
        <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
          ₮{Number(course.price || 0).toLocaleString()}
        </span>
      </div>

      <div className="flex-1 p-5">
        <h3 className="line-clamp-2 text-xl font-bold tracking-tight">
          {course.title}
        </h3>
        <p className="mt-3 line-clamp-3 min-h-18 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {course.description}
        </p>

        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
          <div className="flex items-center gap-2">
            <GraduationCap size={17} className="text-indigo-500" />
            <Link
              to={`/tutors/${course.tutor_id}`}
              className="font-medium hover:text-indigo-600"
            >
              {course.tutor_name}
            </Link>
            {course.tutor_is_verified && <VerifiedBadge />}
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <CalendarDays size={17} />
            <span>
              {course.schedule
                ? new Date(course.schedule).toLocaleString()
                : "Хуваарь тодорхойгүй"}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Grade: {course.grade || "—"}
            {course.tutor_student_code && ` · ${course.tutor_student_code}`}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 p-5 dark:border-slate-800">
        <Link
          to={`/courses/${course.id}`}
          className="ui-button ui-button-outline flex-1"
        >
          Details <ArrowUpRight size={16} />
        </Link>

        {canRequest && (
          <Button onClick={() => onRequest?.(course.id)}>
            Request
          </Button>
        )}

        <Link
          to={`/reviews/${course.tutor_id}`}
          className="w-full text-center text-xs font-semibold text-indigo-600 hover:underline"
        >
          View tutor reviews
        </Link>
      </div>
    </Card>
  );
}
