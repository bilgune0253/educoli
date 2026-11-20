
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "../components/ui/AuthLayout";
import Button from "../components/ui/Button";
import { Input, Select } from "../components/ui/Form";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    student_code: "", role: "student"
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await api.post("/users/register", form);
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.error || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account."
      subtitle="Educoli-д нэгдэж, суралцах эсвэл мэдлэгээ бусадтай хуваалцаарай."
    >
      <form onSubmit={submit} className="space-y-4">
        <Input label="Full name" name="name" required
          autoComplete="name" value={form.name}
          onChange={change} placeholder="Your full name" />

        <Input label="Email address" name="email" type="email"
          required autoComplete="email" value={form.email}
          onChange={change} placeholder="you@example.com" />

        <Input label="Password" name="password" type="password"
          required autoComplete="new-password"
          value={form.password} onChange={change}
          placeholder="Create a password" />

        <Input label="Student code" name="student_code"
          required value={form.student_code}
          onChange={change} placeholder="Your student code" />

        <Select label="I want to join as" name="role"
          value={form.role} onChange={change}>
          <option value="student">Student — суралцагч</option>
          <option value="tutor">Tutor — багш</option>
        </Select>

        {message && (
          <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
            {message}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-indigo-600 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
