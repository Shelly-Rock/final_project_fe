export interface Class {
  id: string;
  name: string;
  major: string;
  year: number;
  studentCount: number;
  status: "active" | "inactive";
}

export const mockClasses: Class[] = [
  {
    id: "1",
    name: "CNTT-K62",
    major: "Công nghệ thông tin",
    year: 2020,
    studentCount: 45,
    status: "active",
  },
  {
    id: "2",
    name: "KHMT-K62",
    major: "Khoa học máy tính",
    year: 2020,
    studentCount: 40,
    status: "active",
  },
  {
    id: "3",
    name: "KTMT-K63",
    major: "Kỹ thuật máy tính",
    year: 2021,
    studentCount: 38,
    status: "active",
  },
  {
    id: "4",
    name: "ATTT-K63",
    major: "An toàn thông tin",
    year: 2021,
    studentCount: 35,
    status: "inactive",
  },
  {
    id: "5",
    name: "HTTT-K64",
    major: "Hệ thống thông tin",
    year: 2022,
    studentCount: 42,
    status: "active",
  },
];
