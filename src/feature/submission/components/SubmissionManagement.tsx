/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps, react/jsx-no-undef */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  message,
  Tag,
  Space,
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Popconfirm,
  Select,
} from "antd";
import { CheckOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { submissionService, Submission, SubmissionStatus } from "../services";

const { Title } = Typography;
const { Option } = Select;

const statusColors: Record<SubmissionStatus, string> = {
  PENDING: "orange",
  APPROVED: "green",
  REJECTED: "red",
};

const statusLabels: Record<SubmissionStatus, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

interface SubmissionWithName extends Submission {
  studentName?: string;
  studentMssv?: string;
  projectCode?: string;
  projectName?: string;
}

export default function SubmissionManagement() {
  const [submissions, setSubmissions] = useState<SubmissionWithName[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "">("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionWithName | null>(null);
  const [reviewStatus, setReviewStatus] =
    useState<SubmissionStatus>("APPROVED");
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await submissionService.getSubmissions({
        page: pagination.current,
        limit: pagination.pageSize,
        status: statusFilter || undefined,
      });
      setSubmissions(result.data as SubmissionWithName[]);
      setPagination((prev) => ({ ...prev, total: result.total }));
    } catch {
      message.error("Không thể tải danh sách bài nộp");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const result = await submissionService.getStats();
      setStats(result);
    } catch {
      // silent fail for stats
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
    fetchStats();
  }, [fetchSubmissions, fetchStats]);

  const handleReview = async () => {
    if (!selectedSubmission) return;
    setSubmitting(true);
    try {
      await submissionService.reviewSubmission(selectedSubmission.id, 1, {
        status: reviewStatus,
        rejectionReason:
          reviewStatus === "REJECTED" ? rejectionReason : undefined,
      });
      message.success(
        reviewStatus === "APPROVED" ? "Đã duyệt bài nộp" : "Đã từ chối bài nộp",
      );
      setReviewModalVisible(false);
      fetchSubmissions();
      fetchStats();
    } catch {
      message.error("Không thể duyệt bài nộp");
    } finally {
      setSubmitting(false);
    }
  };

  const openReviewModal = (submission: SubmissionWithName) => {
    setSelectedSubmission(submission);
    setReviewStatus("APPROVED");
    setRejectionReason("");
    setReviewModalVisible(true);
  };

  const columns: ColumnsType<SubmissionWithName> = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
    },
    {
      title: "MSSV",
      dataIndex: "studentMssv",
      key: "studentMssv",
      width: 120,
    },
    {
      title: "Sinh viên",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Mã đề tài",
      dataIndex: "projectCode",
      key: "projectCode",
      width: 150,
    },
    {
      title: "Tên đề tài",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "File",
      dataIndex: "fileName",
      key: "fileName",
      render: (name: string) => (
        <a href="#" onClick={() => window.open(name, "_blank")}>
          {name}
        </a>
      ),
    },
    {
      title: "Ngày nộp",
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: SubmissionStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
      width: 120,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) =>
        record.status === "PENDING" ? (
          <Space>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              size="small"
              onClick={() => openReviewModal(record)}
            >
              Duyệt
            </Button>
            <Popconfirm
              title="Từ chối bài nộp?"
              onConfirm={() => {
                setSelectedSubmission(record);
                setReviewStatus("REJECTED");
                setRejectionReason("");
                setReviewModalVisible(true);
              }}
            >
              <Button danger icon={<CloseOutlined />} size="small">
                Từ chối
              </Button>
            </Popconfirm>
          </Space>
        ) : (
          <Button icon={<EyeOutlined />} size="small">
            Xem
          </Button>
        ),
      width: 180,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Quản lý nộp bài cuối kỳ</Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng bài nộp" value={stats.total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Chờ duyệt"
              value={stats.pending}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã duyệt"
              value={stats.approved}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Từ chối"
              value={stats.rejected}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Lọc trạng thái"
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150 }}
          allowClear
        >
          <Option value="">Tất cả</Option>
          <Option value="PENDING">Chờ duyệt</Option>
          <Option value="APPROVED">Đã duyệt</Option>
          <Option value="REJECTED">Từ chối</Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={submissions}
        loading={loading}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} bài nộp`,
          onChange: (page, pageSize) =>
            setPagination({ ...pagination, current: page, pageSize }),
        }}
      />

      <Modal
        title={
          reviewStatus === "APPROVED" ? "Duyệt bài nộp" : "Từ chối bài nộp"
        }
        open={reviewModalVisible}
        onOk={handleReview}
        onCancel={() => setReviewModalVisible(false)}
        confirmLoading={submitting}
        okText={reviewStatus === "APPROVED" ? "Duyệt" : "Từ chối"}
        okButtonProps={{ danger: reviewStatus === "REJECTED" }}
      >
        {selectedSubmission && (
          <div>
            <p>
              <strong>Sinh viên:</strong> {selectedSubmission.studentName}
            </p>
            <p>
              <strong>Đề tài:</strong> {selectedSubmission.projectName}
            </p>
            <p>
              <strong>File:</strong> {selectedSubmission.fileName}
            </p>
            {reviewStatus === "REJECTED" && (
              <div style={{ marginTop: 16 }}>
                <label>Lý do từ chối:</label>
                <Form.Item style={{ marginTop: 8 }}>
                  <Input.TextArea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                    rows={4}
                  />
                </Form.Item>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
