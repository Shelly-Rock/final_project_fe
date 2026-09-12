import type { ChatMessage, ChatStreamEvent } from "../types";

async function readErrorMessage(response: Response): Promise<string> {
  if (response.status === 401) {
    return "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
  }
  try {
    const data = (await response.json()) as {
      message?: unknown;
      error?: unknown;
    };
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
    if (Array.isArray(data.message) && typeof data.message[0] === "string") {
      return data.message[0];
    }
    if (typeof data.error === "string" && data.error.trim()) {
      return data.error;
    }
  } catch {
    // not JSON
  }
  return "Không thể trả lời lúc này. Vui lòng thử lại.";
}

export async function sendChat(params: {
  messages: ChatMessage[];
  signal?: AbortSignal;
  onEvent: (event: ChatStreamEvent) => void;
}): Promise<void> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: params.messages }),
    signal: params.signal,
  });

  if (!response.ok || !response.body) {
    params.onEvent({
      type: "error",
      message: await readErrorMessage(response),
    });
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        params.onEvent(JSON.parse(line) as ChatStreamEvent);
      } catch {
        // skip malformed chunk
      }
    }
  }

  if (buffer.trim()) {
    try {
      params.onEvent(JSON.parse(buffer) as ChatStreamEvent);
    } catch {
      // skip
    }
  }
}
