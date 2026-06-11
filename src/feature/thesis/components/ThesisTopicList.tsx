"use client";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { BookmarkAdd as BookmarkIcon } from "@mui/icons-material";
import type { ThesisTopic } from "../constants";

interface ThesisTopicListProps {
  topics: ThesisTopic[];
}

export function ThesisTopicList({ topics }: ThesisTopicListProps) {
  return (
    <Grid container spacing={3}>
      {topics.map((topic) => (
        <Grid item xs={12} md={6} lg={4} key={topic.id}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Chip
                  label={topic.department}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`${topic.registered}/${topic.slots} SV`}
                  size="small"
                  color={topic.registered >= topic.slots ? "error" : "success"}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{ mb: 1, fontWeight: 600, fontSize: "1rem" }}
              >
                {topic.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                GVHD: {topic.lecturer}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={<BookmarkIcon />}
                disabled={topic.registered >= topic.slots}
              >
                {topic.registered >= topic.slots ? "Đã đầy" : "Đăng ký"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
