"use client";

import React, { useState } from "react";
import { Card, Button, Typography, Row, Col, Tag, Segmented, Table, Empty, Space, Progress, Badge } from "antd";
import {
  FlagOutlined,
  CalendarOutlined,
  FileTextOutlined,
  PlusOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
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

const statusConfig = {
  pending: { color: "default", label: "Chưa bắt đầu" },
  in_progress: { color: "processing", label: "Đang thực hiện" },
  completed: { color: "success", label: "Hoàn thành" },
  reviewed: { color: "cyan", label: "Đã xem" },
  approved: { color: "success", label: "Đã duyệt" },
};

export default function ThesisWorkPage() {
  const [activeTab, setActiveTab] = useState<"milestone" | "report">("milestone");

  const completedCount = mockMilestones.filter(m => m.status === "completed").length;
  const progress = Math.round((completedCount / mockMilestones.length) * 100);

  const tabOptions = [
    { label: "Milestone", value: "milestone" },
    { label: "Báo cáo tuần", value: "report" },
  ];

  const reportColumns: ColumnsType<WeeklyReport> = [
    {
      title: "Tuần",
      dataIndex: "week",
      key: "week",
      width: 100,
      render: (week) => <Tag color="default">Tuần {week}</Tag>,
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
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "Phản hồi",
      dataIndex: "feedback",
      key: "feedback",
      render: (feedback) => feedback ? <Text type="secondary">{feedback}</Text> : <Text type="secondary">-</Text>,
    },
    {
      title: "",
      key: "action",
      width: 60,
      render: () => (
        <Button type="text" icon={<EyeOutlined />} size="small" />
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Page Header */}
      <Title level={2} style={{ marginBottom: 8 }}>Thực hiện khóa luận</Title>
      <Text type="secondary">Theo dõi tiến độ và nộp báo cáo</Text>

      {/* Progress Overview */}
      <Row style={{ marginTop: 24, marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={5} style={{ margin: 0 }}>Tiến độ chung</Title>
              </Col>
              <Col>
                <Text type="secondary">{progress}%</Text>
              </Col>
            </Row>
            <Progress percent={progress} showInfo={false} status="success" style={{ marginTop: 12 }} />
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Segmented
            options={tabOptions}
            value={activeTab}
            onChange={(value) => setActiveTab(value as typeof activeTab)}
          />
        </Col>
      </Row>

      {/* Milestone List */}
      {activeTab === "milestone" && (
        <Row>
          <Col span={24}>
            <Card>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                {mockMilestones.map((milestone, index) => {
                  const status = statusConfig[milestone.status];
                  return (
                    <Card
                      key={milestone.id}
                      size="small"
                      style={{ border: "1px solid #f0f0f0" }}
                    >
                      <Row justify="space-between" align="middle">
                        <Col>
                          <Space>
                            <Badge
                              count={index + 1}
                              style={{ 
                                backgroundColor: milestone.status === "completed" ? "#52c41a" : 
                                                milestone.status === "in_progress" ? "#faad14" : "#d9d9d9" 
                              }}
                              showZero
                            />
                            <Space direction="vertical" size={0}>
                              <Text strong>{milestone.title}</Text>
                              <Text type="secondary" style={{ fontSize: 12 }}>{milestone.description}</Text>
                              <Space size={4}>
                                <CalendarOutlined style={{ color: "#999", fontSize: 12 }} />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  Hạn: {milestone.deadline}
                                </Text>
                              </Space>
                            </Space>
                          </Space>
                        </Col>
                        <Col>
                          <Tag color={status.color}>{status.label}</Tag>
                        </Col>
                      </Row>
                    </Card>
                  );
                })}
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      {/* Weekly Reports */}
      {activeTab === "report" && (
        <Row>
          <Col span={24}>
            <Card
              title="Báo cáo tuần"
              extra={
                <Button type="primary" icon={<PlusOutlined />}>
                  Nộp báo cáo mới
                </Button>
              }
            >
              <Table
                columns={reportColumns}
                dataSource={mockReports}
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
