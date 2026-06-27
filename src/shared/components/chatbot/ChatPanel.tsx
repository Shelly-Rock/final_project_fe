"use client";

import { useState, useRef, useEffect, useId } from "react";
import { flushSync } from "react-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import {
  ChatMessage,
  WELCOME_MESSAGE,
  findAnswer,
  DEFAULT_ANSWER,
} from "./chatData";
import { useTextToSpeech } from "./useTextToSpeech";
import { useSpeechRecognition } from "./useSpeechRecognition";

interface ChatPanelProps {
  onClose: () => void;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\|/g, " ")
    .replace(/─+/g, "")
    .replace(/📅|📧|📞|🏢|🎓|👑|📋|👨‍🏫|🟡|🟠|🔵|🟢|🔴/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function ChatPanel({ onClose }: ChatPanelProps) {
  const idPrefix = useId();
  const msgCounterRef = useRef(0);

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef("");

  const {
    speak,
    stop,
    isSpeaking,
    isEnabled: ttsEnabled,
    toggle: toggleTts,
    isSupported: ttsSupported,
    hasVietnameseVoice,
  } = useTextToSpeech({ rate: 0.9, volume: 1.0 });

  const {
    transcript,
    isListening,
    isSupported: sttSupported,
    startListening,
    stopListening,
    resetTranscript,
    error: sttError,
  } = useSpeechRecognition({ lang: "vi-VN" });

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    if (transcript) {
      flushSync(() => setInput(transcript));
    }
  }, [transcript]);

  useEffect(() => {
    if (!isListening && transcript.trim()) {
      resetTranscript();
      const timer = setTimeout(() => {
        const inputText = inputRef.current.trim();
        if (!inputText) return;

        const userMsg: ChatMessage = {
          id: `${idPrefix}-${msgCounterRef.current++}`,
          text: inputText,
          isBot: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);
        setTimeout(() => {
          const faq = findAnswer(inputText);
          const botAnswer = faq?.answer ?? DEFAULT_ANSWER;
          const botMsg: ChatMessage = {
            id: `${idPrefix}-${msgCounterRef.current++}`,
            text: botAnswer,
            isBot: true,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMsg]);
          setIsTyping(false);
          speak(stripMarkdown(botAnswer));
        }, 800);
      }, 200);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text) return;

    stop();
    stopListening();

    const userMsg: ChatMessage = {
      id: `${idPrefix}-${msgCounterRef.current++}`,
      text,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const faq = findAnswer(userMsg.text);
      const botAnswer = faq?.answer ?? DEFAULT_ANSWER;

      const botMsg: ChatMessage = {
        id: `${idPrefix}-${msgCounterRef.current++}`,
        text: botAnswer,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      speak(stripMarkdown(botAnswer));
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text: string) => {
    stop();
    setInput(text);
    setTimeout(() => handleSend(), 100);
  };

  const handleRespeak = (text: string) => {
    speak(stripMarkdown(text));
  };

  return (
    <Paper
      elevation={24}
      sx={{
        position: "fixed",
        bottom: 96,
        right: 24,
        width: 380,
        height: 540,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        zIndex: 9998,
        animation: "chatSlideUp 0.3s ease",
        "@keyframes chatSlideUp": {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #2a5bc0 0%, #1e3d8a 100%)",
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              bgcolor: isSpeaking
                ? "rgba(74,222,128,0.4)"
                : "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.3s",
            }}
          >
            <i
              className={isSpeaking ? "bi bi-volume-up-fill" : "bi bi-robot"}
              style={{ color: "#fff", fontSize: 20 }}
            />
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.95rem",
                lineHeight: 1.2,
              }}
            >
              Chatbot QNQ
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#4ade80",
                  animation: "botPulse 2s ease infinite",
                  "@keyframes botPulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.7rem" }}
              >
                {isSpeaking ? "Đang đọc..." : "Trực tuyến"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {ttsSupported && (
            <Tooltip
              title={
                !hasVietnameseVoice && ttsEnabled
                  ? "Máy không có giọng Việt. Vui lòng cài thêm giọng tiếng Việt trong cài đặt Chrome."
                  : !ttsEnabled
                    ? "Bật đọc giọng nói"
                    : isSpeaking
                      ? "Dừng đọc"
                      : "Tắt đọc giọng nói"
              }
              arrow
            >
              <IconButton
                size="small"
                onClick={() => {
                  if (isSpeaking) {
                    stop();
                  } else {
                    toggleTts();
                  }
                }}
                sx={{
                  color: ttsEnabled
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.4)",
                  bgcolor: ttsEnabled
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                  border: ttsEnabled
                    ? "1px solid rgba(255,255,255,0.3)"
                    : "1px solid transparent",
                  borderRadius: 1.5,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "#fff",
                  },
                }}
              >
                <i
                  className={
                    isSpeaking
                      ? "bi bi-stop-fill"
                      : ttsEnabled
                        ? "bi bi-volume-up-fill"
                        : "bi bi-volume-mute"
                  }
                  style={{ fontSize: 16 }}
                />
              </IconButton>
            </Tooltip>
          )}

          <IconButton
            size="small"
            onClick={() => {
              stop();
              onClose();
            }}
            sx={{
              color: "rgba(255,255,255,0.8)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.15)", color: "#fff" },
            }}
          >
            <i className="bi bi-x-lg" style={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          bgcolor: "#f0f2f5",
          "&::-webkit-scrollbar": { width: 5 },
          "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#c1c8d0",
            borderRadius: 3,
          },
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent: msg.isBot ? "flex-start" : "flex-end",
              alignItems: "flex-end",
              gap: 1,
            }}
          >
            {msg.isBot && (
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  bgcolor: "#2a5bc0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <i
                  className="bi bi-robot"
                  style={{ color: "#fff", fontSize: 13 }}
                />
              </Box>
            )}
            <Box
              sx={{
                maxWidth: "78%",
                px: 2,
                py: 1.25,
                borderRadius: msg.isBot
                  ? "4px 16px 16px 16px"
                  : "16px 4px 16px 16px",
                bgcolor: msg.isBot ? "#fff" : "#2a5bc0",
                color: msg.isBot ? "#333" : "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                whiteSpace: "pre-wrap",
                fontSize: "0.82rem",
                lineHeight: 1.6,
                position: "relative",
                ...(msg.id === "welcome" && {
                  border: "1px solid",
                  borderColor: "divider",
                }),
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  "& strong": { fontWeight: 700 },
                  "& table": {
                    width: "100%",
                    borderCollapse: "collapse",
                    mt: 0.5,
                  },
                  "& th, & td": {
                    border: "1px solid #e0e0e0",
                    px: 1,
                    py: 0.5,
                    fontSize: "0.75rem",
                  },
                  "& th": { bgcolor: "#e8efff", fontWeight: 600 },
                }}
                dangerouslySetInnerHTML={{
                  __html: msg.text
                    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                    .replace(/`(.+?)`/g, "<code>$1</code>"),
                }}
              />

              {msg.isBot &&
                ttsSupported &&
                ttsEnabled &&
                msg.id !== "welcome" && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.75,
                      pt: 0.75,
                      borderTop: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <Box
                      component="button"
                      onClick={() => handleRespeak(msg.text)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        bgcolor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#2a5bc0",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        p: 0,
                        opacity: 0.7,
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      <i
                        className={
                          isSpeaking ? "bi bi-stop-fill" : "bi bi-volume-up"
                        }
                        style={{ fontSize: 11 }}
                      />
                      {isSpeaking ? "Dừng" : "Đọc lại"}
                    </Box>
                  </Box>
                )}

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: msg.isBot ? "left" : "right",
                  mt: 0.5,
                  opacity: 0.5,
                  fontSize: "0.65rem",
                }}
              >
                {formatTime(msg.timestamp)}
              </Typography>
            </Box>
            {!msg.isBot && (
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  bgcolor: "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <i
                  className="bi bi-person-fill"
                  style={{ color: "#666", fontSize: 13 }}
                />
              </Box>
            )}
          </Box>
        ))}

        {isTyping && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-end",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                bgcolor: "#2a5bc0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="bi bi-robot"
                style={{ color: "#fff", fontSize: 13 }}
              />
            </Box>
            <Box
              sx={{
                px: 2,
                py: 1.25,
                borderRadius: "4px 16px 16px 16px",
                bgcolor: "#fff",
                display: "flex",
                gap: 0.5,
                alignItems: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "#2a5bc0",
                    animation: `typingDot 1.2s ease infinite ${i * 0.2}s`,
                    "@keyframes typingDot": {
                      "0%, 60%, 100%": {
                        transform: "translateY(0)",
                        opacity: 0.4,
                      },
                      "30%": { transform: "translateY(-4px)", opacity: 1 },
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {isSpeaking && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 1,
              px: 1,
              animation: "fadeIn 0.3s ease",
              "@keyframes fadeIn": {
                from: { opacity: 0, transform: "translateY(4px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.5,
                py: 0.75,
                borderRadius: "20px",
                bgcolor: "#e8f4fd",
                border: "1px solid #b3d7f9",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                  height: 14,
                }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 2.5,
                      height: [6, 10, 14, 10][i],
                      borderRadius: 1,
                      bgcolor: "#2a5bc0",
                      animation: `soundBar 0.8s ease infinite ${i * 0.12}s`,
                      "@keyframes soundBar": {
                        "0%, 100%": { transform: "scaleY(0.4)" },
                        "50%": { transform: "scaleY(1)" },
                      },
                    }}
                  />
                ))}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#1a5bb8",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                }}
              >
                Đang đọc bằng tiếng Việt...
              </Typography>
              <IconButton
                size="small"
                onClick={stop}
                sx={{
                  p: 0.25,
                  color: "#1a5bb8",
                  "&:hover": { bgcolor: "rgba(26,91,184,0.1)" },
                }}
              >
                <i className="bi bi-stop-circle" style={{ fontSize: 13 }} />
              </IconButton>
            </Box>
          </Box>
        )}

        {messages.length === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
            <Typography
              variant="caption"
              sx={{ color: "#888", fontSize: "0.7rem", fontWeight: 500 }}
            >
              Gợi ý:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {[
                "Quy trình đăng ký đề tài",
                "Xem tiến độ",
                "Các role trong hệ thống",
                "Deadline & Bảo vệ",
              ].map((s) => (
                <Chip
                  key={s}
                  label={s}
                  size="small"
                  onClick={() => handleSuggestionClick(s)}
                  sx={{
                    fontSize: "0.7rem",
                    height: 26,
                    bgcolor: "#fff",
                    border: "1px solid #2a5bc0",
                    color: "#2a5bc0",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#e8efff" },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "#fff",
          display: "flex",
          gap: 1,
          alignItems: "flex-end",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder={
            isListening
              ? "Đang nghe..."
              : "Nhập tin nhắn hoặc nhấn micro để nói..."
          }
          multiline
          maxRows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              fontSize: "0.82rem",
              "& fieldset": {
                borderColor: isListening ? "#2a5bc0" : "#e0e0e0",
              },
              "&:hover fieldset": { borderColor: "#2a5bc0" },
              "&.Mui-focused fieldset": {
                borderColor: "#2a5bc0",
                borderWidth: 1.5,
              },
            },
          }}
        />

        {sttSupported && (
          <Tooltip
            title={isListening ? "Dừng ghi âm" : sttError || "Nhấn để nói"}
            arrow
          >
            <IconButton
              onClick={() => {
                if (isListening) {
                  stopListening();
                } else {
                  resetTranscript();
                  startListening();
                }
              }}
              sx={{
                bgcolor: isListening ? "#e74c3c" : "#f0f2f5",
                color: isListening ? "#fff" : "#555",
                width: 38,
                height: 38,
                flexShrink: 0,
                border: isListening ? "2px solid #e74c3c" : "1px solid #e0e0e0",
                borderRadius: "50%",
                animation: isListening ? "micPulse 1s ease infinite" : "none",
                "@keyframes micPulse": {
                  "0%, 100%": {
                    transform: "scale(1)",
                    boxShadow: "0 0 0 0 rgba(231,76,60,0.4)",
                  },
                  "50%": {
                    transform: "scale(1.05)",
                    boxShadow: "0 0 0 6px rgba(231,76,60,0)",
                  },
                },
                "&:hover": {
                  bgcolor: isListening ? "#c0392b" : "#e0e0e0",
                  color: isListening ? "#fff" : "#2a5bc0",
                },
              }}
            >
              <i
                className={isListening ? "bi bi-stop-fill" : "bi bi-mic"}
                style={{ fontSize: 15 }}
              />
            </IconButton>
          </Tooltip>
        )}

        <IconButton
          onClick={() => handleSend()}
          disabled={!input.trim() || isListening}
          sx={{
            bgcolor: "#2a5bc0",
            color: "#fff",
            width: 38,
            height: 38,
            flexShrink: 0,
            "&:hover": { bgcolor: "#1e3d8a" },
            "&.Mui-disabled": { bgcolor: "#ccc", color: "#fff" },
          }}
        >
          <i className="bi bi-send-fill" style={{ fontSize: 15 }} />
        </IconButton>
      </Box>
    </Paper>
  );
}
