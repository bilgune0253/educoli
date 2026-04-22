import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";
import PageContainer from "../components/PageContainer";

function VerifyEmail() {
  const [params] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  const token = params.get("token");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.post("/verification/confirm", { token });
        setMessage(res.data.message);

        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          user.is_verified = true;
          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (err) {
        setMessage(err.response?.data?.error || "Verification failed");
      }
    };

    if (token) {
      verify();
    } else {
      setMessage("Verification token not found");
    }
  }, [token]);

  return (
    <PageContainer className="py-10">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Email Verification
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">{message}</p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Go Home
        </Link>
      </div>
    </PageContainer>
  );
}

export default VerifyEmail;