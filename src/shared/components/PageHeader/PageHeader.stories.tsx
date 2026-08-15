import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
import { PageHeader } from "./PageHeader";
import { Button } from "../Button";
import {
  Plus,
  Download,
  Edit,
  Trash2,
  Filter,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Settings,
  LayoutGrid,
  School,
} from "lucide-react";

const meta = {
  title: "Shared/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    badge: { control: "text" },
    showBackButton: { control: "boolean" },
    showDecorLine: { control: "boolean" },
    showWave: { control: "boolean" },
    showDotGrid: { control: "boolean" },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;

export const Default: StoryObj = {
  args: {
    badge: "QUẢN LÝ",
    title: "Quản lý sinh viên",
    subtitle: "Tìm kiếm và quản lý thông tin sinh viên",
    badgeIcon: <LayoutGrid size={14} />,
    illustration: <Users size={56} strokeWidth={1.5} />,
  },
};

export const WithActions: StoryObj = {
  args: {
    badge: "QUẢN LÝ",
    title: "Quản lý sinh viên",
    subtitle: "Tổng cộng 150 sinh viên đang hoạt động",
    badgeIcon: <LayoutGrid size={14} />,
    illustration: <Users size={56} strokeWidth={1.5} />,
    actions: (
      <>
        <Button variant="outlined" leftIcon={<Filter size={16} />}>
          Lọc
        </Button>
        <Button variant="outlined" leftIcon={<Download size={16} />}>
          Xuất Excel
        </Button>
        <Button variant="contained" leftIcon={<Plus size={16} />}>
          Thêm mới
        </Button>
      </>
    ),
  },
};

export const TeachersPage: StoryObj = {
  args: {
    badge: "GIÁO VIÊN",
    title: "Quản lý giáo viên",
    subtitle: "Danh sách giáo viên và thông tin giảng dạy",
    badgeIcon: <School size={14} />,
    illustration: <GraduationCap size={56} strokeWidth={1.5} />,
    actions: (
      <Button variant="contained" leftIcon={<Plus size={16} />}>
        Thêm giáo viên
      </Button>
    ),
  },
};

export const CoursesPage: StoryObj = {
  args: {
    badge: "HỌC TẬP",
    title: "Danh sách khóa học",
    subtitle: "12 khóa học đang hoạt động trong học kỳ này",
    badgeIcon: <BookOpen size={14} />,
    illustration: <BookOpen size={56} strokeWidth={1.5} />,
    breadcrumbs: [
      { label: "Trang chủ", href: "/" },
      { label: "Học tập", href: "/learning" },
      { label: "Khóa học" },
    ],
  },
};

export const SchedulePage: StoryObj = {
  args: {
    badge: "LỊCH TRÌNH",
    title: "Lịch học",
    subtitle: "Lịch học tuần từ 14/07 - 20/07/2026",
    badgeIcon: <Calendar size={14} />,
    illustration: <Calendar size={56} strokeWidth={1.5} />,
    breadcrumbs: [{ label: "Trang chủ", href: "/" }, { label: "Lịch trình" }],
    showBackButton: true,
    onBack: () => alert(" Quay lại"),
  },
};

export const FullOptions: StoryObj = {
  args: {
    badge: "QUẢN TRỊ",
    title: "Cài đặt hệ thống",
    subtitle: "Quản lý cấu hình và thiết lập hệ thống",
    badgeIcon: <Settings size={14} />,
    illustration: <Settings size={56} strokeWidth={1.5} />,
    breadcrumbs: [
      { label: "Trang chủ", href: "/" },
      { label: "Quản trị", href: "/admin" },
      { label: "Cài đặt" },
    ],
    showBackButton: true,
    onBack: () => alert(" Quay lại"),
    actions: (
      <>
        <Button
          variant="outlined"
          color="error"
          leftIcon={<Trash2 size={16} />}
        >
          Xóa dữ liệu
        </Button>
        <Button variant="contained" leftIcon={<Edit size={16} />}>
          Lưu thay đổi
        </Button>
      </>
    ),
  },
};

export const WithoutBadge: StoryObj = {
  args: {
    title: "Quản lý sinh viên",
    subtitle: "Tìm kiếm và quản lý thông tin sinh viên",
    illustration: <Users size={56} strokeWidth={1.5} />,
  },
};

export const WithoutIllustration: StoryObj = {
  args: {
    badge: "QUẢN LÝ",
    title: "Quản lý sinh viên",
    subtitle: "Tìm kiếm và quản lý thông tin sinh viên",
    badgeIcon: <LayoutGrid size={14} />,
  },
};

export const WithoutDecorLine: StoryObj = {
  args: {
    badge: "QUẢN LÝ",
    title: "Quản lý sinh viên",
    subtitle: "Tìm kiếm và quản lý thông tin sinh viên",
    badgeIcon: <LayoutGrid size={14} />,
    illustration: <Users size={56} strokeWidth={1.5} />,
    showDecorLine: false,
  },
};

export const Minimal: StoryObj = {
  args: {
    badge: "QUẢN LÝ",
    title: "Quản lý sinh viên",
    subtitle: "Tìm kiếm và quản lý thông tin sinh viên",
    badgeIcon: <LayoutGrid size={14} />,
    illustration: <Users size={56} strokeWidth={1.5} />,
    showWave: false,
    showDotGrid: false,
  },
};

export const DashboardOverview: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <PageHeader
        badge="QUẢN LÝ"
        title="Quản lý sinh viên"
        subtitle="Tìm kiếm và quản lý thông tin sinh viên"
        badgeIcon={<LayoutGrid size={14} />}
        illustration={<Users size={56} strokeWidth={1.5} />}
        actions={
          <>
            <Button variant="outlined" leftIcon={<Filter size={16} />}>
              Lọc
            </Button>
            <Button variant="contained" leftIcon={<Plus size={16} />}>
              Thêm mới
            </Button>
          </>
        }
      />

      <PageHeader
        badge="GIÁO VIÊN"
        title="Quản lý giáo viên"
        subtitle="Danh sách giáo viên và thông tin giảng dạy"
        badgeIcon={<School size={14} />}
        illustration={<GraduationCap size={56} strokeWidth={1.5} />}
        actions={
          <Button variant="contained" leftIcon={<Plus size={16} />}>
            Thêm giáo viên
          </Button>
        }
      />

      <PageHeader
        badge="HỌC TẬP"
        title="Danh sách khóa học"
        subtitle="Tất cả khóa học trong học kỳ hiện tại"
        badgeIcon={<BookOpen size={14} />}
        illustration={<BookOpen size={56} strokeWidth={1.5} />}
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Học tập" },
          { label: "Khóa học" },
        ]}
      />

      <PageHeader
        badge="LỊCH TRÌNH"
        title="Lịch học"
        subtitle="Lịch học tuần từ 14/07 - 20/07/2026"
        badgeIcon={<Calendar size={14} />}
        illustration={<Calendar size={56} strokeWidth={1.5} />}
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Lịch trình" },
        ]}
        showBackButton
        onBack={() => alert(" Quay lại")}
      />
    </Box>
  ),
};
