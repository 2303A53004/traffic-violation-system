import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const links = {
  citizen: [["/dashboard", "My Reports"], ["/submit", "Report Violation"], ["/search", "Search"]],
  reviewer: [["/review", "Review Queue"], ["/search", "Search"], ["/reports", "Reports"]],
  officer: [["/cases", "My Cases"], ["/search", "Search"], ["/reports", "Reports"]],
  admin: [["/admin", "Admin"], ["/review", "Review Queue"], ["/cases", "All Cases"], ["/search", "Search"], ["/reports", "Reports"]],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  if (!user) return null;
  return (
    <nav className="navbar">
      <div className="brand">
        <span className="brand-logo">&#128678;</span>
        <span>Smart Traffic Violation System</span>
      </div>
      <div className="links">
        {links[user.role].map(([to, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : "")}>{label}</NavLink>
        ))}
      </div>
      <div className="user-box">
        <span>{user.name}</span>
        <span className="role-tag">{user.role}</span>
        <button onClick={() => { logout(); nav("/login"); }}>Logout</button>
      </div>
    </nav>
  );
}