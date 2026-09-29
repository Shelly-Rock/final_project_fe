"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Card,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { facultyService } from "../services/department.service";

const DAYS = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

export function FacultyUpcomingEvents({ facultyId }: { facultyId: string }) {
  const theme = useTheme();
  const { data, isLoading } = useQuery({
    queryKey: ["faculty-upcoming-events", facultyId],
    queryFn: () => facultyService.getFacultyUpcomingEvents(facultyId),
  });
  const events = data ?? [];

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 3,
        mt: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Lịch hoạt động 14 ngày tới
        </Typography>
        {isLoading && <CircularProgress size={20} />}
      </Box>
      {!isLoading && events.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 2 }}>
          Không có mốc hoạt động nào trong 14 ngày tới.
        </Typography>
      ) : (
        events.map((event, index) => {
          const at = new Date(event.at);
          const today = at.toDateString() === new Date().toDateString();
          return (
            <Box
              key={event.id}
              sx={{
                display: "grid",
                gridTemplateColumns: "72px 20px 1fr",
                gap: 1.5,
              }}
            >
              <Box sx={{ pt: 1, textAlign: "right" }}>
                <Typography
                  fontSize={13}
                  fontWeight={700}
                  color={today ? "primary.main" : "text.primary"}
                >
                  {at.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </Typography>
                <Typography fontSize={11} color="text.secondary">
                  {today ? "Hôm nay" : DAYS[at.getDay()]}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {index < events.length - 1 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 18,
                      bottom: -8,
                      width: 2,
                      bgcolor: theme.palette.divider,
                    }}
                  />
                )}
                <Box
                  sx={{
                    mt: 1,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: "background.paper",
                    border: "3px solid",
                    borderColor: "primary.main",
                    zIndex: 1,
                  }}
                />
              </Box>
              <Box
                sx={{
                  mb: 1,
                  px: 2,
                  py: 1.25,
                  borderRadius: 2,
                  bgcolor: theme.palette.action.hover,
                }}
              >
                <Typography fontSize={14} fontWeight={700}>
                  {event.title}
                </Typography>
                <Typography fontSize={12} color="text.secondary" mt={0.25}>
                  {event.detail}
                </Typography>
              </Box>
            </Box>
          );
        })
      )}
    </Card>
  );
}
