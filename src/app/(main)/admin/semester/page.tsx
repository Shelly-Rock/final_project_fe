"use client";

import React, { useState } from "react";
import { Row, Col, Card, Button, Typography, Space, Tag, Table, Input, Select, Modal, Form, DatePicker, message } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface Semester {
  id: number;
  name: string;
  year: string;
  startDate: string;
  endDate: string;
  status: "draft" | "active" | "completed";
  thesisCount: number;
}

const mockSemesters: Semester[] = [
  {
    id: 1,
    name: "Học kỳ 1",
    year: "2023-2024",
    startDate: "2023-09-01",
    endDate: "2024-01-15",
    status: "completed",
    thesisCount: 50,
  },
  {
    id: 2,
    name: "Học kỳ 2",
    year: "2023-2024",
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    status: "active",
    thesisCount: 45,
  },
];

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "draft", label: "Nháp" },
  { value: "active", label: "Đang hoạt động" },
  { value: "completed", label: "Hoàn thành" },
];

const getStatusTag = (status: Semester["status"]) => {
  const map: Record<Semester["status"], { color: string; label: string }> = {
    draft: { color: "default", label: "Nháp" },
    active: { color: "success", label: "Đang hoạt động" },
    completed: { color: "blue", label: "Hoàn thành" },
  };
  return map[status];
};

export default function AdminSemesterPage() {
  const [semesters, setSemesters] = useState<Semester[]>(mockSemesters);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [form] = Form.useForm();

  const handleCreateSemester = () => {
    setEditingSemester(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditSemester = (semester: Semester) => {
    setEditingSemester(semester);
    form.setFieldsValue({
      ...semester,
      startDate: dayjs(semester.startDate),
      endDate: dayjs(semester.endDate),
    });
    setIsModalOpen(true);
  };

  const handleDeleteSemester = (id: number) => {
    Modal.confirm({
      title: "Xóa kỳ khóa luận",
      content: "Bạn có chắc chắn muốn xóa kỳ khóa luận này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        setSemesters(semesters.filter((s) => s.id !== id));
        message.success("Đã xóa kỳ khóa luận");
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const semesterData = {
        name: values.name,
        year: values.year,
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
        status: "draft" as const,
        thesisCount: 0,
      };

      if (editingSemester) {
        setSemesters(
          semesters.map((s) =>
            s.id === editingSemester.id ? { ...s, ...semesterData } : s
          )
        );
        message.success("Cập nhật kỳ khóa luận thành công");
      } else {
        const newSemester: Semester = {
          id: Math.max(...semesters.map((s) => s.id)) + 1,
          ...semesterData,
        };
        setSemesters([...semesters, newSemester]);
        message.success("Tạo kỳ khóa luận mới thành công");
      }
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const filteredSemesters = semesters.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       s.year.includes(searchTerm);
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: ColumnsType<Semester> = [
    {
      title: "Kỳ khóa luận",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.year}</Text>
        </div>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "startDate",
      key: "dates",
      render: (_, record) => (
        <Text type="secondary">
          {record.startDate} - {record.endDate}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const tag = getStatusTag(status);
        return <Tag color={tag.color}>{tag.label}</Tag>;
      },
    },
    {
      title: "Đề tài",
      dataIndex: "thesisCount",
      key: "thesisCount",
      render: (count) => <Text>{count} đề tài</Text>,
    },
    {
      title: "",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditSemester(record)} />
          <Button type="text" size="small" icon={<EyeOutlined />} />
          <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteSemester(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Title level={2} style={{ marginBottom: 4 }}>Quản lý kỳ khóa luận</Title>
            <Text type="secondary">Tạo và quản lý các kỳ khóa luận</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateSemester}>
            Tạo kỳ mới
          </Button>
        </div>
      </div>

      {/* Filter */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Input
              placeholder="Tìm kiếm kỳ khóa luận..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              style={{ width: "100%" }}
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
            />
          </Col>
        </Row>
      </Card>

      {/* Semester Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredSemesters}
          rowKey="id"
          pagination={false}
        />
        {filteredSemesters.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Text type="secondary">Chưa có kỳ khóa luận nào</Text>
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingSemester ? "Chỉnh sửa kỳ khóa luận" : "Tạo kỳ khóa luận mới"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText={editingSemester ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="name"
            label="Tên kỳ khóa luận"
            rules={[{ required: true, message: "Vui lòng nhập tên kỳ khóa luận" }]}
          >
            <Input placeholder="Ví dụ: Học kỳ 1" />
          </Form.Item>

          <Form.Item
            name="year"
            label="Năm học"
            rules={[{ required: true, message: "Vui lòng chọn năm học" }]}
          >
            <Select
              placeholder="Chọn năm học"
              options={[
                { value: "2024-2025", label: "2024-2025" },
                { value: "2025-2026", label: "2025-2026" },
                { value: "2026-2027", label: "2026-2027" },
              ]}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Ngày bắt đầu"
                rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="Ngày kết thúc"
                rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
