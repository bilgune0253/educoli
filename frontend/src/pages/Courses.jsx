import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
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

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-indigo-600">Available lessons</p>
          <h1 className="text-4xl font-bold text-slate-900">Courses</h1>
        </div>
      </div>

      {message && (
        <p className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {message}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                {course.type}
              </span>
              <span className="text-sm font-semibold text-slate-500">
                ₮ {course.price}
              </span>
            </div>

            <h3 className="mb-2 text-xl font-bold text-slate-900">{course.title}</h3>
            <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-600">
              {course.description}
            </p>

            <div className="mb-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Tutor: <span className="font-semibold text-slate-900">{course.tutor_name}</span>
            </div>

            <div className="flex flex-wrap gap-3">
              {user?.role === "student" && (
                <button
                  onClick={() => requestCourse(course.id)}
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Send Request
                </button>
              )}

              <Link
                to={`/reviews/${course.tutor_id}`}
                className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                View Reviews
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;