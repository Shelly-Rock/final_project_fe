"use client";

import React, { useState } from "react";
import { Row, Col, Card, Button, Typography, Space, Tag, Progress, Segmented, Avatar, Modal, Form, Input, Select, InputNumber, message } from "antd";
import { PlusOutlined, EyeOutlined, MessageOutlined } from "@ant-design/icons";
import type { SegmentedValue } from "antd/es/segmented";

const { Title, Text } = Typography;

interface Student {
  id: number;
  name: string;
  mssv: string;
  thesis: string;
  progress: number;
  lastReport: string;
  status: "active" | "pending" | "completed";
}

interface Thesis {
  id: number;
  title: string;
  description: string;
  major: string;
  maxStudents: number;
  requirements: string;
}

const mockStudents: Student[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    mssv: "20210001",
    thesis: "Xây dựng hệ thống quản lý thư viện",
    progress: 45,
    lastReport: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    name: "Trần Thị B",
    mssv: "20210002",
    thesis: "Ứng dụng AI trong nhận diện hình ảnh",
    progress: 30,
    lastReport: "2024-01-10",
    status: "active",
  },
];

const mockTheses: Thesis[] = [
  {
    id: 1,
    title: "Xây dựng hệ thống quản lý thư viện",
    description: "Nghiên cứu và xây dựng ứng dụng quản lý thư viện với React, Node.js và MongoDB",
    major: "Công nghệ thông tin",
    maxStudents: 2,
    requirements: "Có kiến thức về React và Node.js",
  },
];

const majorOptions = [
  { value: "Công nghệ thông tin", label: "Công nghệ thông tin" },
  { value: "Khoa học máy tính", label: "Khoa học máy tính" },
  { value: "Hệ thống thông tin", label: "Hệ thống thông tin" },
  { value: "Mạng máy tính", label: "Mạng máy tính" },
  { value: "Điện tử viễn thông", label: "Điện tử viễn thông" },
];

const getStatusTag = (status: Student["status"]) => {
  const map: Record<Student["status"], { color: string; label: string }> = {
    active: { color: "success", label: "Đang thực hiện" },
    pending: { color: "warning", label: "Chờ xác nhận" },
    completed: { color: "blue", label: "Hoàn thành" },
  };
  return map[status];
};

export default function TeacherSupervisionPage() {
  const [students] = useState<Student[]>(mockStudents);
  const [theses, setTheses] = useState<Thesis[]>(mockTheses);
  const [filter, setFilter] = useState<SegmentedValue>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCreateTopic = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const newThesis: Thesis = {
        id: Math.max(...theses.map((t) => t.id)) + 1,
        title: values.title,
        description: values.description,
        major: values.major,
        maxStudents: values.maxStudents,
        requirements: values.requirements || "",
      };
      setTheses([...theses, newThesis]);
      message.success("Tạo đề tài mới thành công!");
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const filteredStudents = students.filter((s) => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Title level={2} style={{ marginBottom: 4 }}>Hướng dẫn sinh viên</Title>
            <Text type="secondary">Quản lý và theo dõi sinh viên được phân công hướng dẫn</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTopic}>
            Tạo đề tài mới
          </Button>
        </div>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} lg={8}>
          <Card >
            <Space>
              <Tag color="success">{students.filter(s => s.status === "active").length}</Tag>
              <Text type="secondary">Đang thực hiện</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={12} lg={8}>
          <Card >
            <Space>
              <Tag color="warning">{students.filter(s => s.status === "pending").length}</Tag>
              <Text type="secondary">Chờ xác nhận</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={12} lg={8}>
          <Card >
            <Space>
              <Tag color="blue">{students.filter(s => s.status === "completed").length}</Tag>
              <Text type="secondary">Hoàn thành</Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Filter */}
      <Card style={{ marginBottom: 24 }}>
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { label: "Tất cả", value: "all" },
            { label: "Đang thực hiện", value: "active" },
            { label: "Chờ xác nhận", value: "pending" },
            { label: "Hoàn thành", value: "completed" },
          ]}
        />
      </Card>

      {/* Student Cards */}
      <Row gutter={[16, 16]}>
        {filteredStudents.map((student) => {
          const statusTag = getStatusTag(student.status);
          return (
            <Col xs={24} sm={12} lg={8} key={student.id}>
              <Card style={{ height: "100%" }}>
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Space>
                      <Avatar style={{ background: "#2a5bc0" }}>{student.name.charAt(0)}</Avatar>
                      <div>
                        <Text strong>{student.name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>{student.mssv}</Text>
                      </div>
                    </Space>
                    <Tag color={statusTag.color}>{statusTag.label}</Tag>
                  </div>

                  <Text type="secondary" style={{ fontSize: 13 }}>{student.thesis}</Text>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Tiến độ</Text>
                      <Text strong>{student.progress}%</Text>
                    </div>
                    <Progress percent={student.progress} size="small" />
                  </div>

                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Báo cáo cuối: {student.lastReport}
                  </Text>

                  <Space>
                    <Button size="small" icon={<EyeOutlined />}>
                      Chi tiết
                    </Button>
                    <Button size="small" icon={<MessageOutlined />} />
                  </Space>
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>

      {filteredStudents.length === 0 && (
        <Card >
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Text type="secondary">Không có sinh viên nào</Text>
          </div>
        </Card>
      )}

      {/* Create Topic Modal */}
      <Modal
        title="Tạo đề tài mới"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText="Tạo mới"
        cancelText="Hủy"
        width={560}
        transitionName=""
        maskTransitionName=""
        centered
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="title"
            label="Tên đề tài"
            rules={[{ required: true, message: "Vui lòng nhập tên đề tài" }]}
          >
            <Input placeholder="Nhập tên đề tài khóa luận" />
          </Form.Item>

          <Form.Item
            name="major"
            label="Chuyên ngành"
            rules={[{ required: true, message: "Vui lòng chọn chuyên ngành" }]}
          >
            <Select
              placeholder="Chọn chuyên ngành"
              options={majorOptions}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả đề tài"
            rules={[{ required: true, message: "Vui lòng nhập mô tả đề tài" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Mô tả chi tiết về đề tài, mục tiêu, công nghệ sử dụng..."
            />
          </Form.Item>

          <Form.Item
            name="maxStudents"
            label="Số sinh viên tối đa"
            rules={[{ required: true, message: "Vui lòng nhập số sinh viên" }]}
            initialValue={1}
          >
            <InputNumber min={1} max={5} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="requirements"
            label="Yêu cầu (không bắt buộc)"
          >
            <Input.TextArea
              rows={3}
              placeholder="Các yêu cầu về kiến thức, kỹ năng cho sinh viên đăng ký..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
