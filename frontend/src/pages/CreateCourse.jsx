
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, CalendarDays, ShieldCheck, Upload } from "lucide-react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import FormSection from "../components/ui/FormSection";
import Button from "../components/ui/Button";
import { Input, Select, Textarea } from "../components/ui/form";

export default function CreateCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", price: "",
    type: "online", schedule: "", meeting_link: "", grade: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (!imageFile) throw new Error("Please select a grade screenshot image");

      const data = new FormData();
      data.append("image", imageFile);

      const uploaded = await api.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      await api.post("/courses", {
        ...form,
        price: Number(form.price) || 0,
        proof_image: uploaded.data.imageUrl
      });

      navigate("/courses");
    } catch (err) {
      setMessage(err.response?.data?.error || err.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <PageHeader
          eyebrow="Tutor Workspace"
          title="Create a new course."
          description="Хичээлийн мэдээллээ бөглөж, бусад суралцагчдад мэдлэгээ хуваалцаарай."
        />

        <form onSubmit={submit} className="space-y-6">
          <FormSection
            icon={BookOpen}
            title="Basic Information"
            description="Хичээлийн нэр болон дэлгэрэнгүй тайлбар."
          >
            <Input label="Course title" name="title" required
              value={form.title} onChange={change}
              placeholder="e.g. Introduction to React" />

            <Textarea label="Description" name="description"
              required rows={5} value={form.description}
              onChange={change} placeholder="What will students learn?" />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Price (₮)" name="price" type="number"
                min="0" required value={form.price}
                onChange={change} placeholder="0" />

              <Select label="Course type" name="type"
                value={form.type} onChange={change}>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </Select>
            </div>
          </FormSection>

          <FormSection
            icon={CalendarDays}
            title="Schedule & Location"
            description="Хичээл хэзээ, хаана явагдахыг тодорхойлно."
          >
            <Input label="Course schedule" name="schedule"
              type="datetime-local" value={form.schedule}
              onChange={change} required />

            <Input
              label={form.type === "online"
                ? "Google Meet / Teams link"
                : "Хичээлийн байр"}
              name="meeting_link"
              value={form.meeting_link}
              onChange={change}
              placeholder={form.type === "online"
                ? "https://meet.google.com/..."
                : "Жишээ: 2-р байр 305"}
            />
          </FormSection>

          <FormSection
            icon={ShieldCheck}
            title="Grade Verification"
            description="Хичээлтэй холбоотой дүн болон нотлох зургаа оруулна уу."
          >
            <Input label="Grade / GPA" name="grade"
              value={form.grade} onChange={change}
              placeholder="e.g. A / 4.0" />

            <div>
              <label htmlFor="grade-proof" className="mb-2 block text-sm font-semibold">
                Upload grade screenshot
              </label>
              <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-6 text-center dark:border-indigo-500/30 dark:bg-indigo-500/5">
                <Upload size={26} className="mx-auto mb-3 text-indigo-500" />
                <input
                  id="grade-proof"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-4 file:py-2 file:font-semibold file:text-indigo-700"
                />
                {imageFile && (
                  <p className="mt-3 break-all text-xs text-slate-500">
                    Selected: {imageFile.name}
                  </p>
                )}
              </div>
            </div>
          </FormSection>

          {message && (
            <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
              {message}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="outline" disabled={loading}
              onClick={() => navigate("/courses")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Publishing..." : "Publish Course"}
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
