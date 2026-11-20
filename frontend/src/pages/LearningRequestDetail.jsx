
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, BookOpen, Check, MessageCircle,
  Send, Users, Wallet, X
} from "lucide-react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import Card from "../components/ui/Card";
import StatusBadge from "../components/ui/StatusBadge";
import LearningCompletionActions from "../components/LearningCompletionActions";

export default function LearningRequestDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const load = async () => {
    try {
      const { data } = await api.get(`/learning-requests/${id}`);
      setItem(data);
      setError("");
    } catch {
      setError("Хүсэлт олдсонгүй");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const sendOffer = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      await api.post(`/learning-requests/${id}/offers`, {
        message,
        proposed_price: Number(price)
      });
      setMessage("");
      setPrice("");
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Алдаа гарлаа");
    } finally {
      setBusy(false);
    }
  };

  const updateRequest = async (url) => {
    setBusy(true);
    setError("");

    try {
      await api.patch(url);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Алдаа гарлаа");
    } finally {
      setBusy(false);
    }
  };

  const isOwner =
    item && String(user?.id) === String(item.student_id);

  return (
    <PageContainer className="py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/learning-requests"
          className="ui-button ui-button-outline mb-8"
        >
          <ArrowLeft size={17} />
          Бүх хүсэлт
        </Link>

        {error && (
          <p role="alert" className="mb-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-600 dark:bg-rose-500/10">
            {error}
          </p>
        )}

        {loading ? (
          <div className="ui-card h-72 animate-pulse" />
        ) : item && (
          <>
            <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                  {item.subject}
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {item.topic}
                </h1>
              </div>
              <StatusBadge status={item.status} />
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
              <div className="space-y-6">
                <Card>
                  <h2 className="mb-4 text-xl font-bold">
                    Хүсэлтийн тухай
                  </h2>
                  <p className="whitespace-pre-wrap leading-8 text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>

                  {item.status === "matched" && (
                    <Link
                      to="/messages"
                      className="ui-button ui-button-primary mt-6"
                    >
                      <MessageCircle size={17} />
                      Багштай чатлах
                    </Link>
                  )}

                  {isOwner && item.status === "open" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        updateRequest(`/learning-requests/${id}/close`)
                      }
                      className="mt-6 flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    >
                      <X size={17} />
                      Хүсэлт хаах
                    </button>
                  )}
                </Card>

                {user?.role === "tutor" &&
                  item.status === "open" &&
                  !isOwner && (
                  <Card>
                    <div className="mb-5 flex items-center gap-3">
                      <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10">
                        <Send size={21} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">
                          Заах санал илгээх
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Өөрийн туршлага, боломжтой цаг болон үнийн саналаа бичээрэй.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={sendOffer} className="space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-semibold">
                          Саналын тайлбар
                        </label>
                        <textarea
                          required
                          maxLength={2000}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Яаж заах, туршлага болон боломжтой цагаа тайлбарлана уу"
                          rows={5}
                          className="ui-input w-full"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold">
                          Үнийн санал (₮)
                        </label>
                        <input
                          required
                          type="number"
                          min="0"
                          step="1"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="Жишээ: 20000"
                          className="ui-input w-full"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={busy}
                        className="ui-button ui-button-primary disabled:opacity-50"
                      >
                        <Send size={17} />
                        {busy ? "Илгээж байна..." : "Санал илгээх"}
                      </button>
                    </form>
                  </Card>
                )}

                <section>
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                      Багш нарын санал
                    </h2>
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-600 dark:bg-indigo-500/10">
                      {item.offers?.length || 0} санал
                    </span>
                  </div>

                  <div className="space-y-4">
                    {item.offers?.map((offer) => (
                      <Card key={offer.id}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-600">
                              {offer.tutor_name?.charAt(0) || "T"}
                            </div>
                            <div>
                              <h3 className="font-bold">
                                {offer.tutor_name}
                              </h3>
                              <p className="mt-1 text-xs text-slate-500">
                                Tutor Offer
                              </p>
                            </div>
                          </div>
                          <StatusBadge status={offer.status} />
                        </div>

                        <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">
                          {offer.message}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5 dark:border-slate-800">
                          <div>
                            <p className="text-xs text-slate-500">
                              Proposed price
                            </p>
                            <p className="mt-1 text-2xl font-extrabold text-indigo-600">
                              ₮{Number(offer.proposed_price).toLocaleString()}
                            </p>
                          </div>

                          {isOwner &&
                            item.status === "open" &&
                            offer.status === "pending" && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                updateRequest(
                                  `/learning-requests/${id}/offers/${offer.id}/accept`
                                )
                              }
                              className="ui-button bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              <Check size={17} />
                              Энэ багшийг сонгох
                            </button>
                          )}
                        </div>
                      </Card>
                    ))}

                    {!item.offers?.length && (
                      <Card className="py-12 text-center">
                        <Users
                          size={34}
                          className="mx-auto text-indigo-400"
                        />
                        <h3 className="mt-4 font-bold">
                          Одоогоор санал ирээгүй
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          Багш нарын саналыг энд харуулна.
                        </p>
                      </Card>
                    )}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <Card>
                  <h2 className="mb-5 text-lg font-bold">
                    Хүсэлтийн мэдээлэл
                  </h2>

                  <div className="space-y-5">
                    <div className="flex items-start gap-3">
                      <Users size={19} className="mt-0.5 text-indigo-500" />
                      <div>
                        <p className="text-xs text-slate-500">
                          Нийтэлсэн
                        </p>
                        <p className="mt-1 font-semibold">
                          {item.student_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <BookOpen size={19} className="mt-0.5 text-indigo-500" />
                      <div>
                        <p className="text-xs text-slate-500">
                          Сургалтын хэлбэр
                        </p>
                        <p className="mt-1 font-semibold capitalize">
                          {item.preferred_format}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Wallet size={19} className="mt-0.5 text-indigo-500" />
                      <div>
                        <p className="text-xs text-slate-500">
                          Төсөв
                        </p>
                        <p className="mt-1 font-semibold">
                          {item.budget == null
                            ? "Тохиролцоно"
                            : `₮${Number(item.budget).toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <LearningCompletionActions
              item={item}
              user={user}
              onUpdated={load}
            />
          </>
        )}
      </div>
    </PageContainer>
  );
}
