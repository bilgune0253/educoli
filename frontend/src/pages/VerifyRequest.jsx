import { useState } from "react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";

function VerifyRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/verification/send", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to send verification email");
    } finally {
      setLoading(false);
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

        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
          Only @stud.num.edu.mn email is allowed
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="University email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {loading ? (
              <>
                <svg
                  className="mr-2 h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              "Send verification link"
            )}
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