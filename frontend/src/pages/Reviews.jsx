import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Reviews() {
  const { tutorId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/${tutorId}`);
      setReviews(res.data);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to load reviews");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/reviews", {
        tutor_id: Number(tutorId),
        rating: Number(form.rating),
        comment: form.comment,
      });
      setForm({ rating: 5, comment: "" });
      fetchReviews();
    } catch (err) {
      setMessage(err.response?.data?.error || "Review failed");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [tutorId]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-indigo-600">Tutor profile feedback</p>
        <h1 className="text-4xl font-bold text-slate-900">Reviews</h1>
        <p className="mt-2 text-slate-500">
          Read student feedback and ratings for this tutor.
        </p>
      </div>

      {user?.role === "student" && (
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Write a review</h2>

          <form onSubmit={submitReview} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Rating
              </label>
              <select
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Comment
              </label>
              <textarea
                placeholder="Share your learning experience"
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                rows="4"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}

      {message && (
        <p className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {message}
        </p>
      )}

      {reviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No reviews yet.
        </div>
      ) : (
        <div className="grid gap-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-lg font-bold text-slate-900">{review.student_name}</p>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                  {review.rating}/5
                </span>
              </div>
              <p className="leading-7 text-slate-600">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reviews;