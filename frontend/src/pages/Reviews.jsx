
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MessageSquare, Star } from "lucide-react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import VerifiedBadge from "../components/VerifiedBadge";

export default function Reviews() {
  const { tutorId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/${tutorId}`);
      setReviews(data);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [tutorId]);

  const submitReview = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    try {
      await api.post("/reviews", {
        tutor_id: Number(tutorId),
        rating: Number(form.rating),
        comment: form.comment
      });
      setForm({ rating: 5, comment: "" });
      await fetchReviews();
    } catch (err) {
      setMessage(err.response?.data?.error || "Review failed");
    } finally {
      setSaving(false);
    }
  };

  const avg = reviews.length
    ? (
        reviews.reduce((sum, r) => sum + Number(r.rating), 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  return (
    <PageContainer className="py-10 sm:py-14">
      <PageHeader
        eyebrow="Tutor Feedback"
        title="Student Reviews"
        description="Багшийн үнэлгээ, суралцагчдын сэтгэгдлийг уншаарай."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-500/10">
              <Star size={25} fill="currentColor" />
            </div>
            <div>
              <p className="text-3xl font-extrabold">{avg}</p>
              <p className="text-sm text-slate-500">Average Rating</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10">
              <MessageSquare size={25} />
            </div>
            <div>
              <p className="text-3xl font-extrabold">{reviews.length}</p>
              <p className="text-sm text-slate-500">Total Reviews</p>
            </div>
          </div>
        </Card>
      </div>

      {user?.role === "student" && (
        <Card className="mb-8">
          <h2 className="mb-2 text-xl font-bold">Write a Review</h2>
          <p className="mb-6 text-sm text-slate-500">
            Багштай суралцсан туршлагаа хуваалцаарай.
          </p>

          <form onSubmit={submitReview} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Rating
              </label>
              <select
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: e.target.value })
                }
                className="ui-input w-full"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Comment
              </label>
              <textarea
                rows={5}
                value={form.comment}
                onChange={(e) =>
                  setForm({ ...form, comment: e.target.value })
                }
                placeholder="Share your learning experience..."
                className="ui-input w-full"
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </Card>
      )}

      {message && (
        <p role="alert" className="mb-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
          {message}
        </p>
      )}

      <h2 className="mb-5 text-xl font-bold">All Reviews</h2>

      {loading ? (
        <div className="ui-card h-40 animate-pulse" />
      ) : reviews.length === 0 ? (
        <Card className="py-14 text-center">
          <MessageSquare
            size={36}
            className="mx-auto text-indigo-400"
          />
          <p className="mt-4 text-slate-500">No reviews yet.</p>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {reviews.map((review) => (
            <Card key={review.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-1">
                    <h3 className="font-bold">
                      {review.student_name}
                    </h3>
                    {review.student_is_verified && <VerifiedBadge />}
                  </div>
                  {review.student_code && (
                    <p className="mt-1 text-xs text-slate-500">
                      {review.student_code}
                    </p>
                  )}
                </div>
                <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700 dark:bg-amber-500/10">
                  <Star size={15} fill="currentColor" />
                  {review.rating}/5
                </span>
              </div>

              <p className="mt-5 whitespace-pre-wrap leading-7 text-slate-600 dark:text-slate-300">
                {review.comment}
              </p>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
