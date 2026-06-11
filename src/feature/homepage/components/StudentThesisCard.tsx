"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import { RECENT_THESES } from "../data";

export function StudentThesisCard() {
  const myThesis = RECENT_THESES[0];

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Đồ án của tôi
      </Typography>

      {myThesis && (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            {myThesis.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Tiến độ
            </Typography>
            <LinearProgress
              variant="determinate"
              value={myThesis.progress}
              sx={{ flex: 1, height: 6, borderRadius: 3 }}
            />
            <Typography variant="caption" sx={{ fontWeight: 500 }}>
              {myThesis.progress}%
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="primary">
                2
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Phản hồi
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="warning.main">
                15/07
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Deadline
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="success.main">
                TS. Trần Minh
              </Typography>
              <Typography variant="caption" color="text.secondary">
                GVHD
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Card>
  );
}
