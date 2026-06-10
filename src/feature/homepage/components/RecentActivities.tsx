"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import { RECENT_ACTIVITIES } from "../data";

export function RecentActivities() {
  return (
    <Card className="dashboard-card recent-activities-card">
      <Box className="dashboard-card-header">
        <Typography className="dashboard-card-title">
          <i
            className="bi bi-activity"
            style={{ marginRight: 8, color: "#2a5bc0" }}
          />
          Hoạt động gần đây
        </Typography>
      </Box>
      <Box className="dashboard-card-body">
        <Box className="recent-activities-list">
          {RECENT_ACTIVITIES.map((activity) => (
            <Box key={activity.id} className="recent-activity-item">
              <Typography className="recent-activity-time">
                [{activity.time}]
              </Typography>
              <Box className="recent-activity-content">
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    background: activity.color,
                    flexShrink: 0,
                  }}
                >
                  {activity.avatar}
                </Avatar>
                <Typography className="recent-activity-text">
                  <strong>{activity.user}</strong> {activity.action}
                  {activity.target && (
                    <span style={{ color: "#2a5bc0" }}>{activity.target}</span>
                  )}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
}
