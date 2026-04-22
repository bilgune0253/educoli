import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import PageContainer from "../components/PageContainer";

function Tutors() {
  const [tutors, setTutors] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await api.get("/tutors");
        setTutors(res.data);
      } catch (err) {
        setMessage(err.response?.data?.error || "Failed to load tutors");
      }
    };

    fetchTutors();
  }, []);

  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      const text = `
        ${tutor.name}
        ${tutor.email}
        ${tutor.total_courses}
        ${tutor.average_rating}
      `.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [tutors, search]);

  return (
    <PageContainer className="py-10">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Tutor directory
          </p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Tutors
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Browse student tutors and explore their profiles.
          </p>
        </div>

        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name, email, rating..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-400"
          />
        </div>
      </div>

      {message && (
        <p className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
          {message}
        </p>
      )}

      {filteredTutors.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No tutors found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {tutor.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {tutor.email}
              </p>

              <div className="mt-5 space-y-2 rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-950">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">Courses:</span> {tutor.total_courses}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">Average rating:</span>{" "}
                  {Number(tutor.average_rating).toFixed(1)}
                </p>
              </div>

              <div className="mt-6">
                <Link
                  to={`/tutors/${tutor.id}`}
                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

export default Tutors;