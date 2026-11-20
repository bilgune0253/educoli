
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, GraduationCap, Search,
  Shield, Trash2, Users, XCircle
} from "lucide-react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/ui/StatusBadge";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [learningRequests, setLearningRequests] = useState([]);
  const [learningFilter, setLearningFilter] = useState("all");
  const [learningSearch, setLearningSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const fetchData = async () => {
    try {
      const [usersRes, coursesRes, learningRes] =
        await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/courses"),
          api.get("/admin/learning-requests")
        ]);

      setUsers(usersRes.data);
      setCourses(coursesRes.data);
      setLearningRequests(learningRes.data);
      setMessage("");
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
        "Failed to load admin dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const runAction = async (action, errorMessage) => {
    setBusy(true);
    try {
      await action();
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.error || errorMessage);
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    runAction(
      () => api.delete(`/admin/users/${id}`),
      "Failed to delete user"
    );
  };

  const handleDeleteCourse = (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    runAction(
      () => api.delete(`/admin/courses/${id}`),
      "Failed to delete course"
    );
  };

  const handleRoleChange = (id, role) => {
    runAction(
      () => api.put(`/admin/users/${id}/role`, { role }),
      "Failed to update role"
    );
  };

  const handleCloseLearningRequest = (id) => {
    if (!window.confirm("Энэ хүсэлтийг хаах уу?")) return;
    runAction(
      () => api.patch(`/admin/learning-requests/${id}/close`),
      "Хүсэлт хааж чадсангүй"
    );
  };

  const handleDeleteLearningRequest = (id) => {
    if (!window.confirm("Энэ хүсэлтийг бүрмөсөн устгах уу?")) return;
    runAction(
      () => api.delete(`/admin/learning-requests/${id}`),
      "Хүсэлт устгаж чадсангүй"
    );
  };

  const filteredLearningRequests = learningRequests.filter((item) => {
    const matchesStatus =
      learningFilter === "all" || item.status === learningFilter;

    const searchText =
      `${item.subject} ${item.topic} ${item.student_name}`.toLowerCase();

    return matchesStatus &&
      searchText.includes(learningSearch.toLowerCase());
  });

  const students = users.filter((u) => u.role === "student").length;
  const tutors = users.filter((u) => u.role === "tutor").length;
  const admins = users.filter((u) => u.role === "admin").length;

  const actionClass =
    "rounded-xl px-3 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <PageContainer className="py-10 sm:py-14">
      <PageHeader
        eyebrow="System Administration"
        title="Admin Dashboard"
        description="Хэрэглэгч, хичээл, суралцах хүсэлт болон системийн эрхийг удирдаарай."
      />

      {message && (
        <p role="alert" className="mb-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
          {message}
        </p>
      )}

      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Users" value={users.length} />
        <StatCard label="Students" value={students} color="text-indigo-600" />
        <StatCard label="Tutors" value={tutors} color="text-emerald-600" />
        <StatCard label="Admins" value={admins} color="text-rose-600" />
      </div>

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="ui-card h-72 animate-pulse" />
          <div className="ui-card h-72 animate-pulse" />
        </div>
      ) : (
        <>
          <div className="grid items-start gap-7 lg:grid-cols-2">
            <Card>
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10">
                  <Users size={21} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Users</h2>
                  <p className="text-xs text-slate-500">
                    {users.length} registered users
                  </p>
                </div>
              </div>

              <div className="max-h-[650px] space-y-3 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold">{user.name}</p>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          {user.email}
                        </p>
                      </div>
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase text-indigo-600 dark:bg-indigo-500/10">
                        {user.role}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleRoleChange(user.id, "student")}
                        className={`${actionClass} bg-indigo-600 hover:bg-indigo-700`}
                      >
                        Student
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleRoleChange(user.id, "tutor")}
                        className={`${actionClass} bg-emerald-600 hover:bg-emerald-700`}
                      >
                        Tutor
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleRoleChange(user.id, "admin")}
                        className={`${actionClass} bg-amber-500 hover:bg-amber-600`}
                      >
                        Admin
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleDeleteUser(user.id)}
                        className={`${actionClass} flex items-center gap-1 bg-rose-600 hover:bg-rose-700`}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}

                {!users.length && (
                  <p className="py-8 text-center text-sm text-slate-500">
                    No users found.
                  </p>
                )}
              </div>
            </Card>

            <Card>
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10">
                  <BookOpen size={21} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Courses</h2>
                  <p className="text-xs text-slate-500">
                    {courses.length} published courses
                  </p>
                </div>
              </div>

              <div className="max-h-[650px] space-y-3 overflow-y-auto">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold">{course.title}</h3>
                        <p className="mt-2 text-sm text-slate-500">
                          Tutor: {course.tutor_name || course.tutor_id}
                        </p>
                      </div>
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10">
                        {course.type}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleDeleteCourse(course.id)}
                      className={`${actionClass} flex items-center gap-2 bg-rose-600 hover:bg-rose-700`}
                    >
                      <Trash2 size={15} />
                      Delete Course
                    </button>
                  </div>
                ))}

                {!courses.length && (
                  <p className="py-8 text-center text-sm text-slate-500">
                    No courses found.
                  </p>
                )}
              </div>
            </Card>
          </div>

          <section className="mt-10">
            <div className="mb-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                Learning Marketplace
              </p>
              <h2 className="text-2xl font-extrabold sm:text-3xl">
                Learning Requests Management
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Суралцагчдын нийтэлсэн хүсэлтүүдийг удирдах
              </p>
            </div>

            <Card>
              <div className="mb-6 grid gap-3 md:grid-cols-2">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={learningSearch}
                    onChange={(e) => setLearningSearch(e.target.value)}
                    placeholder="Хичээл, сэдэв, оюутнаар хайх..."
                    aria-label="Search learning requests"
                    className="ui-input w-full pl-11"
                  />
                </div>

                <select
                  value={learningFilter}
                  onChange={(e) => setLearningFilter(e.target.value)}
                  aria-label="Filter learning requests"
                  className="ui-input w-full"
                >
                  <option value="all">All Requests</option>
                  <option value="open">Open</option>
                  <option value="matched">Matched</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <p className="mb-5 text-sm text-slate-500">
                Нийт: {learningRequests.length} ·
                Харагдаж буй: {filteredLearningRequests.length}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {filteredLearningRequests.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase text-indigo-600">
                          {item.subject}
                        </p>
                        <h3 className="mt-2 text-lg font-bold">
                          {item.topic}
                        </h3>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {item.description}
                    </p>

                    <div className="mt-5 space-y-1 text-sm text-slate-500">
                      <p>Суралцагч: {item.student_name}</p>
                      <p className="break-all">
                        Имэйл: {item.student_email}
                      </p>
                      <p>Ирсэн санал: {item.offer_count}</p>
                      {item.selected_tutor && (
                        <p>Сонгогдсон багш: {item.selected_tutor}</p>
                      )}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
                      <Link
                        to={`/learning-requests/${item.id}`}
                        className="ui-button ui-button-outline"
                      >
                        View Details
                      </Link>

                      {item.status === "open" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleCloseLearningRequest(item.id)}
                          className={`${actionClass} flex items-center gap-2 bg-amber-500 hover:bg-amber-600`}
                        >
                          <XCircle size={15} />
                          Close
                        </button>
                      )}

                      {item.status === "closed" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleDeleteLearningRequest(item.id)}
                          className={`${actionClass} flex items-center gap-2 bg-rose-600 hover:bg-rose-700`}
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {!filteredLearningRequests.length && (
                <div className="py-14 text-center">
                  <GraduationCap
                    size={36}
                    className="mx-auto text-indigo-400"
                  />
                  <p className="mt-4 text-sm text-slate-500">
                    Хүсэлт олдсонгүй.
                  </p>
                </div>
              )}
            </Card>
          </section>
        </>
      )}
    </PageContainer>
  );
}
