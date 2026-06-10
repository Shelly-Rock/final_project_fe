"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import { ACTIVITY_FEED } from "../data";

export function ActivityFeed() {
  return (
    <Card className="dashboard-card">
      <Box className="dashboard-card-header">
        <Typography className="dashboard-card-title">
          Hoạt động gần đây
        </Typography>
        <Chip
          label="Hôm nay"
          size="small"
          sx={{
            background: "#e8efff",
            color: "#2a5bc0",
            fontWeight: 600,
            fontSize: "0.7rem",
          }}
        />
      </Box>
      <Box className="dashboard-card-body">
        <Box className="dashboard-activity-list">
          {ACTIVITY_FEED.map((item) => (
            <Box key={item.id} className="dashboard-activity-item">
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  background: item.color,
                  flexShrink: 0,
                }}
              >
                {item.avatar}
              </Avatar>
              <Box className="dashboard-activity-content">
                <Typography className="dashboard-activity-text">
                  <strong>{item.user}</strong> {item.action}{" "}
                  <span style={{ color: "#2a5bc0" }}>{item.target}</span>
                </Typography>
                <Typography className="dashboard-activity-time">
                  {item.time}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Button
          fullWidth
          size="small"
          endIcon={<span className="bi bi-arrow-right" />}
          sx={{ mt: 2, color: "#2a5bc0", fontWeight: 600 }}
        >
          Xem tất cả hoạt động
        </Button>
      </Box>
    </Card>
  );
}
