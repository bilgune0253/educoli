
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import api from "../services/api";
import AuthLayout from "../components/ui/AuthLayout";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/form";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { data } = await api.post("/users/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/courses");
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Educoli-д тавтай морил. Үргэлжлүүлэхийн тулд нэвтэрнэ үү."
    >
      <form onSubmit={submit} className="space-y-5">
        <Input
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={change}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={change}
          placeholder="Enter your password"
        />

        {message && (
          <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
            {message}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign in"}
          {!loading && <ArrowRight size={17} />}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link to="/register" className="font-bold text-indigo-600 hover:underline">
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}
