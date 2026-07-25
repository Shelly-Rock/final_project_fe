"use client";

export interface AvailableTopic {
  id: string;
  name: string;
  teacherName: string;
  teacherEmail: string;
  department: string;
  maxStudents: number;
  registeredCount: number;
  status: "Approved" | "Pending" | "Closed";
  description: string;
  objectives: string;
  technicalRequirements: string;
  expectedOutcome: string;
  createdAt: string;
}

export interface RegistrationRequest {
  id: string;
  topicId: string;
  topicName: string;
  teacherName: string;
  teacherEmail: string;
  studentId: string;
  studentName: string;
  requestedAt: string;
  status: "Pending" | "Approved" | "Rejected";
  rejectionReason?: string;
}

export interface StudentTopicRegistrationState {
  availableTopics: AvailableTopic[];
  registrationHistory: RegistrationRequest[];
}
