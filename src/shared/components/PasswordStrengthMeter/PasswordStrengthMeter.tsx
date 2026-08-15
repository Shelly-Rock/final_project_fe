"use client";

import { Box, LinearProgress, Typography } from "@mui/material";
import { Check, X } from "lucide-react";

export interface PasswordStrengthMeterProps {
  password: string;
  showFeedback?: boolean;
}

const calculateStrength = (
  password: string,
): { score: number; label: string; color: string } => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: "Yếu", color: "#d32f2f" };
  if (score <= 2) return { score: 2, label: "Trung bình", color: "#ed6c02" };
  if (score <= 3) return { score: 3, label: "Khá", color: "#0288d1" };
  return { score: 4, label: "Mạnh", color: "#2e7d32" };
};

const requirements = [
  { label: "Ít nhất 8 ký tự", test: (p: string) => p.length >= 8 },
  { label: "Ít nhất 12 ký tự", test: (p: string) => p.length >= 12 },
  {
    label: "Chữ hoa và chữ thường",
    test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  },
  { label: "Có số", test: (p: string) => /\d/.test(p) },
  {
    label: "Có ký tự đặc biệt",
    test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
];

export function PasswordStrengthMeter({
  password,
  showFeedback = true,
}: PasswordStrengthMeterProps) {
  const strength = calculateStrength(password);
  const progress = (strength.score / 4) * 100;

  if (!password) return null;

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Độ mạnh mật khẩu
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, color: strength.color }}
        >
          {strength.label}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 6,
          borderRadius: 3,
          bgcolor: "grey.200",
          "& .MuiLinearProgress-bar": {
            bgcolor: strength.color,
            borderRadius: 3,
          },
        }}
      />

      {showFeedback && (
        <Box sx={{ mt: 1.5 }}>
          {requirements.map((req, index) => {
            const passed = req.test(password);
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  py: 0.25,
                }}
              >
                {passed ? (
                  <Check size={14} style={{ color: "#2e7d32" }} />
                ) : (
                  <X size={14} style={{ color: "#d32f2f" }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: passed ? "success.main" : "text.secondary",
                    fontSize: "0.7rem",
                  }}
                >
                  {req.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
