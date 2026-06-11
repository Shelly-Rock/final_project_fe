"use client";

import { useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Grade as GradeIcon } from "@mui/icons-material";
import { FilterBar } from "@/shared/components";
import type { ThesisScore } from "../constants";
import { getGradeColor } from "../constants";

interface ThesisScoreTableProps {
  scores: ThesisScore[];
}

export function ThesisScoreTable({
  scores: initialScores,
}: ThesisScoreTableProps) {
  const [scores] = useState(initialScores);

  return (
    <>
      <FilterBar totalCount={scores.length}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select value="all" label="Trạng thái">
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="scored">Đã chấm</MenuItem>
            <MenuItem value="pending">Chưa chấm</MenuItem>
          </Select>
        </FormControl>
      </FilterBar>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Sinh viên</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Đề tài</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  Quá trình
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  Báo cáo
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  Bảo vệ
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  Tổng kết
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scores.map((score, index) => (
                <TableRow key={score.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{score.student}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>{score.thesis}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {score.processScore !== null ? (
                      <Chip
                        label={score.processScore}
                        color={getGradeColor(score.processScore)}
                        size="small"
                      />
                    ) : (
                      <TextField
                        type="number"
                        size="small"
                        inputProps={{ min: 0, max: 10 }}
                        sx={{ width: 70 }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {score.reportScore !== null ? (
                      <Chip
                        label={score.reportScore}
                        color={getGradeColor(score.reportScore)}
                        size="small"
                      />
                    ) : (
                      <TextField
                        type="number"
                        size="small"
                        inputProps={{ min: 0, max: 10 }}
                        sx={{ width: 70 }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {score.defenseScore !== null ? (
                      <Chip
                        label={score.defenseScore}
                        color={getGradeColor(score.defenseScore)}
                        size="small"
                      />
                    ) : (
                      <TextField
                        type="number"
                        size="small"
                        inputProps={{ min: 0, max: 10 }}
                        sx={{ width: 70 }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {score.finalScore !== null ? (
                      <Chip
                        label={score.finalScore}
                        color={getGradeColor(score.finalScore)}
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<GradeIcon />}
                    >
                      Lưu
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
