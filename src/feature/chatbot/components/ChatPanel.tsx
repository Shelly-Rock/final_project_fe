"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Box } from "@mui/material";
import type { Role } from "@/core/permissions/types";
import { ROLE } from "@/core/permissions/types";
import { Sheet } from "@/shared/components/Sheet";
import { sendChat } from "../services/chat.client";
import type { ChatMessage } from "../types";
import { ChatInput } from "./ChatInput";
import { ChatMessageList } from "./ChatMessageList";
import { SuggestedChips } from "./SuggestedChips";

export function ChatPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const role: Role = session?.user.role ?? ROLE.STUDENT;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lookingUp, setLookingUp] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, lookingUp]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const send = async (text: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = ++requestIdRef.current;

    const nextMessages: ChatMessage[] = [
      ...messages.filter((row) => row.content !== "" || row.role === "user"),
      { role: "user", content: text },
    ];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setStreaming(true);
    setLookingUp(false);

    try {
      await sendChat({
        messages: nextMessages,
        signal: controller.signal,
        onEvent: (event) => {
          if (requestIdRef.current !== requestId) return;
          if (event.type === "status") {
            setLookingUp(event.status === "looking_up");
          }
          if (event.type === "text") {
            setLookingUp(false);
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              if (last?.role === "assistant") {
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: last.content + event.delta,
                };
              }
              return copy;
            });
          }
          if (event.type === "error") {
            setLookingUp(false);
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              if (last?.role === "assistant" && last.content === "") {
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: event.message,
                };
              }
              return copy;
            });
          }
        },
      });
    } catch (error) {
      if ((error as { name?: string }).name === "AbortError") return;
      if (requestIdRef.current !== requestId) return;
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last?.role === "assistant" && last.content === "") {
          copy[copy.length - 1] = {
            role: "assistant",
            content: "Không thể trả lời lúc này. Vui lòng thử lại.",
          };
        }
        return copy;
      });
    } finally {
      if (requestIdRef.current === requestId) {
        setStreaming(false);
        setLookingUp(false);
      }
    }
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Trợ lý đồ án"
      description="Hỏi về quy trình, hạn nộp và trạng thái của bạn"
      size={400}
      footer={<ChatInput disabled={streaming} onSend={send} />}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {messages.length === 0 ? (
          <SuggestedChips role={role} name={session?.user.name} onPick={send} />
        ) : (
          <ChatMessageList messages={messages} lookingUp={lookingUp} />
        )}
        <Box ref={bottomRef} />
      </Box>
    </Sheet>
  );
}
