import { useEffect, useState } from "react";
import api from "../api/api";
import StatusBadge from "../components/StatusBadge";

export default function AdminDashboard() {
  const [cases, setCases] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [pick, setPick] = useState({});
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "officer" });
  const [msg, setMsg] = useState("");

  const load = async () => {
    const [c, o] = await Promise.all([api.get("/violations?status=Validated"), api.get("/auth/users?role=officer")]);
    setCases(c.data);
    setOfficers(o.data);
  };
  useEffect(() => { load(); }, []);

  const assign = async (id) => {
    if (!pick[id]) return setMsg("Choose an officer first");
    await api.patch(`/violations/${id}/assign`, { officerId: pick[id] });
    setMsg("Case assigned");
    load();
  };

  const createUser = async () => {
    try {
      await api.post("/auth/users", newUser);
      setMsg("User created");
      setNewUser({ name: "", email: "", password: "", role: "officer" });
      load();
    } catch (e) {
      setMsg(e.response?.data?.message || "Failed");
    }
  };

  const setU = (k) => (e) => setNewUser({ ...newUser, [k]: e.target.value });

  return (
    <>
      {msg && <div className="card">{msg}</div>}
      <div className="card">
        <h2>Validated Cases - Assign to Officer</h2>
        <table>
          <thead><tr><th>Title</th><th>Category</th><th>Area</th><th>Status</th><th>Officer</th><th></th></tr></thead>
          <tbody>
            {cases.map((v) => (
              <tr key={v._id}>
                <td>{v.title}</td><td>{v.category}</td><td>{v.location?.area}</td>
                <td><StatusBadge status={v.status} /></td>
                <td>
                  <select value={pick[v._id] || ""} onChange={(e) => setPick({ ...pick, [v._id]: e.target.value })} style={{ margin: 0 }}>
                    <option value="">Select officer</option>
                    {officers.map((o) => <option key={o._id} value={o._id}>{o.name}</option>)}
                  </select>
                </td>
                <td><button onClick={() => assign(v._id)}>Assign</button></td>
              </tr>
            ))}
            {cases.length === 0 && <tr><td colSpan="6">No validated cases waiting.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="card">
        <h2>Create User (officer / reviewer / admin)</h2>
        <div className="row">
          <input placeholder="Name" value={newUser.name} onChange={setU("name")} />
          <input placeholder="Email" value={newUser.email} onChange={setU("email")} />
          <input placeholder="Password" type="password" value={newUser.password} onChange={setU("password")} />
          <select value={newUser.role} onChange={setU("role")}>
            <option>officer</option><option>reviewer</option><option>admin</option>
          </select>
        </div>
        <button onClick={createUser}>Create</button>
      </div>
    </>
  );
}
