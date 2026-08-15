/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Upload,
  Button,
  message,
  Alert,
  Space,
  Typography,
  Descriptions,
  Result,
} from "antd";
import {
  InboxOutlined,
  UploadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { submissionService } from "../services";

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface StudentSubmissionProps {
  studentId: number;
  projectId: number;
  projectCode: string;
  projectName: string;
}

export default function StudentSubmission({
  studentId,
  projectId,
  projectCode,
  projectName,
}: StudentSubmissionProps) {
  const [file, setFile] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkEligibility = useCallback(async () => {
    setChecking(true);
    try {
      const eligibleStudents = await submissionService.getEligibleStudents();
      const isEligible = eligibleStudents.some((s) => s.id === studentId);
      setEligible(isEligible);
    } catch {
      setEligible(true);
    } finally {
      setChecking(false);
    }
  }, [studentId]);

  useEffect(() => {
    checkEligibility();
  }, [checkEligibility]);

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: ".pdf,.docx,.pptx",
    beforeUpload: (uploadFile) => {
      const fileName = uploadFile.name;
      const expectedPrefix = `[${projectCode}]`;

      if (!fileName.startsWith(expectedPrefix)) {
        message.error(
          `Tên file phải bắt đầu bằng "${expectedPrefix}" (VD: ${projectCode}.PDF)`,
        );
        return Upload.LIST_IGNORE;
      }

      const extension = fileName.split(".").pop()?.toUpperCase();
      if (!["PDF", "DOCX", "PPTX"].includes(extension || "")) {
        message.error(
          "Chỉ chấp nhận file PDF, Word (.docx), PowerPoint (.pptx)",
        );
        return Upload.LIST_IGNORE;
      }

      setFile(uploadFile);
      return false;
    },
    onRemove: () => {
      setFile(null);
    },
  };

  const handleSubmit = async () => {
    if (!file) {
      message.error("Vui lòng chọn file để nộp");
      return;
    }

    setSubmitting(true);
    try {
      const fileUrl = `/uploads/${file.name}`;
      await submissionService.createSubmission({
        studentId,
        projectId,
        fileUrl,
        fileName: file.name,
        originalName: file.name,
        fileSize: file.size || 0,
        fileType: getFileType(file.name),
      });
      setSubmitted(true);
      message.success("Nộp bài thành công!");
    } catch (err) {
      message.error("Không thể nộp bài");
    } finally {
      setSubmitting(false);
    }
  };

  const getFileType = (fileName: string): "PDF" | "WORD" | "POWERPOINT" => {
    const ext = fileName.split(".").pop()?.toUpperCase();
    if (ext === "PDF") return "PDF";
    if (ext === "DOCX" || ext === "DOC") return "WORD";
    return "POWERPOINT";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (checking) {
    return (
      <Card loading style={{ maxWidth: 600, margin: "0 auto" }}>
        Đang kiểm tra...
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card style={{ maxWidth: 600, margin: "0 auto" }}>
        <Result
          icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
          title="Nộp bài thành công!"
          subTitle="Bài nộp của bạn đang chờ được duyệt."
        />
      </Card>
    );
  }

  return (
    <Card style={{ maxWidth: 600, margin: "0 auto" }}>
      <Title level={4}>Nộp bài cuối kỳ</Title>

      {!eligible && (
        <Alert
          type="warning"
          message="Chưa đủ điều kiện"
          description="Bạn cần hoàn thành tất cả báo cáo tiến độ và không bị cấm thi để có thể nộp bài."
          style={{ marginBottom: 16 }}
        />
      )}

      <Descriptions
        column={1}
        bordered
        size="small"
        style={{ marginBottom: 24 }}
      >
        <Descriptions.Item label="Mã đề tài">
          <Text strong>{projectCode}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Tên đề tài">{projectName}</Descriptions.Item>
        <Descriptions.Item label="Quy cách file">
          [{projectCode}].PDF hoặc .DOCX hoặc .PPTX
        </Descriptions.Item>
      </Descriptions>

      <Dragger {...uploadProps} style={{ marginBottom: 16 }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Kéo thả file vào đây hoặc click để chọn
        </p>
        <p className="ant-upload-hint">
          Chỉ chấp nhận file PDF, Word (.docx), PowerPoint (.pptx)
        </p>
        <p
          className="ant-upload-hint"
          style={{ color: "#1890ff", fontWeight: 500 }}
        >
          Tên file phải theo định dạng: [{projectCode}].PDF
        </p>
      </Dragger>

      {file && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>File đã chọn: </Text>
          <Text>{file.name}</Text>
          <br />
          <Text type="secondary">
            Kích thước: {formatFileSize(file.size || 0)}
          </Text>
        </div>
      )}

      <Space>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={handleSubmit}
          loading={submitting}
          disabled={!file || !eligible}
        >
          Nộp bài
        </Button>
      </Space>
    </Card>
  );
}
