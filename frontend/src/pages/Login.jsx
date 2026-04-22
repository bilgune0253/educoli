import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/users/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/courses");
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Login to continue using Educoli.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-400"
          />

          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Login
          </button>
        </form>

        {message && (
          <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
            {message}
          </p>
        )}

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Don’t have an account?{" "}
          <Link to="/register" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;