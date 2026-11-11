import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

export default function ReviewerQueue() {
  const [items, setItems] = useState([]);
  const load = () => api.get("/violations?status=Submitted").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const decide = async (id, decision) => {
    const note = window.prompt(`Note for this ${decision} (optional):`) || "";
    await api.patch(`/violations/${id}/review`, { decision, note });
    load();
  };

  return (
    <div className="card">
      <h2>Review Queue (awaiting validation)</h2>
      {items.length === 0 && <p>Nothing to review.</p>}
      {items.map((v) => (
        <div key={v._id} className="card" style={{ background: "#f9fafb" }}>
          <b>{v.title}</b> <span className="small">({v.category}, {v.location?.area}) by {v.reportedBy?.name}</span>
          <div className="imgs" style={{ marginTop: 8 }}>
            {v.evidence.map((e) => <a key={e} href={e} target="_blank" rel="noreferrer"><img src={e} alt="evidence" /></a>)}
          </div>
          <button className="green" onClick={() => decide(v._id, "validate")}>Validate</button>{" "}
          <button className="danger" onClick={() => decide(v._id, "reject")}>Reject</button>{" "}
          <Link to={`/violations/${v._id}`}>Details</Link>
        </div>
      ))}
    </div>
  );
}
