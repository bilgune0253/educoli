
import { useState } from "react";
import { Mail, ShieldCheck, Send } from "lucide-react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import Button from "../components/ui/Button";

export default function VerifyRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { data } = await api.post("/verification/send", {
        email
      });
      setMessage(data.message);
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
        "Failed to send verification email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer className="py-12 sm:py-20">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20">
            <ShieldCheck size={32} />
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
            Account Verification
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Verify your account.
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-500">
            Сургуулийн имэйл хаягаа баталгаажуулж,
            Educoli Verified Badge аваарай.
          </p>
        </div>

        <div className="ui-card p-6 sm:p-9">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label
                htmlFor="verification-email"
                className="mb-2 block text-sm font-semibold"
              >
                University Email
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="verification-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@stud.num.edu.mn"
                  disabled={loading}
                  className="ui-input w-full pl-12"
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Only @stud.num.edu.mn email is allowed.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              <Send size={17} />
              {loading ? "Sending..." : "Send Verification Link"}
            </Button>
          </form>

          {message && (
            <p role="status" className="mt-5 rounded-xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {message}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-indigo-50 p-5 dark:bg-indigo-500/10">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-indigo-600"
          />
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Баталгаажуулах холбоос таны сургуулийн имэйлд
            очно. Холбоос дээр дарснаар баталгаажуулалт
            хийгдэнэ.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
