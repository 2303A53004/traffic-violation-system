import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import StatusBadge from "../components/StatusBadge";

export default function OfficerCases() {
  const [items, setItems] = useState([]);
  const load = () => api.get("/violations").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const update = async (id, status) => {
    const note = window.prompt("Action note (e.g. fine issued, warning given):") || "";
    try {
      await api.patch(`/violations/${id}/status`, { status, note });
      load();
    } catch (e) {
      alert(e.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="card">
      <h2>Cases</h2>
      <table>
        <thead><tr><th>Title</th><th>Category</th><th>Area</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map((v) => (
            <tr key={v._id}>
              <td><Link to={`/violations/${v._id}`}>{v.title}</Link></td>
              <td>{v.category}</td><td>{v.location?.area}</td>
              <td><StatusBadge status={v.status} /></td>
              <td>
                {v.status === "Assigned" && <button onClick={() => update(v._id, "In Progress")}>Start</button>}{" "}
                {["Assigned", "In Progress"].includes(v.status) && <button className="green" onClick={() => update(v._id, "Resolved")}>Resolve</button>}
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan="5">No cases.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
