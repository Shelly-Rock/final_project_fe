// Semester types
export interface Semester {
  id: string;
  name: string;
  code: string;          // VD: 2023-2024-HK2
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  topicDeadline: string;
  defenseDate?: string;
  status: "planning" | "registration" | "in_progress" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface PhaseConfig {
  id: string;
  semesterId: string;
  phaseName: string;
  startDate: string;
  endDate: string;
  description?: string;
}
