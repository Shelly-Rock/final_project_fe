"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import {
  PageHeader,
  OverviewStats,
  FacultyCharts,
  ThesisTrendChart,
  PendingTheses,
  OverloadedLecturers,
  UnregisteredStudents,
  SecretaryDepartmentsCard,
  TeacherMyStudentsCard,
  StudentPerformanceCard,
  TopicSelectionForm,
  TeacherProposalForm,
  TeacherProposalsList,
  SecretaryThesisApproval,
  EditProposalDialog,
} from "@/feature/homepage";
import { usePermissionContext } from "@/core/providers/PermissionProvider";
import { ROLE } from "@/core/permissions/types";
import { ThesisProposal } from "@/feature/homepage/data";

export default function DashboardPage() {
  const { role } = usePermissionContext();

  const isAdmin = role === ROLE.ADMIN;
  const isSecretary = role === ROLE.SECRETARY;
  const isTeacher = role === ROLE.TEACHER;
  const isStudent = role === ROLE.STUDENT;

  // Student state
  const [topicFormOpen, setTopicFormOpen] = useState(false);

  // Teacher state
  const [proposalFormOpen, setProposalFormOpen] = useState(false);

  // Secretary state
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] =
    useState<ThesisProposal | null>(null);

  // Handlers
  const handleStudentSelectTopic = (proposal: ThesisProposal) => {
    console.log("Student selected topic:", proposal);
    // TODO: API call to select topic
  };

  const handleTeacherSubmitProposal = (proposal: {
    title: string;
    description: string;
    requirements: string;
    expectedOutcome: string;
    department: string;
    maxStudents: number;
  }) => {
    console.log("Teacher submitted proposal:", proposal);
    // TODO: API call to submit proposal
  };

  const handleSecretaryApprove = (id: number) => {
    console.log("Secretary approved proposal:", id);
    // TODO: API call to approve
  };

  const handleSecretaryReject = (id: number, reason: string) => {
    console.log("Secretary rejected proposal:", id, reason);
    // TODO: API call to reject
  };

  const handleSecretaryEdit = (proposal: ThesisProposal) => {
    setSelectedProposal(proposal);
    setEditDialogOpen(true);
  };

  const handleSecretarySaveEdit = (proposal: ThesisProposal) => {
    console.log("Secretary saved edited proposal:", proposal);
    // TODO: API call to update
  };

  return (
    <Box className="dashboard-page">
      <PageHeader />
      <OverviewStats role={role ?? ROLE.ADMIN} />

      {/* ========== ADMIN DASHBOARD ========== */}
      {isAdmin && (
        <>
          <Box className="dashboard-section">
            <FacultyCharts />
          </Box>
          <Box className="dashboard-section">
            <ThesisTrendChart />
          </Box>
          <Box className="dashboard-section">
            <PendingTheses />
          </Box>
          <Box className="dashboard-section">
            <UnregisteredStudents />
          </Box>
        </>
      )}

      {/* ========== SECRETARY DASHBOARD ========== */}
      {isSecretary && (
        <>
          <Box className="dashboard-section">
            <SecretaryDepartmentsCard />
          </Box>
          <Box className="dashboard-section">
            <OverloadedLecturers />
          </Box>
          <Box className="dashboard-section">
            <Card sx={{ p: 2, mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    <i
                      className="bi bi-clipboard-check"
                      style={{ marginRight: 8, color: "#1dab60" }}
                    />
                    Phê duyệt đề tài
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duyệt và quản lý đề tài từ giảng viên
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<i className="bi bi-check-circle" />}
                  onClick={() => setApprovalDialogOpen(true)}
                >
                  Duyệt đề tài
                </Button>
              </Box>
            </Card>
          </Box>
          <Box className="dashboard-section">
            <PendingTheses />
          </Box>
          <Box className="dashboard-section">
            <UnregisteredStudents />
          </Box>
        </>
      )}

      {/* ========== TEACHER DASHBOARD ========== */}
      {isTeacher && (
        <>
          <Box className="dashboard-section">
            <TeacherProposalsList
              onCreateNew={() => setProposalFormOpen(true)}
            />
          </Box>
          <Box className="dashboard-section">
            <TeacherMyStudentsCard />
          </Box>
          <Box className="dashboard-section">
            <PendingTheses />
          </Box>
        </>
      )}

      {/* ========== STUDENT DASHBOARD ========== */}
      {isStudent && (
        <>
          <Box className="dashboard-section">
            <Card sx={{ p: 2, mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    <i
                      className="bi bi-journal-plus"
                      style={{ marginRight: 8, color: "#2a5bc0" }}
                    />
                    Đăng ký đề tài
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chọn đề tài đồ án phù hợp với bạn
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<i className="bi bi-search" />}
                  onClick={() => setTopicFormOpen(true)}
                >
                  Xem đề tài khả dụng
                </Button>
              </Box>
            </Card>
          </Box>
          <Box className="dashboard-section">
            <StudentPerformanceCard />
          </Box>
        </>
      )}

      {/* ========== DIALOGS ========== */}

      {/* Student: Topic Selection Form */}
      <TopicSelectionForm
        open={topicFormOpen}
        onClose={() => setTopicFormOpen(false)}
        onSelect={handleStudentSelectTopic}
      />

      {/* Teacher: Create Proposal Form */}
      <TeacherProposalForm
        open={proposalFormOpen}
        onClose={() => setProposalFormOpen(false)}
        onSubmit={handleTeacherSubmitProposal}
      />

      {/* Secretary: Thesis Approval Dialog */}
      <SecretaryThesisApproval
        open={approvalDialogOpen}
        onClose={() => setApprovalDialogOpen(false)}
        onApprove={handleSecretaryApprove}
        onReject={handleSecretaryReject}
        onEdit={handleSecretaryEdit}
      />

      {/* Secretary: Edit Proposal Dialog */}
      <EditProposalDialog
        open={editDialogOpen}
        proposal={selectedProposal}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedProposal(null);
        }}
        onSave={handleSecretarySaveEdit}
      />
    </Box>
  );
}
