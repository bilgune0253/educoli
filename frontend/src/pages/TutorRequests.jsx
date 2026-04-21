import { useEffect, useState } from "react";
import api from "../services/api";

function TutorRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/requests/tutor");
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/requests/${id}`, { status });
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h2>Tutor Requests</h2>
      {requests.map((r) => (
        <div key={r.id} style={styles.card}>
          <h3>{r.title}</h3>
          <p>Student: {r.student_name}</p>
          <p>Status: {r.status}</p>
          <button onClick={() => updateStatus(r.id, "accepted")}>Accept</button>
          <button onClick={() => updateStatus(r.id, "rejected")}>Reject</button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
  },
};

export default TutorRequests;