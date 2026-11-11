import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import StatusBadge from "../components/StatusBadge";

export default function ViolationDetails() {
  const { id } = useParams();
  const [v, setV] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/violations/${id}`).then((r) => setV(r.data)).catch((e) => setError(e.response?.data?.message || "Error"));
  }, [id]);

  if (error) return <div className="card error">{error}</div>;
  if (!v) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <h2>{v.title} <StatusBadge status={v.status} /></h2>
      <p><b>Category:</b> {v.category} | <b>Area:</b> {v.location?.area} | <b>Vehicle:</b> {v.vehicleNumber || "-"}</p>
      <p><b>Location:</b> {v.location?.lat ?? "-"}, {v.location?.lng ?? "-"}</p>
      <p><b>Reported by:</b> {v.reportedBy?.name} | <b>Reviewer:</b> {v.reviewer?.name || "-"} | <b>Officer:</b> {v.officer?.name || "-"}</p>
      <p>{v.description}</p>
      <div className="imgs">{v.evidence.map((e) => <a key={e} href={e} target="_blank" rel="noreferrer"><img src={e} alt="evidence" /></a>)}</div>
      <h3>Timeline</h3>
      <ul className="timeline">
        {v.history.map((h, i) => (
          <li key={i}>
            <StatusBadge status={h.status} /> {h.note && `- ${h.note}`}
            <div className="small">{h.by?.name} ({h.by?.role}) on {new Date(h.at).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
