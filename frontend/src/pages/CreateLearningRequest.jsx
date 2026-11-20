
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, CalendarDays, Wallet } from "lucide-react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import FormSection from "../components/ui/FormSection";
import Button from "../components/ui/Button";
import { Input, Select, Textarea } from "../components/ui/form";

export default function CreateLearningRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: "", topic: "", description: "",
    preferred_format: "either", budget: ""
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const field = (name) => ({
    name,
    value: form[name],
    onChange: (e) =>
      setForm((prev) => ({ ...prev, [name]: e.target.value }))
  });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const { data } = await api.post("/learning-requests", {
        ...form,
        budget: form.budget === "" ? null : Number(form.budget)
      });
      navigate(`/learning-requests/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Хүсэлт нийтэлж чадсангүй");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <PageHeader
          eyebrow="Learning Marketplace"
          title="Суралцах хүсэлт нийтлэх"
          description="Ямар хичээл, сэдвээр тусламж хэрэгтэй байгаагаа тодорхой бичээрэй."
        />

        <form onSubmit={submit} className="space-y-6">
          <FormSection icon={BookOpen}
            title="Хичээлийн мэдээлэл"
            description="Суралцахыг хүссэн хичээл болон сэдвээ оруулна уу.">
            <Input label="Хичээл" required maxLength={120}
              placeholder="Жишээ: Математик"
              {...field("subject")} />

            <Input label="Сэдэв" required maxLength={200}
              placeholder="Жишээ: Интеграл бодох арга"
              {...field("topic")} />

            <Textarea label="Дэлгэрэнгүй тайлбар" required
              maxLength={3000} rows={5}
              placeholder="Ямар хэсгийг ойлгохгүй байгаа, ямар түвшинд сурахыг хүсэж байгаагаа бичээрэй."
              {...field("description")} />
          </FormSection>

          <FormSection icon={CalendarDays}
            title="Сургалтын хэлбэр"
            description="Хичээлд хэрхэн хамрагдахыг хүсэж байна вэ?">
            <Select label="Preferred format"
              {...field("preferred_format")}>
              <option value="either">Аль аль нь</option>
              <option value="online">Онлайн</option>
              <option value="offline">Танхим</option>
            </Select>
          </FormSection>

          <FormSection icon={Wallet}
            title="Төсөв"
            description="Төлбөрийн боломжит хэмжээг оруулж болно.">
            <Input label="Төсөв (₮, заавал биш)"
              type="number" min="0" step="1"
              placeholder="Жишээ: 20000"
              {...field("budget")} />
          </FormSection>

          {error && (
            <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
              {error}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="outline" disabled={saving}
              onClick={() => navigate("/learning-requests")}>
              Буцах
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Нийтэлж байна..." : "Хүсэлт нийтлэх"}
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
