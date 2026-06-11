"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Rating,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  RateReview as ReviewIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import type { ThesisReview } from "../constants";

interface ThesisReviewListProps {
  reviews: ThesisReview[];
}

export function ThesisReviewList({
  reviews: initialReviews,
}: ThesisReviewListProps) {
  const [reviews] = useState(initialReviews);
  const [filter, setFilter] = useState("all");

  const filteredReviews =
    filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={filter}
            label="Trạng thái"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="pending">Chờ phản biện</MenuItem>
            <MenuItem value="reviewed">Đã phản biện</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="h6">{review.thesisTitle}</Typography>
                <Chip
                  icon={<ReviewIcon />}
                  label={
                    review.status === "pending"
                      ? "Chờ phản biện"
                      : "Đã phản biện"
                  }
                  color={review.status === "pending" ? "warning" : "success"}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Sinh viên: {review.student}
              </Typography>

              {review.status === "reviewed" ? (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Đánh giá:</Typography>
                    <Rating value={review.rating ?? 0} readOnly size="small" />
                  </Box>
                  <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                    &ldquo;{review.comment}&rdquo;
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      Đánh giá:
                    </Typography>
                    <Rating size="small" />
                  </Box>
                  <TextField
                    size="small"
                    label="Nhận xét"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<SendIcon />}
                  >
                    Gửi
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  );
}
