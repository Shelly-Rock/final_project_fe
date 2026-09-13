// ============================================================
// StudentSubmissionPage
// Trong production: lấy studentId, projectInfo và isLeader từ auth context / user store.
// Tạm thời dùng mock data để dev/test UI.
// ============================================================

import StudentSubmission from "@/feature/submission/components/StudentSubmission";

export default function StudentSubmissionPage() {
  // TODO: Thay thế bằng hook auth thực tế, ví dụ:
  //   const { user } = useAuth();
  //   const isLeader = user.role === "GROUP_LEADER";
  const mockStudent = {
    studentId: 1,
    projectId: 1,
    projectCode: "DT001",
    projectName: "Hệ thống quản lý sinh viên",
    isLeader: true, // false = thành viên khác (sẽ bị chặn giao diện nộp)
  };

  return (
    <StudentSubmission
      studentId={mockStudent.studentId}
      projectId={mockStudent.projectId}
      projectCode={mockStudent.projectCode}
      projectName={mockStudent.projectName}
      isLeader={mockStudent.isLeader}
    />
  );
}
