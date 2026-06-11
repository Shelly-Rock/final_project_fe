"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  FileDownload as DownloadIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import { PageHeader } from "@/shared/components";
import { mockReports } from "@/feature/report/constants";

export default function ReportPage() {
  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Báo cáo"
        subtitle="Xem và xuất các báo cáo hệ thống"
        actions={
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Tạo báo cáo
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockReports.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Báo cáo đã tạo
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                12
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mẫu báo cáo
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                156
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lượt tải
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Báo cáo tháng này
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Tạo báo cáo mới
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControl size="small">
                  <InputLabel>Loại báo cáo</InputLabel>
                  <Select value="summary" label="Loại báo cáo">
                    <MenuItem value="summary">Tổng quan</MenuItem>
                    <MenuItem value="student">Sinh viên</MenuItem>
                    <MenuItem value="score">Điểm đồ án</MenuItem>
                    <MenuItem value="progress">Tiến độ</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small">
                  <InputLabel>Học kỳ</InputLabel>
                  <Select value="HK2 2023-2024" label="Học kỳ">
                    <MenuItem value="HK2 2023-2024">HK2 2023-2024</MenuItem>
                    <MenuItem value="HK1 2023-2024">HK1 2023-2024</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" fullWidth>
                  Xuất báo cáo
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Báo cáo đã tạo
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.100" }}>
                      <TableCell sx={{ fontWeight: 600 }}>Tiêu đề</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Loại</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Học kỳ</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Ngày tạo</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.title}</TableCell>
                        <TableCell>
                          <Chip
                            label={report.type}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{report.period}</TableCell>
                        <TableCell>{report.generatedDate}</TableCell>
                        <TableCell>
                          <Chip
                            label="Hoàn thành"
                            color="success"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button size="small" startIcon={<DownloadIcon />}>
                            Tải
                          </Button>
                          <Button size="small" startIcon={<PrintIcon />}>
                            In
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
