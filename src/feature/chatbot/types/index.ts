export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequestBody {
  messages: ChatMessage[];
}

export type ChatStreamEvent =
  | { type: "status"; status: "looking_up" | "responding" }
  | { type: "text"; delta: string }
  | { type: "done" }
  | { type: "error"; message: string };
