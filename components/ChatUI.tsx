"use client";

import { useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatUIProps {
  onTalkingStart: () => void;
  onTalkingStop: () => void;
}

export function ChatUI({ onTalkingStart, onTalkingStop }: ChatUIProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");

    setIsSending(true);
    onTalkingStart();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = (await response.json()) as { reply?: string };
      const reply =
        data.reply ??
        "Ich bin noch nicht mit einem echten LLM verbunden, aber ich bin bereit, deine digitale Welt zu bewegen.";

      setMessages((current) => [
        ...current,
        { role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Es gab ein Problem mit der Verbindung. Versuche es gleich nochmal.",
        },
      ]);
    } finally {
      setTimeout(() => {
        onTalkingStop();
        setIsSending(false);
      }, 1400);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4">
      <div className="pointer-events-none max-h-40 overflow-y-auto rounded-2xl border border-zinc-800/80 bg-black/60 p-3 text-xs text-zinc-300 backdrop-blur">
        {messages.length === 0 ? (
          <p className="text-zinc-500">
            Neyraq hoert zu . stell eine Frage, z. B.{" "}
            <span className="text-zinc-300">
              &bdquo;Was bist du?&ldquo;
            </span>
            .
          </p>
        ) : (
          messages.map((message, index) => (
            <p
              key={index}
              className={
                message.role === "user"
                  ? "text-zinc-400"
                  : "text-emerald-300/90"
              }
            >
              {message.role === "user" ? "Du: " : "Neyraq: "}
              {message.content}
            </p>
          ))
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 rounded-full border border-zinc-700/80 bg-black/70 px-3 py-2 text-sm text-zinc-200 backdrop-blur"
      >
        <span className="hidden text-xs text-zinc-500 sm:inline">
          Neyraq hoert zu .
        </span>
        <input
          className="flex-1 bg-transparent text-xs text-zinc-100 outline-none placeholder:text-zinc-600 sm:text-sm"
          placeholder='Frag mich alles – z. B. "Was bist du?"'
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-medium text-zinc-900 hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-300"
        >
          Senden
        </button>
      </form>
    </div>
  );
}
