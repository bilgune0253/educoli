
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MessageCircle, Search, Send } from "lucide-react";
import api from "../services/api";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";

export default function Messages() {
  const [params] = useSearchParams();
  const chatId = params.get("chat");

  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const otherName = (chat) =>
    String(chat.student_id) === String(user?.id)
      ? chat.tutor_name
      : chat.student_name;

  useEffect(() => {
    api.get("/chats")
      .then(({ data }) => setChats(data))
      .catch(() => setError("Чатуудыг ачаалж чадсангүй"));
  }, []);

  useEffect(() => {
    if (!chatId || !chats.length) return;
    const found = chats.find((c) => String(c.id) === String(chatId));
    if (found) setSelected(found);
  }, [chatId, chats]);

  useEffect(() => {
    if (!selected) return;

    let active = true;

    const load = async () => {
      try {
        const { data } = await api.get(`/chats/${selected.id}/messages`);
        if (active) setMessages(data);
      } catch {
        if (active) setError("Мессеж ачаалж чадсангүй");
      }
    };

    load();
    const timer = setInterval(load, 2000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [selected?.id]);

  const send = async (e) => {
    e.preventDefault();
    if (!content.trim() || !selected || sending) return;

    setSending(true);
    setError("");

    try {
      await api.post(`/chats/${selected.id}/messages`, {
        content: content.trim()
      });

      setContent("");
      const { data } = await api.get(`/chats/${selected.id}/messages`);
      setMessages(data);
    } catch (err) {
      setError(err.response?.data?.error || "Мессеж илгээж чадсангүй");
    } finally {
      setSending(false);
    }
  };

  const filtered = chats.filter((chat) =>
    [otherName(chat), chat.subject, chat.topic]
      .join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContainer className="py-8 sm:py-12">
      <PageHeader
        eyebrow="Connect & Learn"
        title="Messages"
        description="Багш болон суралцагчтайгаа нэг дороос харилцаарай."
      />

      {error && (
        <p role="alert" className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
          {error}
        </p>
      )}

      <div className="grid min-h-[650px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[300px_1fr]">

        <aside className="border-b border-slate-200 dark:border-slate-800 md:border-b-0 md:border-r">
          <div className="border-b border-slate-100 p-5 dark:border-slate-800">
            <h2 className="font-bold">Conversations</h2>

            <div className="relative mt-4">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chats..."
                aria-label="Search chats"
                className="ui-input pl-10"
              />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto md:max-h-[550px]">
            {filtered.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => {
                  setSelected(chat);
                  setMessages([]);
                  setError("");
                }}
                className={`flex w-full items-center gap-3 border-b border-slate-100 p-4 text-left transition dark:border-slate-800 ${
                  selected?.id === chat.id
                    ? "bg-indigo-50 dark:bg-indigo-500/10"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-600">
                  {otherName(chat)?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">
                    {otherName(chat)}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {chat.subject} · {chat.topic}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {chat.last_message || "Шинэ чат"}
                  </p>
                </div>
              </button>
            ))}

            {!filtered.length && (
              <p className="p-6 text-center text-sm text-slate-500">
                Чат олдсонгүй.
              </p>
            )}
          </div>
        </aside>

        <section className="flex min-h-[550px] min-w-0 flex-col">
          {!selected ? (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div className="rounded-2xl bg-indigo-50 p-5 text-indigo-600 dark:bg-indigo-500/10">
                <MessageCircle size={34} />
              </div>
              <h3 className="mt-5 text-xl font-bold">
                Select a conversation
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Харилцах чатаа зүүн талаас сонгоно уу.
              </p>
            </div>
          ) : (
            <>
              <header className="flex items-center gap-3 border-b border-slate-100 p-5 dark:border-slate-800">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-600">
                  {otherName(selected)?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="font-bold">{otherName(selected)}</h2>
                  <p className="text-xs text-slate-500">
                    {selected.topic} · {selected.status === "active"
                      ? "Active chat"
                      : "Archived"}
                  </p>
                </div>
              </header>

              <div className="max-h-[500px] min-h-80 flex-1 space-y-4 overflow-y-auto bg-slate-50/50 p-5 dark:bg-slate-950/40">
                {messages.map((msg) => {
                  const mine =
                    String(msg.sender_id) === String(user?.id);

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[75%] ${
                        mine
                          ? "rounded-br-md bg-indigo-600 text-white"
                          : "rounded-bl-md bg-white text-slate-800 dark:bg-slate-800 dark:text-white"
                      }`}>
                        <p className="whitespace-pre-wrap break-words leading-6">
                          {msg.content}
                        </p>
                        <p className="mt-2 text-right text-[10px] opacity-60">
                          {new Date(msg.created_at).toLocaleTimeString("mn-MN", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selected.status === "active" ? (
                <form
                  onSubmit={send}
                  className="flex items-center gap-3 border-t border-slate-100 p-4 dark:border-slate-800"
                >
                  <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={2000}
                    placeholder="Мессеж бичих..."
                    aria-label="Message"
                    className="ui-input min-w-0 flex-1"
                  />
                  <Button type="submit" disabled={sending || !content.trim()}>
                    <Send size={17} />
                    <span className="hidden sm:inline">
                      {sending ? "Sending..." : "Send"}
                    </span>
                  </Button>
                </form>
              ) : (
                <p className="border-t border-slate-100 p-5 text-center text-sm text-slate-500 dark:border-slate-800">
                  Энэ чат архивлагдсан.
                </p>
              )}
            </>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
