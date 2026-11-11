import { useEffect, useState } from "react";
import api from "../api/api";
import StatusBadge from "../components/StatusBadge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Reports() {
  const [cat, setCat] = useState([]);
  const [pending, setPending] = useState([]);
  const [area, setArea] = useState([]);
  const [res, setRes] = useState({ byStatus: [], byOfficer: [] });

  useEffect(() => {
    api.get("/reports/category").then((r) => setCat(r.data));
    api.get("/reports/pending").then((r) => setPending(r.data));
    api.get("/reports/area").then((r) => setArea(r.data));
    api.get("/reports/resolution").then((r) => setRes(r.data));
  }, []);

  return (
    <>
      <div className="card">
        <h2>1. Violation Category Report</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={cat}><XAxis dataKey="category" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="total" fill="#2563eb" /></BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2>2. Pending Violation Report ({pending.length})</h2>
        <table>
          <thead><tr><th>Title</th><th>Category</th><th>Area</th><th>Status</th><th>Reported on</th></tr></thead>
          <tbody>
            {pending.map((v) => (
              <tr key={v._id}>
                <td>{v.title}</td><td>{v.category}</td><td>{v.location?.area}</td>
                <td><StatusBadge status={v.status} /></td>
                <td>{new Date(v.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {pending.length === 0 && <tr><td colSpan="5">No pending violations.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>3. Area-wise Violation Report</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={area}><XAxis dataKey="area" /><YAxis allowDecimals={false} /><Tooltip /><Legend />
            <Bar dataKey="total" fill="#d97706" name="Total" /><Bar dataKey="resolved" fill="#16a34a" name="Resolved" /></BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2>4. Resolution / Action Report</h2>
        <h4>By status</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={res.byStatus}><XAxis dataKey="status" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="total" fill="#7c3aed" /></BarChart>
        </ResponsiveContainer>
        <h4>Officer performance</h4>
        <table>
          <thead><tr><th>Officer</th><th>Assigned</th><th>Resolved</th></tr></thead>
          <tbody>
            {res.byOfficer.map((o) => <tr key={o.officer}><td>{o.officer}</td><td>{o.assigned}</td><td>{o.resolved}</td></tr>)}
            {res.byOfficer.length === 0 && <tr><td colSpan="3">No assigned cases yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
