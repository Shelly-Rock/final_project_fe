"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Box, IconButton, Typography } from "@mui/material";
import { Bot, X } from "lucide-react";
import type { Role } from "@/core/permissions/types";
import { ROLE } from "@/core/permissions/types";
import { Sheet } from "@/shared/components/Sheet";
import { sendChat } from "../services/chat.client";
import type { ChatMessage } from "../types";
import { ChatInput } from "./ChatInput";
import { ChatMessageList } from "./ChatMessageList";
import { SuggestedChips } from "./SuggestedChips";

const HEADER_GRADIENT = "linear-gradient(135deg, #2563eb 0%, #1e3d6f 100%)";

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
      size={420}
      header={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1.75,
            background: HEADER_GRADIENT,
            color: "#fff",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              bgcolor: "rgba(255,255,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Bot size={22} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, lineHeight: 1.3 }}>
              Trợ lý đồ án
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                mt: 0.25,
              }}
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: "#4ade80",
                  boxShadow: "0 0 0 3px rgba(74,222,128,0.28)",
                }}
              />
              <Typography
                sx={{ fontSize: 12, color: "rgba(255,255,255,0.78)" }}
              >
                Sẵn sàng hỗ trợ quy trình
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="Đóng chatbot"
            sx={{
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.12)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
            }}
          >
            <X size={18} />
          </IconButton>
        </Box>
      }
      footer={<ChatInput disabled={streaming} onSend={send} />}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          minHeight: "100%",
          mx: -2,
          px: 2,
          pt: 1,
          pb: 2,
          bgcolor: "background.default",
        }}
      >
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
