export interface Statistics {
  overview: {
    totalStudents: number;
    totalTeachers: number;
    totalTheses: number;
    completedTheses: number;
  };
  byDepartment: Array<{
    department: string;
    total: number;
    completed: number;
    rate: number;
  }>;
  byScore: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
}

export const mockStatistics: Statistics = {
  overview: {
    totalStudents: 1200,
    totalTeachers: 50,
    totalTheses: 350,
    completedTheses: 280,
  },
  byDepartment: [
    { department: "CNTT", total: 450, completed: 380, rate: 84 },
    { department: "KHMT", total: 300, completed: 250, rate: 83 },
    { department: "KTMT", total: 200, completed: 150, rate: 75 },
    { department: "ATTT", total: 150, completed: 120, rate: 80 },
    { department: "HTTT", total: 100, completed: 80, rate: 80 },
  ],
  byScore: [
    { range: "9-10", count: 45, percentage: 16 },
    { range: "8-9", count: 120, percentage: 43 },
    { range: "7-8", count: 85, percentage: 30 },
    { range: "6-7", count: 25, percentage: 9 },
    { range: "<6", count: 5, percentage: 2 },
  ],
};
