import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { CATEGORIES, AREAS } from "../constants";

export default function SubmitViolation() {
  const [form, setForm] = useState({ title: "", category: CATEGORIES[0], area: AREAS[0], vehicleNumber: "", description: "", lat: "", lng: "" });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const nav = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (p) => setForm((f) => ({ ...f, lat: p.coords.latitude.toFixed(5), lng: p.coords.longitude.toFixed(5) })),
      () => setError("Could not get your location. Allow location access or type it in.")
    );
  };

  const submit = async () => {
    setError("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    Array.from(files).forEach((f) => fd.append("evidence", f));
    try {
      await api.post("/violations", fd);
      nav("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="card">
      <h2>Report a Violation</h2>
      {error && <div className="error">{error}</div>}
      <label>Title</label>
      <input value={form.title} onChange={set("title")} />
      <div className="row">
        <div><label>Category</label>
          <select value={form.category} onChange={set("category")}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
        <div><label>Area</label>
          <select value={form.area} onChange={set("area")}>{AREAS.map((a) => <option key={a}>{a}</option>)}</select></div>
        <div><label>Vehicle number</label>
          <input value={form.vehicleNumber} onChange={set("vehicleNumber")} /></div>
      </div>
      <label>Description</label>
      <textarea rows="3" value={form.description} onChange={set("description")} />
      <div className="row">
        <div><label>Latitude</label><input value={form.lat} onChange={set("lat")} /></div>
        <div><label>Longitude</label><input value={form.lng} onChange={set("lng")} /></div>
        <div style={{ alignSelf: "end" }}><button className="gray" onClick={getLocation}>Use my location</button></div>
      </div>
      <label>Evidence photos (up to 5)</label>
      <input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} />
      <button onClick={submit}>Submit Report</button>
    </div>
  );
}
