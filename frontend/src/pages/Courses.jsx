import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (err) {
      setMessage("Failed to load courses");
    }
  };

  const requestCourse = async (course_id) => {
    try {
      await api.post("/requests", { course_id });
      alert("Request sent successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Request failed");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const text =
        `${course.title} ${course.description} ${course.tutor_name} ${course.type}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [courses, search]);

  return (
    <PageContainer className="py-10">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">Course marketplace</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Discover Courses
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Explore student-led lessons and connect with tutors.
          </p>
        </div>

        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search by title, tutor, type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-400"
          />
        </div>
      </div>

      {message && (
        <p className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
          {message}
        </p>
      )}

      {filteredCourses.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">No courses found</h3>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Try another search keyword or create a new course.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                  {course.type}
                </span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">₮ {course.price}</span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{course.title}</h3>

              <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600 dark:text-slate-300">
                {course.description}
              </p>

              <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Tutor
                </p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">{course.tutor_name}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {user?.role === "student" && (
                  <button
                    onClick={() => requestCourse(course.id)}
                    className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    Send Request
                  </button>
                )}

                <Link
                  to={`/reviews/${course.tutor_id}`}
                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  View Reviews
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

export default Courses;