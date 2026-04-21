import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Reviews() {
  const { tutorId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/${tutorId}`);
      setReviews(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reviews", {
        tutor_id: Number(tutorId),
        rating: Number(form.rating),
        comment: form.comment,
      });
      setForm({ rating: 5, comment: "" });
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.error || "Review failed");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [tutorId]);

  return (
    <div style={{ padding: "24px" }}>
      <h2>Reviews</h2>

      {user?.role === "student" && (
        <form onSubmit={submitReview} style={styles.form}>
          <select
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
          >
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>

          <textarea
            placeholder="Comment"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />

          <button type="submit">Submit Review</button>
        </form>
      )}

      {reviews.map((review) => (
        <div key={review.id} style={styles.card}>
          <p><strong>{review.student_name}</strong></p>
          <p>Rating: {review.rating}</p>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "400px",
    marginBottom: "24px",
  },
  card: {
    border: "1px solid #ddd",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
  },
};

export default Reviews;