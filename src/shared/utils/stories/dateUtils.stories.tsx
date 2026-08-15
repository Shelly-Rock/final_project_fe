import type { Meta } from "@storybook/react";
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  TextField,
  Grid,
  Divider,
} from "@mui/material";
import * as DateUtils from "@/shared/utils/date.utils";

const meta = {
  title: "Shared/Utils/Date Utils",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

export const FormatDate: React.FC = () => {
  const [date, setDate] = useState("2026-07-16");

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 800 }}
    >
      <Typography variant="h5">Date Formatting</Typography>

      <TextField
        label="Date Input"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        size="small"
        sx={{ maxWidth: 300 }}
      />

      <Grid container spacing={2}>
        <Grid item xs={6} sm={4} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              YYYY-MM-DD
            </Typography>
            <Typography variant="h6">
              {DateUtils.formatDate(date, "YYYY-MM-DD")}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              DD/MM/YYYY
            </Typography>
            <Typography variant="h6">
              {DateUtils.formatDate(date, "DD/MM/YYYY")}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              MM/DD/YYYY
            </Typography>
            <Typography variant="h6">
              {DateUtils.formatDate(date, "MM/DD/YYYY")}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              DD-MM-YYYY
            </Typography>
            <Typography variant="h6">
              {DateUtils.formatDate(date, "DD-MM-YYYY")}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              YYYY-MM-DD HH:mm:ss
            </Typography>
            <Typography variant="body2">
              {DateUtils.formatDate(date, "YYYY-MM-DD HH:mm:ss")}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              HH:mm:ss
            </Typography>
            <Typography variant="h6">
              {DateUtils.formatDate(date, "HH:mm:ss")}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              MMM DD, YYYY
            </Typography>
            <Typography variant="h6">
              {DateUtils.formatDate(date, "MMM DD, YYYY")}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              YYYY
            </Typography>
            <Typography variant="h6">
              {DateUtils.formatDate(date, "YYYY")}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export const RelativeTime: React.FC = () => {
  const now = new Date();

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600 }}
    >
      <Typography variant="h5">Relative Time</Typography>

      <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
        <Typography variant="body2" color="text.secondary">
          Current time: {now.toLocaleString()}
        </Typography>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              5 phút trước
            </Typography>
            <Typography variant="h6">
              {DateUtils.formatDateRelative(
                new Date(now.getTime() - 5 * 60 * 1000),
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              1 giờ trước
            </Typography>
            <Typography variant="h6">
              {DateUtils.formatDateRelative(
                new Date(now.getTime() - 60 * 60 * 1000),
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              2 ngày trước
            </Typography>
            <Typography variant="h6">
              {DateUtils.formatDateRelative(
                new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Sau 1 giờ
            </Typography>
            <Typography variant="h6">
              {DateUtils.formatDateRelative(
                new Date(now.getTime() + 60 * 60 * 1000),
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Short format
            </Typography>
            <Typography variant="h6">
              {DateUtils.timeAgo(
                new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
                { shortFormat: true },
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              With units
            </Typography>
            <Typography variant="h6">
              {DateUtils.timeAgo(
                new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
              )}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export const DateChecks: React.FC = () => {
  const today = new Date();

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600 }}
    >
      <Typography variant="h5">Date Checks</Typography>

      <Grid container spacing={2}>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              isToday
            </Typography>
            <Box>
              <Chip
                label={DateUtils.isToday(today) ? "TRUE" : "FALSE"}
                color={DateUtils.isToday(today) ? "success" : "error"}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              isYesterday
            </Typography>
            <Box>
              <Chip
                label={DateUtils.isYesterday(today) ? "TRUE" : "FALSE"}
                color={DateUtils.isYesterday(today) ? "success" : "error"}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              isTomorrow
            </Typography>
            <Box>
              <Chip
                label={DateUtils.isTomorrow(today) ? "TRUE" : "FALSE"}
                color={DateUtils.isTomorrow(today) ? "success" : "error"}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              isWeekday
            </Typography>
            <Box>
              <Chip
                label={DateUtils.isWeekday(today) ? "Weekday" : "Weekend"}
                color={DateUtils.isWeekday(today) ? "primary" : "warning"}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              isWeekend
            </Typography>
            <Box>
              <Chip
                label={DateUtils.isWeekend(today) ? "Weekend" : "Weekday"}
                color={DateUtils.isWeekend(today) ? "warning" : "primary"}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              getQuarter
            </Typography>
            <Typography variant="h6">Q{DateUtils.getQuarter(today)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              getWeekNumber
            </Typography>
            <Typography variant="h6">
              Week {DateUtils.getWeekNumber(today)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              getDaysInMonth
            </Typography>
            <Typography variant="h6">
              {DateUtils.getDaysInMonth(today)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              getDayOfWeek
            </Typography>
            <Typography variant="h6">{DateUtils.getDayName(today)}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export const DateCalculations: React.FC = () => {
  const today = new Date("2026-07-16");

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600 }}
    >
      <Typography variant="h5">Date Calculations</Typography>
      <Typography variant="body2" color="text.secondary">
        Base date: {today.toDateString()}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              +7 days
            </Typography>
            <Typography variant="body2">
              {DateUtils.addDays(today, 7)?.toDateString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              -1 month
            </Typography>
            <Typography variant="body2">
              {DateUtils.subtractMonths(today, 1)?.toDateString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              +1 year
            </Typography>
            <Typography variant="body2">
              {DateUtils.addYears(today, 1)?.toDateString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              startOfMonth
            </Typography>
            <Typography variant="body2">
              {DateUtils.startOfMonth(today)?.toDateString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              endOfMonth
            </Typography>
            <Typography variant="body2">
              {DateUtils.endOfMonth(today)?.toDateString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              getMonthName
            </Typography>
            <Typography variant="body2">
              {DateUtils.getMonthName(today)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
