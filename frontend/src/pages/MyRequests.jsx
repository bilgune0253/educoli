import { useEffect, useState } from "react";
import api from "../services/api";

function MyRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const res = await api.get("/requests/my");
        setRequests(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMyRequests();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h2>My Requests</h2>
      {requests.map((r) => (
        <div key={r.id} style={styles.card}>
          <h3>{r.title}</h3>
          <p>Status: {r.status}</p>
          <p>Tutor: {r.tutor_name}</p>
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

export default MyRequests;