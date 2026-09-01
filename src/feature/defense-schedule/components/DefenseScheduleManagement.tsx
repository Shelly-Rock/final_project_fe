/* eslint-disable react-hooks/exhaustive-deps, no-console, react/jsx-no-undef */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Select,
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
  Input,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  FileWordOutlined,
  CheckOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  defenseService,
  DefenseSession,
  DefenseSessionStatus,
  Committee,
} from "../services";
import { committeeService } from "../../committee/services";

const { Title } = Typography;
const { Option } = Select;

const statusColors: Record<DefenseSessionStatus, string> = {
  SCHEDULED: "blue",
  COMPLETED: "green",
  CANCELLED: "red",
  RESCHEDULED: "orange",
};

const statusLabels: Record<DefenseSessionStatus, string> = {
  SCHEDULED: "Đã lên lịch",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  RESCHEDULED: "Đổi lịch",
};

export default function DefenseScheduleManagement() {
  const [sessions, setSessions] = useState<DefenseSession[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [stats, setStats] = useState({
    totalSessions: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    totalProjectsDefended: 0,
    averageScore: null as number | null,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingSession, setEditingSession] = useState<DefenseSession | null>(
    null,
  );
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await defenseService.getDefenseSessions({
        page: pagination.current,
        limit: pagination.pageSize,
      });
      setSessions(result.data);
      setPagination((prev) => ({ ...prev, total: result.total }));
    } catch {
      message.error("Không thể tải danh sách lịch bảo vệ");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize]);

  const fetchCommittees = useCallback(async () => {
    try {
      const result = await committeeService.getCommittees({ limit: 100 });
      setCommittees(result.data);
    } catch {
      console.error("Error fetching committees");
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const result = await defenseService.getStats();
      setStats(result);
    } catch {
      console.error("Error fetching stats");
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    fetchCommittees();
    fetchStats();
  }, [fetchSessions, fetchCommittees, fetchStats]);

  const openCreateModal = () => {
    setEditingSession(null);
    form.resetFields();
    form.setFieldsValue({
      durationMinutes: 15,
      defenseDate: dayjs(),
      startTime: dayjs("08:00", "HH:mm"),
    });
    setModalVisible(true);
  };

  const openEditModal = (session: DefenseSession) => {
    setEditingSession(session);
    form.setFieldsValue({
      committeeId: session.committeeId,
      defenseDate: dayjs(session.defenseDate),
      startTime: dayjs(session.startTime, "HH:mm"),
      room: session.room,
      durationMinutes: session.durationMinutes,
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const defenseDate = (values.defenseDate as Dayjs).format("YYYY-MM-DD");
      const startTime = (values.startTime as Dayjs).format("HH:mm");

      if (editingSession) {
        await defenseService.updateDefenseSession(editingSession.id, {
          defenseDate,
          startTime,
          room: values.room,
          durationMinutes: values.durationMinutes,
        });
        message.success("Cập nhật lịch bảo vệ thành công");
      } else {
        await defenseService.createDefenseSession({
          committeeId: values.committeeId,
          defenseDate,
          startTime,
          room: values.room,
          durationMinutes: values.durationMinutes,
        });
        message.success("Tạo lịch bảo vệ thành công");
      }

      setModalVisible(false);
      fetchSessions();
      fetchStats();
    } catch {
      message.error("Không thể lưu lịch bảo vệ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await defenseService.deleteDefenseSession(id);
      message.success("Xóa lịch bảo vệ thành công");
      fetchSessions();
      fetchStats();
    } catch {
      message.error("Không thể xóa lịch bảo vệ");
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await defenseService.completeDefenseSession(id);
      message.success("Đánh dấu hoàn thành thành công");
      fetchSessions();
      fetchStats();
    } catch {
      message.error("Không thể đánh dấu hoàn thành");
    }
  };

  const handleExportWord = async (sessionId: number) => {
    try {
      await defenseService.exportScheduleWord(sessionId);
      message.info("Tính năng xuất Word đang được phát triển");
    } catch {
      message.error("Không thể xuất lịch");
    }
  };

  const formatDate = (date: string) => {
    return dayjs(date).format("DD/MM/YYYY");
  };

  const columns: ColumnsType<DefenseSession> = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
    },
    {
      title: "Hội đồng",
      dataIndex: "committeeName",
      key: "committeeName",
    },
    {
      title: "Ngày bảo vệ",
      dataIndex: "defenseDate",
      key: "defenseDate",
      render: (date: string) => formatDate(date),
      width: 120,
    },
    {
      title: "Giờ bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      render: (time: string) => time,
      width: 100,
    },
    {
      title: "Giờ kết thúc",
      dataIndex: "estimatedEndTime",
      key: "estimatedEndTime",
      render: (time: string | null) => time || "-",
      width: 100,
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      width: 80,
    },
    {
      title: "Số đề tài",
      dataIndex: "projectCount",
      key: "projectCount",
      render: (count: number) => <Tag color="blue">{count}</Tag>,
      width: 100,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: DefenseSessionStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
      width: 120,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEditModal(record)}
            disabled={record.status === "COMPLETED"}
          />
          <Button
            type="text"
            icon={<FileWordOutlined />}
            size="small"
            onClick={() => handleExportWord(record.id)}
          />
          {record.status === "SCHEDULED" && (
            <Button
              type="text"
              icon={<CheckOutlined />}
              size="small"
              style={{ color: "#52c41a" }}
              onClick={() => handleComplete(record.id)}
            />
          )}
          <Popconfirm
            title="Xóa lịch bảo vệ này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={record.status === "COMPLETED"}
            />
          </Popconfirm>
        </Space>
      ),
      width: 180,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          <CalendarOutlined style={{ marginRight: 8 }} />
          Lịch bảo vệ
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
        >
          Tạo lịch bảo vệ
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic title="Tổng lịch" value={stats.totalSessions} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đã lên lịch"
              value={stats.scheduled}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={stats.completed}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đã hủy"
              value={stats.cancelled}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đề tài đã bảo vệ"
              value={stats.totalProjectsDefended}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Điểm TB"
              value={
                stats.averageScore !== null
                  ? stats.averageScore.toFixed(2)
                  : "-"
              }
              suffix="/10"
            />
          </Card>
        </Col>
      </Row>

      <Alert
        type="info"
        showIcon
        icon={<ClockCircleOutlined />}
        message="Tự động tính toán"
        description="Hệ thống tự động tính toán thời gian kết thúc dự kiến (15 phút/đề tài) và hỗ trợ xuất file Word lịch bảo vệ."
        style={{ marginBottom: 16 }}
      />

      <Table
        columns={columns}
        dataSource={sessions}
        loading={loading}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ padding: "8px 0" }}>
              <Typography.Text strong>Danh sách đề tài bảo vệ:</Typography.Text>
              <Table
                size="small"
                dataSource={record.projects}
                rowKey="projectId"
                pagination={false}
                columns={[
                  {
                    title: "Thứ tự",
                    dataIndex: "orderIndex",
                    key: "orderIndex",
                    width: 80,
                  },
                  {
                    title: "Giờ",
                    dataIndex: "scheduledTime",
                    key: "scheduledTime",
                    width: 80,
                  },
                  {
                    title: "Mã đề tài",
                    dataIndex: "projectCode",
                    key: "projectCode",
                    width: 120,
                  },
                  {
                    title: "Tên đề tài",
                    dataIndex: "projectName",
                    key: "projectName",
                  },
                  {
                    title: "Sinh viên",
                    dataIndex: "studentName",
                    key: "studentName",
                  },
                  {
                    title: "MSSV",
                    dataIndex: "studentMssv",
                    key: "studentMssv",
                    width: 100,
                  },
                  {
                    title: "Điểm",
                    dataIndex: "score",
                    key: "score",
                    render: (score: number | null) =>
                      score !== null ? score.toFixed(2) : "-",
                    width: 80,
                  },
                ]}
              />
            </div>
          ),
        }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} lịch`,
          onChange: (page, pageSize) =>
            setPagination({ ...pagination, current: page, pageSize }),
        }}
      />

      <Modal
        title={editingSession ? "Sửa lịch bảo vệ" : "Tạo lịch bảo vệ mới"}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={submitting}
        width={500}
        okText="Lưu"
      >
        <Form form={form} layout="vertical">
          {!editingSession && (
            <Form.Item
              name="committeeId"
              label="Hội đồng"
              rules={[{ required: true, message: "Vui lòng chọn hội đồng" }]}
            >
              <Select placeholder="Chọn hội đồng">
                {committees.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="defenseDate"
            label="Ngày bảo vệ"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label="Giờ bắt đầu"
                rules={[{ required: true, message: "Vui lòng chọn giờ" }]}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  format="HH:mm"
                  minuteStep={15}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="room" label="Phòng">
                <Input placeholder="VD: A101" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="durationMinutes" label="Thời gian mỗi đề tài (phút)">
            <Select>
              <Option value={10}>10 phút</Option>
              <Option value={15}>15 phút</Option>
              <Option value={20}>20 phút</Option>
              <Option value={30}>30 phút</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
