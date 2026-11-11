import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import StatusBadge from "../components/StatusBadge";

export default function CitizenDashboard() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/violations").then((r) => setItems(r.data)); }, []);

  return (
    <div className="card">
      <h2>My Reports</h2>
      <Link to="/submit"><button>+ Report a Violation</button></Link>
      <table style={{ marginTop: 16 }}>
        <thead><tr><th>Title</th><th>Category</th><th>Area</th><th>Status</th><th>Date</th><th></th></tr></thead>
        <tbody>
          {items.map((v) => (
            <tr key={v._id}>
              <td>{v.title}</td><td>{v.category}</td><td>{v.location?.area}</td>
              <td><StatusBadge status={v.status} /></td>
              <td>{new Date(v.createdAt).toLocaleDateString()}</td>
              <td><Link to={`/violations/${v._id}`}>View</Link></td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan="6">No reports yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
