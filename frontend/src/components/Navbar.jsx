import { Link, useNavigate } from "react-router-dom";
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
      <b>Traffic Violation System</b>
      <div className="links">
        {links[user.role].map(([to, label]) => (
          <Link key={to} to={to}>{label}</Link>
        ))}
      </div>
      <span>
        {user.name} ({user.role}){" "}
        <button onClick={() => { logout(); nav("/login"); }}>Logout</button>
      </span>
    </nav>
  );
}
