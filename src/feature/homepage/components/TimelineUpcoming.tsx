"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { TIMELINE_EVENTS, TimelineEvent } from "../data";

function getEventIcon(type: TimelineEvent["type"]) {
  switch (type) {
    case "deadline":
      return "bi-clock-fill";
    case "defense":
      return "bi-shield-check";
    default:
      return "bi-calendar-event";
  }
}

function getEventColor(type: TimelineEvent["type"]) {
  switch (type) {
    case "deadline":
      return { bg: "#fff8e8", color: "#e89b33" };
    case "defense":
      return { bg: "#e8fff5", color: "#1dab60" };
    default:
      return { bg: "#e8efff", color: "#2a5bc0" };
  }
}

export function TimelineUpcoming() {
  return (
    <Card className="dashboard-card timeline-card">
      <Box className="dashboard-card-header">
        <Typography className="dashboard-card-title">
          <i
            className="bi bi-calendar-week"
            style={{ marginRight: 8, color: "#2a5bc0" }}
          />
          Timeline / Deadline sắp tới
        </Typography>
      </Box>
      <Box className="dashboard-card-body">
        <Box className="timeline-container">
          {TIMELINE_EVENTS.map((event, index) => {
            const colors = getEventColor(event.type);
            return (
              <Box key={event.id} className="timeline-item">
                <Box className="timeline-marker">
                  <Box
                    className="timeline-dot"
                    sx={{ backgroundColor: colors.color }}
                  />
                  {index < TIMELINE_EVENTS.length - 1 && (
                    <Box className="timeline-line" />
                  )}
                </Box>
                <Box className="timeline-content">
                  <Box className="timeline-date">{event.date}</Box>
                  <Box className="timeline-title-row">
                    <Box
                      className="timeline-icon"
                      sx={{ backgroundColor: colors.bg, color: colors.color }}
                    >
                      <i className={`bi ${getEventIcon(event.type)}`} />
                    </Box>
                    <Typography className="timeline-title">
                      {event.title}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Card>
  );
}
