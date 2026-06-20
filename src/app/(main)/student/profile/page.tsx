"use client";

import React from "react";
import { Row, Col, Card, Typography, Tag, Button, Avatar, Space } from "antd";

const { Title, Text } = Typography;

export default function StudentProfilePage() {
  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[0, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2} style={{ marginBottom: 8 }}>Hồ sơ cá nhân</Title>
          <Text type="secondary">Thông tin tài khoản sinh viên</Text>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card style={{ textAlign: "center" }}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Avatar
                size={100}
                style={{ background: "#1890ff", display: "inline-flex" }}
              >
                <Text style={{ fontSize: 36 }}>👤</Text>
              </Avatar>
              <Title level={4}>Nguyễn Văn Sinh Viên</Title>
              <Text type="secondary">MSSV: 20210001</Text>
              <br />
              <Text type="secondary">Khóa 2021</Text>
              <br />
              <Tag color="blue">Sinh viên</Tag>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card >
            <Title level={5} style={{ marginBottom: 16 }}>Thông tin cá nhân</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>Họ và tên</Text>
                <Text>Nguyễn Văn Sinh Viên</Text>
              </Col>
              <Col xs={24} sm={12}>
                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>Mã số sinh viên</Text>
                <Text>20210001</Text>
              </Col>
              <Col xs={24} sm={12}>
                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>Email</Text>
                <Text>sinhvien@example.edu.vn</Text>
              </Col>
              <Col xs={24} sm={12}>
                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>Số điện thoại</Text>
                <Text>0123456789</Text>
              </Col>
              <Col xs={24} sm={12}>
                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>Ngành</Text>
                <Text>Công nghệ thông tin</Text>
              </Col>
              <Col xs={24} sm={12}>
                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>Lớp</Text>
                <Text>CNTT21A</Text>
              </Col>
            </Row>
            <div style={{ borderTop: "1px solid #f0f0f0", marginTop: 16, paddingTop: 16 }}>
              <Button type="primary" icon="✏️">
                Chỉnh sửa hồ sơ
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
