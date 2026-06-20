"use client";

import React from "react";
import { Card, Typography, Empty } from "antd";
import { TeamOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function SecretaryReviewAssignPage() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>Phân công phản biện</Title>
        <Text type="secondary">Phân công giảng viên phản biện cho các đề tài</Text>
      </div>

      {/* Content */}
      <Card >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <Text type="secondary">Danh sách phân công phản biện</Text>
            </div>
          }
        />
      </Card>
    </div>
  );
}
