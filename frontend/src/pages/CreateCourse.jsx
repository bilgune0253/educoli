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
    schedule: "",
    meeting_link: "",
    grade: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!imageFile) {
      throw new Error("Please select a grade screenshot image");
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const proofImageUrl = await uploadImage();

      await api.post("/courses", {
        ...form,
        price: Number(form.price) || 0,
        proof_image: proofImageUrl,
      });

      navigate("/courses");
    } catch (err) {
      setMessage(err.response?.data?.error || err.message || "Failed to create course");
    } finally {
      setLoading(false);
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
      </div>

      <div className="max-w-3xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="title"
            placeholder="Course title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />

          <textarea
            name="description"
            rows="5"
            placeholder="Detailed description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <input
            type="datetime-local"
            name="schedule"
            value={form.schedule}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />

          {form.type === "online" && (
            <input
              name="meeting_link"
              placeholder="Google Meet / Teams link"
              value={form.meeting_link}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          )}

          <input
            name="grade"
            placeholder="Your grade / GPA for this course"
            value={form.grade}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Upload grade screenshot
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {loading ? "Publishing..." : "Publish Course"}
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