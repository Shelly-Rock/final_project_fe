"use client";

import { Box, Typography, LinearProgress, Paper } from "@mui/material";
import {
  AccessTime as ClockIcon,
  Warning as WarningIcon,
  EventBusy as ExpiredIcon,
} from "@mui/icons-material";
import { useEffect, useState, useMemo } from "react";

interface DeadlineCountdownBannerProps {
  deadline: Date | string;
  onExpired?: () => void;
  onUrgent?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeLeft(deadline: Date): TimeLeft {
  const diff = deadline.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function DeadlineCountdownBanner({
  deadline,
  onExpired,
  onUrgent,
}: DeadlineCountdownBannerProps) {
  const deadlineDate = useMemo(() => new Date(deadline), [deadline]);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(deadlineDate));
  const [calledExpired, setCalledExpired] = useState(false);
  const [calledUrgent, setCalledUrgent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = calculateTimeLeft(deadlineDate);
      setTimeLeft(tl);

      if (tl.total <= 0 && !calledExpired) {
        setCalledExpired(true);
        onExpired?.();
      }

      if (tl.total <= 3 * 24 * 60 * 60 * 1000 && !calledUrgent) {
        setCalledUrgent(true);
        onUrgent?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadlineDate, onExpired, onUrgent, calledExpired, calledUrgent]);

  const isExpired = timeLeft.total <= 0;
  const isUrgent = timeLeft.total > 0 && timeLeft.total <= 3 * 24 * 60 * 60 * 1000;
  const isCritical = timeLeft.total > 0 && timeLeft.total <= 24 * 60 * 60 * 1000;
  const percentLeft = Math.max(
    0,
    Math.min(100, (timeLeft.total / (7 * 24 * 60 * 60 * 1000)) * 100)
  );

  const bannerColor = isExpired
    ? "error"
    : isCritical
    ? "error"
    : isUrgent
    ? "warning"
    : "primary";

  const Icon = isExpired ? ExpiredIcon : isCritical ? WarningIcon : ClockIcon;

  const formatDeadline = (d: Date) => {
    return d.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isExpired) {
    return (
      <Paper
        sx={{
          p: 2,
          bgcolor: "error.50",
          border: "2px solid",
          borderColor: "error.main",
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ExpiredIcon color="error" fontSize="large" />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "error.dark" }}>
              Hạn đăng ký đã kết thúc
            </Typography>
            <Typography variant="body2" color="error.main">
              Thời hạn: {formatDeadline(deadlineDate)}
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 2,
        bgcolor: `${bannerColor}.50`,
        border: "2px solid",
        borderColor: `${bannerColor}.main`,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
        <Icon color={bannerColor} fontSize="large" />
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: `${bannerColor}.dark`,
            }}
          >
            {isCritical ? "Cảnh báo: Còn dưới 24 giờ!" : isUrgent ? "Sắp hết hạn!" : "Hạn đăng ký"}
          </Typography>
          <Typography variant="body2" color={`${bannerColor}.main`}>
            {formatDeadline(deadlineDate)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
        {[
          { value: timeLeft.days, label: "Ngày" },
          { value: timeLeft.hours, label: "Giờ" },
          { value: timeLeft.minutes, label: "Phút" },
          { value: timeLeft.seconds, label: "Giây" },
        ].map(({ value, label }) => (
          <Box key={label} sx={{ textAlign: "center", minWidth: 52 }}>
            <Box
              sx={{
                bgcolor: `${bannerColor}.main`,
                color: "white",
                borderRadius: 1,
                py: 0.5,
                px: 1.5,
                fontWeight: 900,
                fontSize: "1.2rem",
                fontFamily: "monospace",
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
        value={percentLeft}
        color={bannerColor}
        sx={{ height: 6, borderRadius: 3 }}
      />
    </Paper>
  );
}
