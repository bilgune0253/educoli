
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2, XCircle, LoaderCircle,
  ArrowRight
} from "lucide-react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [message, setMessage] = useState("Verifying...");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    const verify = async () => {
      if (!token) {
        setMessage("Verification token not found");
        setStatus("error");
        return;
      }

      try {
        const { data } = await api.post(
          "/verification/confirm",
          { token }
        );

        if (!active) return;

        setMessage(data.message);
        setStatus("success");

        const user = JSON.parse(
          localStorage.getItem("user") || "null"
        );

        if (user) {
          user.is_verified = true;
          localStorage.setItem(
            "user",
            JSON.stringify(user)
          );
        }
      } catch (err) {
        if (!active) return;
        setMessage(
          err.response?.data?.error ||
          "Verification failed"
        );
        setStatus("error");
      }
    };

    verify();
    return () => { active = false; };
  }, [token]);

  return (
    <PageContainer className="py-12 sm:py-20">
      <div className="mx-auto max-w-xl">
        <div className="ui-card p-8 text-center sm:p-12">
          <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl ${
            status === "success"
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
              : status === "error"
              ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10"
              : "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10"
          }`}>
            {status === "success" ? (
              <CheckCircle2 size={40} />
            ) : status === "error" ? (
              <XCircle size={40} />
            ) : (
              <LoaderCircle
                size={40}
                className="animate-spin"
              />
            )}
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
            Educoli Verification
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight">
            {status === "success"
              ? "Account Verified!"
              : status === "error"
              ? "Verification Failed"
              : "Verifying your email..."}
          </h1>

          <p role="status" className="mt-5 text-sm leading-7 text-slate-500">
            {message}
          </p>

          <Link
            to="/"
            className="ui-button ui-button-primary mt-8"
          >
            Go Home
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
