
import { useEffect, useState } from "react";
import {
  Link, NavLink, useLocation, useNavigate
} from "react-router-dom";
import {
  Menu, X, ChevronDown, LogOut,
  BookOpen, Users, Home, MessageCircle,
  LayoutDashboard, PlusCircle, ClipboardList,
  ShieldCheck, GraduationCap
} from "lucide-react";

import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import VerifiedBadge from "./VerifiedBadge";

const publicLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/tutors", label: "Tutors", icon: Users },
  {
    to: "/learning-requests",
    label: "Learning Requests",
    icon: ClipboardList
  },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const token = localStorage.getItem("token");
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const isLoggedIn = Boolean(token && user);

  const roleLabels = {
    student: "Student",
    tutor: "Tutor",
    admin: "Administrator"
  };

  const roleLabel = roleLabels[user?.role] || "Member";
  const initials = (user?.name || "U")
    .trim().charAt(0).toUpperCase();

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMobileOpen(false);
    setProfileOpen(false);
    navigate("/login");
  };

  const roleLinks = !isLoggedIn ? [] : [
    ...(user.role === "student" ? [
      {
        to: "/my-requests",
        label: "My Requests",
        icon: ClipboardList
      }
    ] : []),
    ...(user.role === "tutor" ? [
      {
        to: "/create-course",
        label: "Create Course",
        icon: PlusCircle
      },
      {
        to: "/tutor-requests",
        label: "Requests",
        icon: ClipboardList
      }
    ] : []),
    ...(user.role === "admin" ? [
      {
        to: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard
      }
    ] : []),
    ...(!user.is_verified ? [
      {
        to: "/verify-request",
        label: "Get Verified",
        icon: ShieldCheck
      }
    ] : []),
    {
      to: "/messages",
      label: "Messages",
      icon: MessageCircle
    }
  ];

  const links = [...publicLinks, ...roleLinks];

  const navClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-3 py-2.5
     text-sm font-medium transition-colors
     ${isActive
       ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
       : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
     }`;

  const NavItems = ({ mobile = false }) => (
    <>
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={navClass}
          onClick={() => mobile && setMobileOpen(false)}
        >
          <Icon size={17} className="shrink-0" />
          <span>{label}</span>
        </NavLink>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b
      border-slate-200/80 bg-white/95 backdrop-blur-xl
      dark:border-slate-800 dark:bg-slate-950/95">

      <div className="mx-auto flex h-[72px] max-w-[1600px]
        items-center gap-5 px-4 sm:px-6 xl:px-8">

        {/* Brand */}
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center
            justify-center rounded-xl bg-indigo-600
            text-white shadow-md shadow-indigo-500/20">
            <GraduationCap size={23} />
          </div>

          <div className="leading-tight">
            <div className="text-xl font-extrabold
              tracking-tight text-slate-900 dark:text-white">
              Educoli
            </div>
            <div className="text-[9px] font-bold
              tracking-[0.15em] text-slate-400">
              LEARN TOGETHER
            </div>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden min-w-0 flex-1
          items-center justify-center gap-1 xl:flex">
          {publicLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={navClass}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}

          {isLoggedIn && roleLinks.length > 0 && (
            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl
                  px-3 py-2.5 text-sm font-medium text-slate-600
                  hover:bg-slate-100 dark:text-slate-300
                  dark:hover:bg-slate-800"
              >
                Workspace
                <ChevronDown size={15} />
              </button>

              <div className="invisible absolute left-0 top-full
                z-50 w-56 pt-2 opacity-0 transition
                group-hover:visible group-hover:opacity-100
                group-focus-within:visible
                group-focus-within:opacity-100">
                <div className="rounded-2xl border
                  border-slate-200 bg-white p-2 shadow-xl
                  dark:border-slate-800 dark:bg-slate-900">
                  {roleLinks.map(({ to, label, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={navClass}
                    >
                      <Icon size={17} />
                      {label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {isLoggedIn && <NotificationBell />}

          {!isLoggedIn ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/login"
                className="ui-button ui-button-ghost"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="ui-button ui-button-primary"
              >
                Get started
              </Link>
            </div>
          ) : (
            <div className="relative hidden lg:block">
              <button
                type="button"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl
                  border border-slate-200 bg-white p-1.5 pr-3
                  transition hover:bg-slate-50
                  dark:border-slate-700 dark:bg-slate-900"
              >
                <span className="flex h-9 w-9 items-center
                  justify-center rounded-lg bg-indigo-100
                  font-bold text-indigo-700 dark:bg-indigo-500/20
                  dark:text-indigo-300">
                  {initials}
                </span>

                <span className="hidden text-left xl:block">
                  <span className="flex items-center gap-1
                    text-sm font-semibold text-slate-800
                    dark:text-white">
                    {user.name}
                    {user.is_verified && <VerifiedBadge />}
                  </span>
                  <span className="block text-xs text-slate-400">
                    {roleLabel}
                  </span>
                </span>
                <ChevronDown size={15} />
              </button>

              {profileOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-full
                    z-50 mt-2 w-56 rounded-2xl border
                    border-slate-200 bg-white p-2 shadow-xl
                    dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-100
                      px-3 py-2 dark:border-slate-800">
                      <p className="truncate text-sm font-semibold">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {roleLabel}
                      </p>
                    </div>
                    <button
                      onClick={logout}
                      className="mt-1 flex w-full items-center
                        gap-2 rounded-xl px-3 py-2.5 text-sm
                        font-medium text-rose-600
                        hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    >
                      <LogOut size={17} />
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Mobile menu */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center
              justify-center rounded-xl border
              border-slate-200 text-slate-700
              dark:border-slate-700 dark:text-white xl:hidden"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="max-h-[calc(100dvh-72px)]
          overflow-y-auto border-t border-slate-200
          bg-white px-4 py-4 dark:border-slate-800
          dark:bg-slate-950 xl:hidden">

          {isLoggedIn && (
            <div className="mb-4 flex items-center gap-3
              rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
              <span className="flex h-11 w-11 items-center
                justify-center rounded-xl bg-indigo-100
                font-bold text-indigo-700">
                {initials}
              </span>
              <div>
                <div className="flex items-center gap-1 font-semibold">
                  {user.name}
                  {user.is_verified && <VerifiedBadge />}
                </div>
                <p className="text-xs text-slate-400">
                  {roleLabel}
                </p>
              </div>
            </div>
          )}

          <nav className="grid gap-1 sm:grid-cols-2">
            <NavItems mobile />
          </nav>

          <div className="mt-4 border-t border-slate-200
            pt-4 dark:border-slate-800">
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="flex w-full items-center gap-2
                  rounded-xl px-3 py-3 text-sm font-semibold
                  text-rose-600 hover:bg-rose-50"
              >
                <LogOut size={18} />
                Log out
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="ui-button ui-button-outline flex-1"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="ui-button ui-button-primary flex-1"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
