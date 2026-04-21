import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/users/register", form);
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.error || "Register failed");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <h2 className="mb-2 text-3xl font-bold text-slate-900">Create account</h2>
        <p className="mb-6 text-sm text-slate-500">
          Join Educoli and start learning or teaching.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full name"
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
          />

          <select
            name="role"
            onChange={handleChange}
            value={form.role}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
          >
            <option value="student">Student</option>
            <option value="tutor">Tutor</option>
          </select>

          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Register
          </button>
        </form>

        {message && (
          <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {message}
          </p>
        )}

        <p className="mt-6 text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;