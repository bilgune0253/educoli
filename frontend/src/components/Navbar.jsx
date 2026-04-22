import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkClass = (path) =>
    `rounded-2xl px-4 py-2 text-sm font-medium transition ${
      location.pathname === path
        ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Educoli
          </Link>
          <span className="hidden rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300 md:inline-flex">
            Peer Learning Platform
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/" className={linkClass("/")}>
            Home
          </Link>

          <Link to="/courses" className={linkClass("/courses")}>
            Courses
          </Link>

          {!token && (
            <>
              <Link to="/login" className={linkClass("/login")}>
                Login
              </Link>
              <Link to="/register" className={linkClass("/register")}>
                Register
              </Link>
            </>
          )}

          {token && user?.role === "tutor" && (
            <>
              <Link to="/create-course" className={linkClass("/create-course")}>
                Create
              </Link>
              <Link to="/tutor-requests" className={linkClass("/tutor-requests")}>
                Requests
              </Link>
            </>
          )}

          {token && user?.role === "student" && (
            <Link to="/my-requests" className={linkClass("/my-requests")}>
              My Requests
            </Link>
          )}

          {token && user?.role === "admin" && (
            <Link to="/admin" className={linkClass("/admin")}>
              Admin
            </Link>
          )}

          <ThemeToggle />

          {token && (
            <div className="ml-2 hidden rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:block">
              <span className="font-semibold text-slate-900 dark:text-white">{user?.name}</span>
              <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs uppercase tracking-wide text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {user?.role}
              </span>
            </div>
          )}

          {token && (
            <button
              onClick={logout}
              className="ml-2 rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;