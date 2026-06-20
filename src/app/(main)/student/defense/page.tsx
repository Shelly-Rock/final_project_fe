"use client";

import React from "react";
import { Row, Col, Card, Typography, Empty, Space } from "antd";

const { Title, Text } = Typography;

export default function StudentDefensePage() {
  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[0, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2} style={{ marginBottom: 8 }}>Lịch bảo vệ</Title>
          <Text type="secondary">Xem lịch và thông tin bảo vệ khóa luận</Text>
        </Col>
      </Row>

      {/* Defense Schedule */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card style={{ marginBottom: 16 }}>
            <Title level={5} style={{ marginBottom: 0 }}>Lịch bảo vệ</Title>
          </Card>
          <Card >
            <Empty
              description={
                <Space direction="vertical" size={0}>
                  <Text>Chưa có lịch bảo vệ</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>Vui lòng chờ thông báo từ khoa</Text>
                </Space>
              }
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {/* Defense Info */}
          <Card style={{ marginBottom: 16 }}>
            <Title level={5} style={{ marginBottom: 0 }}>Thông tin bảo vệ</Title>
          </Card>
          <Card style={{ marginBottom: 16 }}>
            <Empty description="Thông tin sẽ được cập nhật khi có lịch" />
          </Card>

          {/* Council Info */}
          <Card >
            <Title level={5} style={{ marginBottom: 0 }}>Hội đồng bảo vệ</Title>
          </Card>
          <Card style={{ marginTop: 16 }}>
            <Empty description="Chưa có thông tin hội đồng" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
