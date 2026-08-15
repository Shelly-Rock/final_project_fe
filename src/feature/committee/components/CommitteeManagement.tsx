/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps, no-console, react/jsx-no-undef */
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
  TeamOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  committeeService,
  Committee,
  TeacherBasic,
  CommitteeStats,
} from "../services";

const { Title } = Typography;
const { Option } = Select;

export default function CommitteeManagement() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [teachers, setTeachers] = useState<TeacherBasic[]>([]);
  const [excludedTeacherIds, setExcludedTeacherIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [stats, setStats] = useState<CommitteeStats>({
    totalCommittees: 0,
    committeesWithFullMembers: 0,
    committeesMissingMembers: 0,
    totalExternalReviewers: 0,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState<Committee | null>(
    null,
  );
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const fetchCommittees = useCallback(async () => {
    setLoading(true);
    try {
      const result = await committeeService.getCommittees({
        page: pagination.current,
        limit: pagination.pageSize,
      });
      setCommittees(result.data);
      setPagination((prev) => ({ ...prev, total: result.total }));
    } catch {
      message.error("Không thể tải danh sách hội đồng");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize]);

  const fetchTeachers = useCallback(async () => {
    try {
      const result = await committeeService.getAvailableTeachers();
      setTeachers(result);
      const excluded = await committeeService.getExcludedTeachers();
      setExcludedTeacherIds(excluded);
    } catch {
      console.error("Error fetching teachers");
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const result = await committeeService.getStats();
      setStats(result);
    } catch {
      console.error("Error fetching stats");
    }
  }, []);

  useEffect(() => {
    fetchCommittees();
    fetchTeachers();
    fetchStats();
  }, [fetchCommittees, fetchTeachers, fetchStats]);

  const openCreateModal = () => {
    setEditingCommittee(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (committee: Committee) => {
    setEditingCommittee(committee);
    form.setFieldsValue({
      name: committee.name,
      chairmanId: committee.chairmanId,
      secretaryId: committee.secretaryId,
      internal1Id: committee.internal1Id,
      internal2Id: committee.internal2Id,
      externalReviewerIds: committee.externalReviewers.map((er) => er.id),
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (editingCommittee) {
        await committeeService.updateCommittee(editingCommittee.id, {
          name: values.name,
          chairmanId: values.chairmanId,
          secretaryId: values.secretaryId,
          internal1Id: values.internal1Id,
          internal2Id: values.internal2Id,
          externalReviewerIds: values.externalReviewerIds,
        });
        message.success("Cập nhật hội đồng thành công");
      } else {
        await committeeService.createCommittee({
          name: values.name,
          chairmanId: values.chairmanId,
          secretaryId: values.secretaryId,
          internal1Id: values.internal1Id,
          internal2Id: values.internal2Id,
          externalReviewerIds: values.externalReviewerIds,
        });
        message.success("Tạo hội đồng thành công");
      }

      setModalVisible(false);
      fetchCommittees();
      fetchTeachers();
      fetchStats();
    } catch (err) {
      message.error("Không thể lưu hội đồng");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await committeeService.deleteCommittee(id);
      message.success("Xóa hội đồng thành công");
      fetchCommittees();
      fetchStats();
    } catch (err) {
      message.error("Không thể xóa hội đồng");
    }
  };

  const availableTeachers = teachers.filter(
    (t) => !excludedTeacherIds.includes(t.id),
  );

  const renderMemberTag = (
    id: number | null,
    name: string | null,
    role: string,
  ) => {
    if (!id || !name) {
      return <Tag color="default">Chưa có</Tag>;
    }
    return (
      <Tag color="blue" style={{ marginBottom: 4 }}>
        <strong>{role}:</strong> {name}
      </Tag>
    );
  };

  const columns: ColumnsType<Committee> = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
    },
    {
      title: "Tên hội đồng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thành viên",
      key: "members",
      render: (_, record) => (
        <div>
          {renderMemberTag(record.chairmanId, record.chairmanName, "Chủ tịch")}
          {renderMemberTag(record.secretaryId, record.secretaryName, "Thư ký")}
          {renderMemberTag(
            record.internal1Id,
            record.internal1Name,
            "PB trong 1",
          )}
          {renderMemberTag(
            record.internal2Id,
            record.internal2Name,
            "PB trong 2",
          )}
          {record.externalReviewers.map((er) => (
            <Tag key={er.id} color="green" style={{ marginBottom: 4 }}>
              PB ngoài: {er.name}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Số thành viên",
      key: "memberCount",
      render: (_, record) => {
        let count = 0;
        if (record.chairmanId) count++;
        if (record.secretaryId) count++;
        if (record.internal1Id) count++;
        if (record.internal2Id) count++;
        count += record.externalReviewers.length;

        return (
          <Tag color={count >= 4 ? "green" : "orange"}>
            {count}/4+ thành viên
          </Tag>
        );
      },
      width: 130,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEditModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa hội đồng này?"
            description="Hành động này không thể hoàn tác."
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
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
          <TeamOutlined style={{ marginRight: 8 }} />
          Quản lý Hội đồng bảo vệ
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
        >
          Thêm Hội đồng
        </Button>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng hội đồng" value={stats.totalCommittees} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đủ thành viên"
              value={stats.committeesWithFullMembers}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Thiếu thành viên"
              value={stats.committeesMissingMembers}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="PB ngoài"
              value={stats.totalExternalReviewers}
              suffix="người"
            />
          </Card>
        </Col>
      </Row>

      <Alert
        type="info"
        showIcon
        message="Lưu ý"
        description="Giảng viên hướng dẫn tuyệt đối không được ngồi trong hội đồng chấm đề tài của mình. Phản biện ngoài có thể chấm ở nhiều hội đồng khác nhau."
        style={{ marginBottom: 16 }}
      />

      {/* Table */}
      <Table
        columns={columns}
        dataSource={committees}
        loading={loading}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} hội đồng`,
          onChange: (page, pageSize) =>
            setPagination({ ...pagination, current: page, pageSize }),
        }}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingCommittee ? "Sửa Hội đồng" : "Tạo Hội đồng mới"}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={submitting}
        width={700}
        okText="Lưu"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên hội đồng"
            rules={[{ required: true, message: "Vui lòng nhập tên hội đồng" }]}
          >
            <Input placeholder="VD: Hội đồng chấm luận văn KHDL 2026" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="chairmanId" label="Chủ tịch">
                <Select placeholder="Chọn chủ tịch" allowClear>
                  {availableTeachers.map((t) => (
                    <Option key={t.id} value={t.id}>
                      {t.name} ({t.teacherId})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="secretaryId" label="Thư ký">
                <Select placeholder="Chọn thư ký" allowClear>
                  {availableTeachers.map((t) => (
                    <Option key={t.id} value={t.id}>
                      {t.name} ({t.teacherId})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="internal1Id" label="Phản biện trong 1">
                <Select placeholder="Chọn phản biện trong 1" allowClear>
                  {availableTeachers.map((t) => (
                    <Option key={t.id} value={t.id}>
                      {t.name} ({t.teacherId})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="internal2Id" label="Phản biện trong 2">
                <Select placeholder="Chọn phản biện trong 2" allowClear>
                  {availableTeachers.map((t) => (
                    <Option key={t.id} value={t.id}>
                      {t.name} ({t.teacherId})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="externalReviewerIds"
            label="Phản biện ngoài (có thể chọn nhiều)"
          >
            <Select
              mode="multiple"
              placeholder="Chọn phản biện ngoài"
              allowClear
            >
              {teachers.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.name} ({t.teacherId}) - {t.department || "Không có khoa"}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Alert
            type="warning"
            message="Quy tắc thành viên"
            description="Thành viên cố định (Chủ tịch, Thư ký, Phản biện trong) chỉ được thuộc một hội đồng. Phản biện ngoài có thể thuộc nhiều hội đồng."
            style={{ marginTop: 8 }}
          />
        </Form>
      </Modal>
    </div>
  );
}
