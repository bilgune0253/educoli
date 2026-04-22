import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";

function CreateCourse() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "online",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/courses", {
        ...form,
        price: Number(form.price),
      });
      navigate("/courses");
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to create course");
    }
  };

  return (
    <PageContainer className="py-10">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Tutor dashboard
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Create Course
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Publish a new course for students to discover and request.
        </p>
      </div>

      <div className="max-w-3xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Course title
            </label>
            <input
              name="title"
              placeholder="Enter course title"
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Description
            </label>
            <textarea
              name="description"
              rows="5"
              placeholder="Describe your course"
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-400"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Price
              </label>
              <input
                name="price"
                type="number"
                placeholder="Enter price"
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-400"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Publish Course
          </button>
        </form>

        {message && (
          <p className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
            {message}
          </p>
        )}
      </div>
    </PageContainer>
  );
}

export default CreateCourse;