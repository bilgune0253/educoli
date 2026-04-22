import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";

function Home() {
  const stats = [
    { label: "Courses", value: "10+" },
    { label: "Active Students", value: "50+" },
    { label: "Tutors", value: "15+" },
  ];

  const features = [
    {
      title: "Find the right tutor",
      desc: "Browse lessons by topic, compare tutors, and choose the best fit for your study needs.",
    },
    {
      title: "Send requests instantly",
      desc: "Students can quickly request courses while tutors manage approvals from one clean dashboard.",
    },
    {
      title: "Build trust with reviews",
      desc: "Ratings and comments help students choose quality tutors and improve learning outcomes.",
    },
  ];

  return (
    <div className="overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <PageContainer className="py-16 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              Modern Student Learning Experience
            </span>

            <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              Learn from
              <span className="block text-indigo-600 dark:text-indigo-400">students like you</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Educoli is a student-to-student tutoring platform where learners can
              discover tutors, request lessons, and build knowledge through a clean
              and modern web experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Explore Courses
              </Link>

              <Link
                to="/register"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Join Educoli
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-500/20" />
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/20" />

            <div className="relative rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="grid gap-4">
                <div className="rounded-3xl bg-slate-900 p-6 text-white dark:bg-slate-800">
                  <p className="text-sm text-slate-300">Featured workflow</p>
                  <h3 className="mt-2 text-2xl font-bold">Request → Accept → Learn</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Students browse available courses, send requests, tutors accept them,
                    and the learning session begins.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-emerald-50 p-5 dark:bg-emerald-500/10">
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">For students</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Request courses and track your learning status in one place.
                    </p>
                  </div>

                  <div className="rounded-3xl bg-amber-50 p-5 dark:bg-amber-500/10">
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">For tutors</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Create courses, manage incoming requests, and grow your profile.
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl bg-indigo-50 p-5 dark:bg-indigo-500/10">
                  <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Clean architecture</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Built with React, Express, PostgreSQL, JWT authentication, and role-based access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>

      <PageContainer className="pb-16 sm:pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}

export default Home;