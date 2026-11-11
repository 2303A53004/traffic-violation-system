import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import CitizenDashboard from "./pages/CitizenDashboard";
import SubmitViolation from "./pages/SubmitViolation";
import ViolationDetails from "./pages/ViolationDetails";
import ReviewerQueue from "./pages/ReviewerQueue";
import AdminDashboard from "./pages/AdminDashboard";
import OfficerCases from "./pages/OfficerCases";
import SearchViolations from "./pages/SearchViolations";
import Reports from "./pages/Reports";

const home = { citizen: "/dashboard", reviewer: "/review", officer: "/cases", admin: "/admin" };

function Guard({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={home[user.role]} replace />;
  return children;
}

function Home() {
  const { user } = useAuth();
  return <Navigate to={user ? home[user.role] : "/login"} replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Guard roles={["citizen"]}><CitizenDashboard /></Guard>} />
          <Route path="/submit" element={<Guard roles={["citizen"]}><SubmitViolation /></Guard>} />
          <Route path="/violations/:id" element={<Guard><ViolationDetails /></Guard>} />
          <Route path="/review" element={<Guard roles={["reviewer", "admin"]}><ReviewerQueue /></Guard>} />
          <Route path="/admin" element={<Guard roles={["admin"]}><AdminDashboard /></Guard>} />
          <Route path="/cases" element={<Guard roles={["officer", "admin"]}><OfficerCases /></Guard>} />
          <Route path="/search" element={<Guard><SearchViolations /></Guard>} />
          <Route path="/reports" element={<Guard roles={["admin", "reviewer", "officer"]}><Reports /></Guard>} />
        </Routes>
      </div>
    </>
  );
}
