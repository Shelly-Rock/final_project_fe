"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Trash2,
  Plus,
  Copy,
  Edit2,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface NotificationTemplate {
  id: string;
  name: string;
  type: "URGENT" | "DIRECTIVE" | "GENERAL" | "REMINDER";
  recipientRole: string;
  title: string;
  message: string;
  createdAt: string;
}

interface NotificationTemplatesProps {
  onUseTemplate?: (template: NotificationTemplate) => void;
}

const NotificationTemplates: React.FC<NotificationTemplatesProps> = ({
  onUseTemplate,
}) => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "GENERAL" as const,
    recipientRole: "ALL",
    title: "",
    message: "",
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const stored = localStorage.getItem("notificationTemplates");
    if (stored) {
      try {
        setTemplates(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to load templates");
      }
    }
  };

  const saveTemplate = () => {
    if (!formData.name || !formData.title || !formData.message) {
      toast.error("Điền đầy đủ thông tin");
      return;
    }

    if (editingId) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? {
                ...t,
                ...formData,
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      );
      toast.success("Đã cập nhật template");
      setEditingId(null);
    } else {
      const newTemplate: NotificationTemplate = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      setTemplates((prev) => [newTemplate, ...prev]);
      toast.success("Đã lưu template");
    }

    setFormData({
      name: "",
      type: "GENERAL",
      recipientRole: "ALL",
      title: "",
      message: "",
    });
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast.success("Đã xóa template");
  };

  const editTemplate = (template: NotificationTemplate) => {
    setFormData({
      name: template.name,
      type: template.type as any,
      recipientRole: template.recipientRole,
      title: template.title,
      message: template.message,
    });
    setEditingId(template.id);
    setIsOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">
          Mẫu Thông báo ({templates.length})
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary hover:bg-sky-400 text-on-primary text-xs font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tạo mẫu
        </button>
      </div>

      {isOpen && (
        <div className="border border-border-subtle rounded-lg p-4 bg-surface-subtle space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-secondary">
              {editingId ? "Sửa mẫu" : "Tạo mẫu mới"}
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                setEditingId(null);
                setFormData({
                  name: "",
                  type: "GENERAL",
                  recipientRole: "ALL",
                  title: "",
                  message: "",
                });
              }}
              className="p-1 hover:bg-surface-card rounded transition-colors"
            >
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Tên mẫu"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full bg-surface-card border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary/60 focus:outline-none transition-colors"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as typeof formData.type,
                })
              }
              className="bg-surface-card border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary focus:border-primary/60 focus:outline-none transition-colors"
            >
              <option value="GENERAL">Thông thường</option>
              <option value="URGENT">Hỏa tốc</option>
              <option value="DIRECTIVE">Chỉ thị</option>
              <option value="REMINDER">Nhắc hạn</option>
            </select>

            <select
              value={formData.recipientRole}
              onChange={(e) =>
                setFormData({ ...formData, recipientRole: e.target.value })
              }
              className="bg-surface-card border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary focus:border-primary/60 focus:outline-none transition-colors"
            >
              <option value="ALL">Toàn trường</option>
              <option value="HEADS">Trưởng đơn vị</option>
              <option value="TEACHERS">Giảng viên</option>
              <option value="STUDENTS">Sinh viên</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Tiêu đề"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full bg-surface-card border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary/60 focus:outline-none transition-colors"
          />

          <textarea
            placeholder="Nội dung"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            rows={3}
            className="w-full bg-surface-card border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary/60 focus:outline-none resize-none transition-colors"
          />

          <button
            onClick={saveTemplate}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary hover:bg-sky-400 text-on-primary text-xs font-semibold transition-colors"
          >
            <Save className="w-4 h-4" />
            Lưu mẫu
          </button>
        </div>
      )}

      <div className="space-y-2">
        {templates.length === 0 ? (
          <p className="text-xs text-text-muted text-center py-4">
            Chưa có mẫu nào
          </p>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-surface-subtle border border-border-subtle hover:border-border-light transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-text-primary truncate">
                    {template.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-xs font-medium text-primary bg-primary/10 border border-primary/20 shrink-0">
                    {template.type === "URGENT" && "Hỏa tốc"}
                    {template.type === "DIRECTIVE" && "Chỉ thị"}
                    {template.type === "GENERAL" && "Thường"}
                    {template.type === "REMINDER" && "Nhắc"}
                  </span>
                </div>
                <p className="text-xs text-text-secondary line-clamp-2">
                  {template.title}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    if (onUseTemplate) {
                      onUseTemplate(template);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-surface-card text-text-muted hover:text-primary transition-colors"
                  title="Sử dụng"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editTemplate(template)}
                  className="p-1.5 rounded-lg hover:bg-surface-card text-text-muted hover:text-primary transition-colors"
                  title="Sửa"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="p-1.5 rounded-lg hover:bg-surface-card text-text-muted hover:text-error transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationTemplates;
