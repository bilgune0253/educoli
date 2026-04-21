import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="mb-4 inline-block rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Student-to-Student Learning Platform
          </p>
          <h1 className="mb-6 text-5xl font-bold leading-tight text-slate-900">
            Learn faster with
            <span className="block text-indigo-600">Educoli</span>
          </h1>
          <p className="mb-8 max-w-xl text-lg leading-8 text-slate-600">
            Educoli is a peer-to-peer learning web app where university students
            can teach each other, request lessons, and share knowledge in a simple
            and organized way.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/courses"
              className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
            >
              Explore Courses
            </Link>
            <Link
              to="/register"
              className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
          <div className="grid gap-4">
            <div className="rounded-2xl bg-indigo-50 p-5">
              <h3 className="mb-2 text-lg font-semibold text-indigo-700">For Students</h3>
              <p className="text-slate-600">
                Find tutors, request lessons, and review your learning experience.
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-5">
              <h3 className="mb-2 text-lg font-semibold text-emerald-700">For Tutors</h3>
              <p className="text-slate-600">
                Create courses, receive requests, and grow your reputation.
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-5">
              <h3 className="mb-2 text-lg font-semibold text-amber-700">Modern Workflow</h3>
              <p className="text-slate-600">
                Secure login, role-based actions, and a clean interface for real use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;