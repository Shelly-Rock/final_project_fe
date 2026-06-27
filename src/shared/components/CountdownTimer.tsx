"use client";

import { Box, Typography, LinearProgress } from "@mui/material";
import { AccessTime as ClockIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  deadline: Date | string;
  onExpired?: () => void;
  label?: string;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calcTimeLeft(deadline: Date): TimeLeft {
  const diff = deadline.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({
  deadline,
  onExpired,
  label = "Thời gian còn lại:",
  compact = false,
}: CountdownTimerProps) {
  const d = new Date(deadline);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(d));
  const [calledExpired, setCalledExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = calcTimeLeft(d);
      setTimeLeft(tl);
      if (tl.total <= 0 && !calledExpired) {
        setCalledExpired(true);
        onExpired?.();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [d, onExpired, calledExpired]);

  const isExpired = timeLeft.total <= 0;
  const isUrgent = timeLeft.total > 0 && timeLeft.total <= 24 * 60 * 60 * 1000;
  const color = isExpired ? "error" : isUrgent ? "error" : "primary";

  if (compact) {
    if (isExpired) {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "error.main" }}>
          <ClockIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption" sx={{ color: "error.main", fontWeight: 700 }}>
            Đã hết hạn
          </Typography>
        </Box>
      );
    }
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <ClockIcon sx={{ fontSize: 14, color: `${color}.main` }} />
        <Typography variant="caption" sx={{ color: `${color}.main`, fontWeight: 700, fontFamily: "monospace" }}>
          {String(timeLeft.days).padStart(2, "0")}d{" "}
          {String(timeLeft.hours).padStart(2, "0")}h{" "}
          {String(timeLeft.minutes).padStart(2, "0")}m{" "}
          {String(timeLeft.seconds).padStart(2, "0")}s
        </Typography>
      </Box>
    );
  }

  if (isExpired) {
    return (
      <Box
        sx={{
          p: 2,
          bgcolor: "error.50",
          border: "2px solid",
          borderColor: "error.main",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <ClockIcon sx={{ fontSize: 32, color: "error.main", mb: 0.5 }} />
        <Typography variant="h6" sx={{ color: "error.main", fontWeight: 900 }}>
          ĐÃ HẾT HẠN
        </Typography>
        <Typography variant="caption" color="error.main">
          Đã quá thời hạn chấm điểm
        </Typography>
      </Box>
    );
  }

  const segments = [
    { value: timeLeft.days, label: "Ngày" },
    { value: timeLeft.hours, label: "Giờ" },
    { value: timeLeft.minutes, label: "Phút" },
    { value: timeLeft.seconds, label: "Giây" },
  ];

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: `${color}.50`,
        border: "2px solid",
        borderColor: `${color}.main`,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, justifyContent: "center" }}>
        <ClockIcon color={color} />
        <Typography variant="subtitle2" sx={{ color: `${color}.dark`, fontWeight: 700 }}>
          {label}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
        {segments.map(({ value, label }) => (
          <Box key={label} sx={{ textAlign: "center", minWidth: 52 }}>
            <Box
              sx={{
                bgcolor: `${color}.main`,
                color: "white",
                borderRadius: 1,
                py: 0.5,
                px: 1.5,
                fontWeight: 900,
                fontSize: "1.2rem",
                fontFamily: "monospace",
                minWidth: 48,
              }}
            >
              {String(value).padStart(2, "0")}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      <LinearProgress
        variant="determinate"
        value={Math.max(0, Math.min(100, (timeLeft.total / (7 * 24 * 60 * 60 * 1000)) * 100))}
        color={color}
        sx={{ mt: 1.5, height: 6, borderRadius: 3 }}
      />
    </Box>
  );
}
