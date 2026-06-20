"use client";

import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Tag,
  Button,
  Table,
  Segmented,
  Space,
  Progress,
  Avatar,
  Empty,
} from "antd";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface Milestone {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: "pending" | "in_progress" | "completed";
}

interface WeeklyReport {
  id: number;
  week: number;
  title: string;
  content: string;
  submittedAt: string;
  status: "pending" | "reviewed" | "approved";
  feedback?: string;
}

const mockMilestones: Milestone[] = [
  { id: 1, title: "Hoàn thành đề cương", description: "Viết và nộp đề cương chi tiết", deadline: "2024-02-15", status: "completed" },
  { id: 2, title: "Thu thập dữ liệu", description: "Thu thập và xử lý dữ liệu cần thiết", deadline: "2024-03-15", status: "in_progress" },
  { id: 3, title: "Xây dựng module chính", description: "Phát triển các module chức năng cốt lõi", deadline: "2024-04-30", status: "pending" },
  { id: 4, title: "Kiểm thử hệ thống", description: "Testing và sửa lỗi", deadline: "2024-05-15", status: "pending" },
  { id: 5, title: "Viết báo cáo", description: "Hoàn thiện báo cáo và tài liệu", deadline: "2024-05-30", status: "pending" },
];

const mockReports: WeeklyReport[] = [
  { id: 1, week: 1, title: "Tuần 1 - Khảo sát yêu cầu", content: "Đã khảo sát và phân tích yêu cầu hệ thống...", submittedAt: "2024-01-08", status: "approved", feedback: "Tốt, tiếp tục công việc" },
  { id: 2, week: 2, title: "Tuần 2 - Thiết kế giao diện", content: "Đã hoàn thành thiết kế mockup cho các màn hình chính...", submittedAt: "2024-01-15", status: "reviewed", feedback: "Cần bổ sung thiết kế màn hình chi tiết" },
  { id: 3, week: 3, title: "Tuần 3 - Setup môi trường", content: "Đã setup React, Node.js và cơ sở dữ liệu...", submittedAt: "2024-01-22", status: "pending" },
];

export default function StudentWorkPage() {
  const [milestones] = useState<Milestone[]>(mockMilestones);
  const [reports] = useState<WeeklyReport[]>(mockReports);
  const [activeTab, setActiveTab] = useState<"milestone" | "report">("milestone");

  const getStatusTag = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: "default",
      in_progress: "gold",
      completed: "green",
      reviewed: "cyan",
      approved: "green",
    };
    const textMap: Record<string, string> = {
      pending: "Chưa bắt đầu",
      in_progress: "Đang thực hiện",
      completed: "Hoàn thành",
      reviewed: "Đã xem",
      approved: "Đã duyệt",
    };
    return <Tag color={colorMap[status]}>{textMap[status]}</Tag>;
  };

  const completedCount = milestones.filter(m => m.status === "completed").length;
  const progress = Math.round((completedCount / milestones.length) * 100);

  const reportColumns: ColumnsType<WeeklyReport> = [
    {
      title: "Tuần",
      dataIndex: "week",
      key: "week",
      render: (week: number) => <Tag color="blue">Tuần {week}</Tag>,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Ngày nộp",
      dataIndex: "submittedAt",
      key: "submittedAt",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Phản hồi",
      dataIndex: "feedback",
      key: "feedback",
      render: (feedback?: string) => feedback ? <Text type="secondary">{feedback}</Text> : <Text type="secondary">-</Text>,
    },
    {
      title: "",
      key: "action",
      render: () => <Button type="link" size="small">Xem</Button>,
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[0, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2} style={{ marginBottom: 8 }}>Thực hiện khóa luận</Title>
          <Text type="secondary">Theo dõi tiến độ và nộp báo cáo</Text>
        </Col>
      </Row>

      {/* Progress Overview */}
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Space direction="horizontal" style={{ width: "100%", justifyContent: "space-between" }}>
                <Title level={5} style={{ marginBottom: 0 }}>Tiến độ chung</Title>
                <Text type="secondary">{progress}%</Text>
              </Space>
              <Progress percent={progress} status="active" showInfo={false} strokeColor="#52c41a" />
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Segmented
        options={[
          { label: "Milestone", value: "milestone" },
          { label: "Báo cáo tuần", value: "report" },
        ]}
        value={activeTab}
        onChange={(value) => setActiveTab(value as "milestone" | "report")}
        style={{ marginBottom: 24 }}
      />

      {/* Milestone List */}
      {activeTab === "milestone" && (
        <Row>
          <Col span={24}>
            <Card >
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "16px 0",
                    borderBottom: index < milestones.length - 1 ? "1px solid #f0f0f0" : "none",
                  }}
                >
                  <Space direction="horizontal" size="middle" align="start">
                    <Avatar
                      style={{
                        background: milestone.status === "completed" ? "#52c41a" : milestone.status === "in_progress" ? "#faad14" : "#d9d9d9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      size={30}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>{index + 1}</Text>
                    </Avatar>
                    <Space direction="vertical" size={0}>
                      <Text strong>{milestone.title}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{milestone.description}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>📅 Hạn: {milestone.deadline}</Text>
                    </Space>
                  </Space>
                  {getStatusTag(milestone.status)}
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      )}

      {/* Weekly Reports */}
      {activeTab === "report" && (
        <Row>
          <Col span={24}>
            <Space direction="horizontal" style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }}>
              <Title level={5} style={{ marginBottom: 0 }}>Báo cáo tuần</Title>
              <Button type="primary" icon="+">
                Nộp báo cáo mới
              </Button>
            </Space>
            <Card >
              <Table
                columns={reportColumns}
                dataSource={reports}
                rowKey="id"
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
