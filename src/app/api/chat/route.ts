import { getServerSession } from "next-auth";
import { authOptions } from "@/core/auth/auth.config";
import type { ChatMessage } from "@/feature/chatbot/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const row = value as { role?: unknown; content?: unknown };
  return (
    (row.role === "user" || row.role === "assistant") &&
    typeof row.content === "string"
  );
}

function messageFromBody(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;
  const row = data as { message?: unknown; error?: unknown };
  if (typeof row.message === "string" && row.message.trim()) return row.message;
  if (Array.isArray(row.message) && typeof row.message[0] === "string") {
    return row.message[0];
  }
  if (typeof row.error === "string" && row.error.trim()) return row.error;
  return fallback;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken || !session.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = (body as { messages?: unknown }).messages;
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    !messages.every(isChatMessage)
  ) {
    return Response.json({ error: "Invalid messages" }, { status: 400 });
  }

  const last = messages[messages.length - 1];
  if (
    last.role !== "user" ||
    last.content.trim() === "" ||
    last.content.length > 4000
  ) {
    return Response.json({ error: "Invalid last message" }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ messages }),
    });
  } catch {
    return Response.json(
      {
        error:
          "Không kết nối được backend (cổng 3001). Hãy chạy Nest rồi thử lại.",
        message:
          "Không kết nối được backend (cổng 3001). Hãy chạy Nest rồi thử lại.",
      },
      { status: 502 },
    );
  }

  if (!upstream.ok || !upstream.body) {
    const data: unknown = await upstream.json().catch(() => null);
    const status = upstream.status === 401 ? 401 : upstream.status || 502;
    const fallback =
      status === 401
        ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
        : "Không thể trả lời lúc này. Vui lòng thử lại.";
    return Response.json(
      {
        error: messageFromBody(data, fallback),
        message: messageFromBody(data, fallback),
      },
      { status: status === 401 || status === 503 ? status : 502 },
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
