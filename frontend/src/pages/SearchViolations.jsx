import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import StatusBadge from "../components/StatusBadge";
import { CATEGORIES, AREAS, STATUSES } from "../constants";

export default function SearchViolations() {
  const [f, setF] = useState({ search: "", category: "", area: "", status: "", from: "", to: "" });
  const [items, setItems] = useState([]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const run = () => {
    const params = Object.fromEntries(Object.entries(f).filter(([, v]) => v));
    api.get("/violations", { params }).then((r) => setItems(r.data));
  };
  useEffect(() => { run(); }, []);

  return (
    <div className="card">
      <h2>Search Violations</h2>
      <div className="row">
        <input placeholder="Title / vehicle no. / description" value={f.search} onChange={set("search")} />
        <select value={f.category} onChange={set("category")}><option value="">All categories</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        <select value={f.area} onChange={set("area")}><option value="">All areas</option>{AREAS.map((a) => <option key={a}>{a}</option>)}</select>
        <select value={f.status} onChange={set("status")}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      <div className="row">
        <div><label className="small">From</label><input type="date" value={f.from} onChange={set("from")} /></div>
        <div><label className="small">To</label><input type="date" value={f.to} onChange={set("to")} /></div>
        <div style={{ alignSelf: "end" }}><button onClick={run}>Search</button></div>
      </div>
      <table>
        <thead><tr><th>Title</th><th>Category</th><th>Area</th><th>Vehicle</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          {items.map((v) => (
            <tr key={v._id}>
              <td><Link to={`/violations/${v._id}`}>{v.title}</Link></td>
              <td>{v.category}</td><td>{v.location?.area}</td><td>{v.vehicleNumber || "-"}</td>
              <td><StatusBadge status={v.status} /></td>
              <td>{new Date(v.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan="6">No results.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
