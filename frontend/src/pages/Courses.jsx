
import { useEffect, useMemo, useState } from "react";
import { Search, BookOpen, SlidersHorizontal } from "lucide-react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import CourseCard from "../components/CourseCard";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    api.get("/courses")
      .then((res) => setCourses(res.data))
      .catch(() => setMessage("Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  const requestCourse = async (course_id) => {
    try {
      await api.post("/requests", { course_id });
      alert("Request sent successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Request failed");
    }
  };

  const types = useMemo(() => [
    "All",
    ...new Set(courses.map((c) => c.type).filter(Boolean))
  ], [courses]);

  const filtered = useMemo(() => courses.filter((c) => {
    const text = [
      c.title, c.description, c.tutor_name,
      c.tutor_student_code, c.type, c.grade, c.schedule
    ].join(" ").toLowerCase();

    return text.includes(search.toLowerCase()) &&
      (type === "All" || c.type === type);
  }), [courses, search, type]);

  return (
    <PageContainer className="py-10 sm:py-14">
      <div className="mb-10">
        <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
          Explore & Learn
        </span>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Discover <span className="text-indigo-600">Courses.</span>
        </h1>
        <p className="mt-4 max-w-xl text-slate-500 dark:text-slate-400">
          Discover student-led courses and learn from talented peers.
        </p>
      </div>

      <div className="ui-card mb-8 p-4 sm:p-5">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses, tutors, topics..."
            aria-label="Search courses"
            className="ui-input pl-12"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <SlidersHorizontal size={17} className="mr-1 text-slate-400" />
          {types.map((item) => (
            <button
              key={item}
              onClick={() => setType(item)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                type === item
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-indigo-50 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          Available Courses
        </h2>
        <span className="text-sm text-slate-500">
          {filtered.length} results
        </span>
      </div>

      {message && (
        <p role="alert" className="mb-6 rounded-xl bg-rose-50 p-4 text-rose-600">
          {message}
        </p>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="ui-card h-80 animate-pulse bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              canRequest={user?.role === "student"}
              onRequest={requestCourse}
            />
          ))}
        </div>
      ) : (
        <div className="ui-card py-20 text-center">
          <BookOpen size={40} className="mx-auto text-indigo-400" />
          <h3 className="mt-4 text-xl font-bold">No courses found</h3>
          <p className="mt-2 text-sm text-slate-500">
            Try another search or category.
          </p>
        </div>
      )}
    </PageContainer>
  );
}
