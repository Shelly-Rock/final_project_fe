import StudentSubmission from "@/feature/submission/components/StudentSubmission";

export default function StudentSubmissionPage() {
  // In real app, get student info from auth context
  const mockStudent = {
    studentId: 1,
    projectId: 1,
    projectCode: "DT001",
    projectName: "Hệ thống quản lý sinh viên",
  };

  return (
    <StudentSubmission
      studentId={mockStudent.studentId}
      projectId={mockStudent.projectId}
      projectCode={mockStudent.projectCode}
      projectName={mockStudent.projectName}
    />
  );
}
