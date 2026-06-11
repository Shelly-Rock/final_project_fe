export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  department: string;
  type: "mandatory" | "internship" | "project" | "thesis";
  status: "active" | "inactive";
}

export const typeConfig: Record<string, string> = {
  mandatory: "Bắt buộc",
  internship: "Thực tập",
  project: "Đề án",
  thesis: "Luận văn",
};

export const mockCourses: Course[] = [
  {
    id: "1",
    code: "INT3111",
    name: "Đồ án 1",
    credits: 3,
    department: "CNTT",
    type: "mandatory",
    status: "active",
  },
  {
    id: "2",
    code: "INT3112",
    name: "Đồ án 2",
    credits: 4,
    department: "CNTT",
    type: "mandatory",
    status: "active",
  },
  {
    id: "3",
    code: "INT2201",
    name: "Thực tập tốt nghiệp",
    credits: 5,
    department: "CNTT",
    type: "internship",
    status: "active",
  },
  {
    id: "4",
    code: "INT3501",
    name: "Đề án chuyên ngành",
    credits: 6,
    department: "KHMT",
    type: "project",
    status: "active",
  },
  {
    id: "5",
    code: "INT3502",
    name: "Luận văn tốt nghiệp",
    credits: 10,
    department: "KHMT",
    type: "thesis",
    status: "inactive",
  },
];
