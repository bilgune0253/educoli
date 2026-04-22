import { useState } from "react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";

function VerifyRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/verification/send", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to send verification email");
    }
  };

  return (
    <PageContainer className="py-10">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Verify your account
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Enter your university email to receive a verification link.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="University email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />

          <button
            type="submit"
            className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Send verification link
          </button>
        </form>

        {message && (
          <p className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {message}
          </p>
        )}
      </div>
    </PageContainer>
  );
}

export default VerifyRequest;