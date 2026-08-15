import type { Meta, StoryObj } from "@storybook/react";
import { Box, Button, TextField, MenuItem, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { PageHeader, FilterBar } from "./PageTemplate";

const meta = {
  title: "Shared/PageTemplate",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

export const PageHeaderDefault: StoryObj = {
  render: () => (
    <Box sx={{ bgcolor: "#fff", p: 2 }}>
      <PageHeader
        title="Quản lý sinh viên"
        subtitle="Danh sách sinh viên trong hệ thống"
      />
    </Box>
  ),
};

export const PageHeaderWithActions: StoryObj = {
  render: () => (
    <Box sx={{ bgcolor: "#fff", p: 2 }}>
      <PageHeader
        title="Quản lý sinh viên"
        subtitle="Danh sách sinh viên trong hệ thống"
        actions={
          <>
            <Button variant="contained" startIcon={<AddIcon />}>
              Thêm sinh viên
            </Button>
            <Button variant="outlined">Xuất Excel</Button>
          </>
        }
      />
    </Box>
  ),
};

export const PageHeaderOnlyTitle: StoryObj = {
  render: () => (
    <Box sx={{ bgcolor: "#fff", p: 2 }}>
      <PageHeader title="Trang chủ" />
    </Box>
  ),
};

export const FilterBarBasic: StoryObj = {
  render: () => (
    <Box sx={{ bgcolor: "#f5f5f5", p: 2 }}>
      <FilterBar>
        <TextField
          label="Tìm kiếm"
          size="small"
          placeholder="Nhập tên, email..."
        />
        <TextField
          select
          label="Lớp"
          size="small"
          defaultValue=""
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Tất cả lớp</MenuItem>
          <MenuItem value="CNTT-01">CNTT-01</MenuItem>
          <MenuItem value="CNTT-02">CNTT-02</MenuItem>
        </TextField>
      </FilterBar>
    </Box>
  ),
};

export const FilterBarWithRefresh: StoryObj = {
  render: () => (
    <Box sx={{ bgcolor: "#f5f5f5", p: 2 }}>
      <FilterBar
        onRefresh={() => console.log("Refreshing...")}
        totalCount={100}
        filteredCount={50}
      >
        <TextField
          label="Tìm kiếm"
          size="small"
          placeholder="Nhập tên, email..."
        />
        <TextField
          select
          label="Trạng thái"
          size="small"
          defaultValue=""
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="active">Hoạt động</MenuItem>
          <MenuItem value="inactive">Không hoạt động</MenuItem>
        </TextField>
      </FilterBar>
    </Box>
  ),
};

export const FilterBarWithCounts: StoryObj = {
  render: () => (
    <Box sx={{ bgcolor: "#f5f5f5", p: 2 }}>
      <FilterBar totalCount={100} filteredCount={75}>
        <TextField label="Tìm kiếm" size="small" placeholder="Nhập tên..." />
      </FilterBar>
    </Box>
  ),
};

export const CompletePageLayout: StoryObj = {
  render: () => (
    <Box sx={{ bgcolor: "#f5f5f5", p: 3, minHeight: "100vh" }}>
      <PageHeader
        title="Quản lý sinh viên"
        subtitle="Danh sách sinh viên trong hệ thống"
        actions={
          <Button variant="contained" startIcon={<AddIcon />}>
            Thêm sinh viên
          </Button>
        }
      />
      <FilterBar
        onRefresh={() => console.log("Refresh")}
        totalCount={150}
        filteredCount={42}
      >
        <TextField
          label="Tìm kiếm"
          size="small"
          placeholder="Nhập tên, email..."
        />
        <TextField
          select
          label="Lớp"
          size="small"
          defaultValue=""
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Tất cả lớp</MenuItem>
          <MenuItem value="CNTT-01">CNTT-01</MenuItem>
          <MenuItem value="CNTT-02">CNTT-02</MenuItem>
        </TextField>
        <TextField
          select
          label="Trạng thái"
          size="small"
          defaultValue=""
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="active">Hoạt động</MenuItem>
          <MenuItem value="inactive">Không hoạt động</MenuItem>
        </TextField>
      </FilterBar>
      <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Nội dung bảng dữ liệu sẽ hiển thị ở đây...
        </Typography>
      </Box>
    </Box>
  ),
};
