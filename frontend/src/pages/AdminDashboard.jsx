import { useEffect, useState } from "react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import StatCard from "../components/StatCard";
import VerifiedBadge from "../components/VerifiedBadge";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const usersRes = await api.get("/admin/users");
      const coursesRes = await api.get("/admin/courses");

      setUsers(usersRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to load admin dashboard");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    const ok = confirm("Are you sure you want to delete this user?");
    if (!ok) return;

    try {
      await api.delete(`/admin/users/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete user");
    }
  };

  const handleDeleteCourse = async (id) => {
    const ok = confirm("Are you sure you want to delete this course?");
    if (!ok) return;

    try {
      await api.delete(`/admin/courses/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete course");
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update role");
    }
  };

  const students = users.filter((u) => u.role === "student").length;
  const tutors = users.filter((u) => u.role === "tutor").length;
  const admins = users.filter((u) => u.role === "admin").length;

  return (
    <PageContainer className="py-10">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Control panel
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Manage users, courses, and system roles.
        </p>
      </div>

      {message && (
        <p className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
          {message}
        </p>
      )}

      <div className="mb-10 grid gap-5 md:grid-cols-4">
        <StatCard label="Total Users" value={users.length} color="text-slate-900 dark:text-white" />
        <StatCard label="Students" value={students} color="text-indigo-600" />
        <StatCard label="Tutors" value={tutors} color="text-emerald-600" />
        <StatCard label="Admins" value={admins} color="text-rose-600" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-5 text-2xl font-bold text-slate-900 dark:text-white">Users</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>

                  <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    {user.role}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleRoleChange(user.id, "student")}
                    className="rounded-xl bg-indigo-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600"
                  >
                    Make Student
                  </button>

                  <button
                    onClick={() => handleRoleChange(user.id, "tutor")}
                    className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Make Tutor
                  </button>

                  <button
                    onClick={() => handleRoleChange(user.id, "admin")}
                    className="rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-600"
                  >
                    Make Admin
                  </button>

                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-5 text-2xl font-bold text-slate-900 dark:text-white">Courses</h2>
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{course.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Tutor: {course.tutor_name || course.tutor_id}
                    </p>
                  </div>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                    {course.type}
                  </span>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-600"
                  >
                    Delete Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default AdminDashboard;