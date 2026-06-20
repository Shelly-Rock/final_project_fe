"use client";

import React from "react";
import { Card, Typography, Row, Col, Button, Space, Tag, Progress, Avatar } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  BookOutlined,
  FileTextOutlined,
  WarningOutlined,
  TrophyOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const adminStats: StatCard[] = [
  { title: "Tổng đề tài", value: 45, icon: <BookOutlined />, color: "#1677ff" },
  { title: "Đang thực hiện", value: 28, icon: <ClockCircleOutlined />, color: "#faad14" },
  { title: "Đã hoàn thành", value: 15, icon: <CheckCircleOutlined />, color: "#52c41a" },
  { title: "Chờ duyệt", value: 8, icon: <WarningOutlined />, color: "#ff4d4f" },
];

const pendingTheses = [
  { id: 1, title: "Xây dựng app quản lý thư viện", student: "Nguyễn Văn A", status: "pending" },
  { id: 2, title: "Ứng dụng AI trong y tế", student: "Trần Thị B", status: "pending" },
  { id: 3, title: "Hệ thống IoT smart home", student: "Lê Văn C", status: "pending" },
];

const unregisteredStudents = [
  { id: 1, name: "Phạm Thị D", class: "CNTT2022-01" },
  { id: 2, name: "Hoàng Văn E", class: "CNTT2022-02" },
  { id: 3, name: "Ngô Thị F", class: "KHMT2022-01" },
];

interface DashboardProps {
  role?: "admin" | "secretary" | "teacher" | "student";
}

export default function DashboardPage({ role = "admin" }: DashboardProps) {
  const renderAdminDashboard = () => (
    <>
      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {adminStats.map((stat, index) => (
          <Col key={index} xs={24} sm={12} md={6}>
            <Card>
              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <Space>
                  <Avatar
                    style={{ backgroundColor: stat.color }}
                    size="large"
                    icon={stat.icon}
                  />
                  <Space direction="vertical" size={0}>
                    <Title level={2} style={{ margin: 0 }}>{stat.value}</Title>
                    <Text type="secondary">{stat.title}</Text>
                  </Space>
                </Space>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pending Theses */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ color: "#faad14" }} />
                <span>Đề tài chờ duyệt</span>
              </Space>
            }
            extra={<Button type="link">Xem tất cả</Button>}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {pendingTheses.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Space direction="horizontal" size="middle">
                    <Avatar style={{ backgroundColor: "#1677ff" }} icon={<BookOutlined />} />
                    <div>
                      <Text strong style={{ display: "block" }}>{item.title}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>Sinh viên: {item.student}</Text>
                    </div>
                  </Space>
                  <Button type="link" size="small">Duyệt</Button>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <TeamOutlined style={{ color: "#ff4d4f" }} />
                <span>Sinh viên chưa đăng ký</span>
              </Space>
            }
            extra={<Button type="link">Xem tất cả</Button>}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {unregisteredStudents.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Space direction="horizontal" size="middle">
                    <Avatar style={{ backgroundColor: "#52c41a" }}>{item.name.charAt(0)}</Avatar>
                    <div>
                      <Text strong style={{ display: "block" }}>{item.name}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>Lớp: {item.class}</Text>
                    </div>
                  </Space>
                  <Button type="link" size="small">Liên hệ</Button>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col span={24}>
          <Card title="Hoạt động gần đây">
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {[
                { id: 1, action: "Nguyễn Văn A nộp báo cáo tuần 5", time: "2 giờ trước", icon: <FileTextOutlined style={{ color: "#1677ff" }} /> },
                { id: 2, action: "Trần Thị B duyệt đề tài mới", time: "5 giờ trước", icon: <CheckCircleOutlined style={{ color: "#52c41a" }} /> },
                { id: 3, action: "Hội đồng bảo vệ thứ 2 họp ngày mai", time: "1 ngày trước", icon: <CalendarOutlined style={{ color: "#faad14" }} /> },
              ].map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center" }}>
                  <Avatar style={{ marginRight: 12 }}>{item.icon}</Avatar>
                  <div style={{ flex: 1 }}>
                    <Text style={{ display: "block" }}>{item.action}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderTeacherDashboard = () => (
    <>
      {/* Teacher Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Title level={2} style={{ margin: 0 }}>5</Title>
            <Text type="secondary">Sinh viên đang hướng dẫn</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Title level={2} style={{ margin: 0 }}>8</Title>
            <Text type="secondary">Đề tài đã đề xuất</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Title level={2} style={{ margin: 0 }}>3</Title>
            <Text type="secondary">Đề tài đang chờ duyệt</Text>
          </Card>
        </Col>
      </Row>

      {/* My Students */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card
            title="Sinh viên của tôi"
            extra={<Button type="link">Xem tất cả</Button>}
          >
            <Row gutter={[16, 16]}>
              {[
                { name: "Nguyễn Văn A", topic: "App quản lý thư viện", progress: 65 },
                { name: "Trần Thị B", topic: "AI trong y tế", progress: 45 },
                { name: "Lê Văn C", topic: "IoT smart home", progress: 80 },
              ].map((student, index) => (
                <Col key={index} xs={24} md={8}>
                  <Card size="small">
                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                      <Space>
                        <Avatar style={{ backgroundColor: "#1677ff" }}>
                          {student.name.charAt(0)}
                        </Avatar>
                        <Text strong>{student.name}</Text>
                      </Space>
                      <Text type="secondary" style={{ fontSize: 12 }}>{student.topic}</Text>
                      <Progress percent={student.progress} size="small" />
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderStudentDashboard = () => (
    <>
      {/* Student Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Title level={2} style={{ margin: 0 }}>60%</Title>
            <Text type="secondary">Tiến độ khóa luận</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Title level={2} style={{ margin: 0, color: "#faad14" }}>Đang thực hiện</Title>
            <Text type="secondary">Trạng thái</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Title level={2} style={{ margin: 0, color: "#52c41a" }}>8.5</Title>
            <Text type="secondary">Điểm quá trình</Text>
          </Card>
        </Col>
      </Row>

      {/* Current Thesis */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <BookOutlined />
                <span>Đề tài của tôi</span>
              </Space>
            }
            extra={<Button type="primary">Nộp báo cáo</Button>}
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} md={16}>
                <Title level={4}>Xây dựng ứng dụng quản lý thư viện sử dụng React và Node.js</Title>
                <Text type="secondary">Giảng viên hướng dẫn: TS. Nguyễn Văn A</Text>
                <br /><br />
                <Text>
                  Mô tả: Nghiên cứu và xây dựng ứng dụng quản lý thư viện với React, Node.js và MongoDB.
                  Ứng dụng bao gồm các chức năng: quản lý sách, quản lý mượn trả, thống kê báo cáo.
                </Text>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" style={{ backgroundColor: "#fafafa" }}>
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Tiến độ chung</Text>
                      <Progress percent={60} status="active" />
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Hạn nộp</Text>
                      <br />
                      <Tag color="orange"><ClockCircleOutlined /> 15/05/2024</Tag>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Upcoming Deadlines */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <CalendarOutlined style={{ color: "#ff4d4f" }} />
                <span>Công việc sắp tới</span>
              </Space>
            }
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {[
                { id: 1, title: "Nộp báo cáo tuần 5", deadline: "2024-05-10" },
                { id: 2, title: "Hoàn thành module mượn trả", deadline: "2024-05-15" },
                { id: 3, title: "Viết báo cáo giữa kỳ", deadline: "2024-05-20" },
              ].map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Space direction="horizontal" size="middle">
                    <Avatar style={{ backgroundColor: "#faad14" }} icon={<FileTextOutlined />} />
                    <Text>{item.title}</Text>
                  </Space>
                  <Tag color="orange">{item.deadline}</Tag>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderSecretaryDashboard = () => (
    <>
      {/* Secretary Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Title level={2} style={{ margin: 0 }}>12</Title>
            <Text type="secondary">Đề tài chờ duyệt</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Title level={2} style={{ margin: 0 }}>5</Title>
            <Text type="secondary">Hội đồng bảo vệ</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Title level={2} style={{ margin: 0 }}>3</Title>
            <Text type="secondary">Khoa</Text>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card
            title="Phê duyệt đề tài"
            extra={<Button type="primary" icon={<CheckCircleOutlined />}>Duyệt đề tài</Button>}
          >
            <Text type="secondary">
              Duyệt và quản lý đề tài từ giảng viên
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Pending Approvals */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="Đề tài chờ phê duyệt"
            extra={<Button type="link">Xem tất cả</Button>}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {pendingTheses.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Space direction="horizontal" size="middle">
                    <Avatar style={{ backgroundColor: "#1677ff" }} icon={<BookOutlined />} />
                    <div>
                      <Text strong style={{ display: "block" }}>{item.title}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>Sinh viên: {item.student}</Text>
                    </div>
                  </Space>
                  <Space>
                    <Button type="primary" size="small">Duyệt</Button>
                    <Button danger size="small">Từ chối</Button>
                  </Space>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );

  return (
    <div style={{ padding: "24px" }}>
      {/* Page Header */}
      <Title level={2} style={{ marginBottom: 8 }}>Dashboard</Title>
      <Text type="secondary">Tổng quan hệ thống quản lý khóa luận tốt nghiệp</Text>

      {/* Dashboard Content based on role */}
      {role === "admin" && renderAdminDashboard()}
      {role === "teacher" && renderTeacherDashboard()}
      {role === "student" && renderStudentDashboard()}
      {role === "secretary" && renderSecretaryDashboard()}
    </div>
  );
}
