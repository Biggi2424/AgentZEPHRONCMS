import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const lastMessage =
    Array.isArray(body.messages) && body.messages.length > 0
      ? body.messages[body.messages.length - 1]
      : null;

  const userText =
    lastMessage && typeof lastMessage.content === "string"
      ? lastMessage.content
      : "";

  const reply =
    userText.trim().length > 0
      ? `Du fragst: "${userText}". Ich bin Neyraq, dein Control Room fuer die digitale Welt - alles, was du an einem Computer tun koenntest, kann ich fuer dich orchestrieren.`
      : "Ich bin Neyraq - stell mir eine Frage oder gib mir eine Aufgabe, und ich bewege deine digitale Welt.";

  return NextResponse.json({ reply });
}
