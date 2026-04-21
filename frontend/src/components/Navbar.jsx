import { Link, useNavigate, useLocation } from "react-router-dom";

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
    `px-4 py-2 rounded-xl text-sm font-medium transition ${
      location.pathname === path
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900">
          Educoli
        </Link>

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
                Create Course
              </Link>
              <Link to="/tutor-requests" className={linkClass("/tutor-requests")}>
                Tutor Requests
              </Link>
            </>
          )}

          {token && user?.role === "student" && (
            <Link to="/my-requests" className={linkClass("/my-requests")}>
              My Requests
            </Link>
          )}

          {token && (
            <button
              onClick={logout}
              className="ml-2 rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;