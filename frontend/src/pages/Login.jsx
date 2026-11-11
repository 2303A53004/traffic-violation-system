import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../AuthContext";

const home = { citizen: "/dashboard", reviewer: "/review", officer: "/cases", admin: "/admin" };

export default function Login() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    setError("");
    try {
      const { data } = await api.post(`/auth/${mode}`, form);
      login(data);
      nav(home[data.user.role]);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: "60px auto" }}>
      <h2>{mode === "login" ? "Login" : "Citizen Registration"}</h2>
      {error && <div className="error">{error}</div>}
      {mode === "register" && (
        <>
          <label>Name</label>
          <input value={form.name} onChange={set("name")} />
        </>
      )}
      <label>Email</label>
      <input value={form.email} onChange={set("email")} />
      <label>Password</label>
      <input type="password" value={form.password} onChange={set("password")} />
      <button onClick={submit}>{mode === "login" ? "Login" : "Register"}</button>{" "}
      <button className="gray" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Create account" : "Back to login"}
      </button>
      <p className="small">Demo: citizen@traffic.com / admin@traffic.com / reviewer@traffic.com / officer@traffic.com (password123)</p>
    </div>
  );
}
