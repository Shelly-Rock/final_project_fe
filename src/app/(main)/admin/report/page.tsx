"use client";

import React from "react";
import { Row, Col, Card, Button, Typography, Space } from "antd";
import {
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const reportTypes = [
  {
    key: "pdf",
    title: "Báo cáo PDF",
    description: "Xuất báo cáo tổng hợp dạng PDF",
    icon: <FilePdfOutlined style={{ fontSize: 32, color: "#d13b3b" }} />,
    color: "#fef2f2",
  },
  {
    key: "excel",
    title: "Báo cáo Excel",
    description: "Xuất dữ liệu dạng Excel",
    icon: <FileExcelOutlined style={{ fontSize: 32, color: "#1dab60" }} />,
    color: "#f0fdf4",
  },
  {
    key: "word",
    title: "Báo cáo Word",
    description: "Xuất báo cáo dạng Word",
    icon: <FileWordOutlined style={{ fontSize: 32, color: "#2a5bc0" }} />,
    color: "#eff6ff",
  },
];

export default function AdminReportPage() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>Báo cáo</Title>
        <Text type="secondary">Xuất báo cáo khóa luận</Text>
      </div>

      {/* Report Cards */}
      <Row gutter={[16, 16]}>
        {reportTypes.map((report) => (
          <Col xs={24} sm={12} lg={8} key={report.key}>
            <Card
              hoverable
              style={{ height: "100%" }}
              bodyStyle={{ textAlign: "center", padding: "40px 24px" }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 16,
                  background: report.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                {report.icon}
              </div>
              <Title level={5} style={{ marginBottom: 8 }}>{report.title}</Title>
              <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
                {report.description}
              </Text>
              <Button icon={<DownloadOutlined />}>
                Tải xuống
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
