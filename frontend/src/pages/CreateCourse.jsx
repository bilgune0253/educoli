import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

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
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <h2 className="mb-2 text-3xl font-bold text-slate-900">Create New Course</h2>
        <p className="mb-8 text-sm text-slate-500">
          Add a new lesson and make it available for students.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Course title
            </label>
            <input
              name="title"
              placeholder="Enter course title"
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              rows="5"
              placeholder="Describe your course"
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Price
              </label>
              <input
                name="price"
                type="number"
                placeholder="Enter price"
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Create Course
          </button>
        </form>

        {message && (
          <p className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default CreateCourse;