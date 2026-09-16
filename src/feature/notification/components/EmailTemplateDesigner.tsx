"use client";

import React, { useState } from "react";
import { Copy, Trash2, Eye, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  footer?: string;
}

const EmailTemplateDesigner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: "1",
      name: "Default Template",
      subject: "Thông báo từ hệ thống",
      body: "<p>Nội dung thông báo</p>",
    },
  ]);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(
    null
  );

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;

    const exists = templates.find((t) => t.id === editingTemplate.id);
    if (exists) {
      setTemplates(
        templates.map((t) => (t.id === editingTemplate.id ? editingTemplate : t))
      );
    } else {
      setTemplates([...templates, { ...editingTemplate, id: Date.now().toString() }]);
    }

    toast.success("Template đã được lưu");
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
    toast.success("Template đã được xóa");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        <Plus className="w-4 h-4" />
        Template Email
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Quản lý Email Template</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editingTemplate ? (
              <div className="space-y-3 border rounded-lg p-4">
                <h4 className="font-semibold">Chỉnh sửa Template</h4>
                <input
                  type="text"
                  placeholder="Tên template"
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Chủ đề email"
                  value={editingTemplate.subject}
                  onChange={(e) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      subject: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <textarea
                  placeholder="Nội dung email (HTML)"
                  value={editingTemplate.body}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, body: e.target.value })
                  }
                  rows={5}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveTemplate}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                    Lưu
                  </button>
                  <button
                    onClick={() => setEditingTemplate(null)}
                    className="px-3 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div>
                      <p className="font-semibold">{template.name}</p>
                      <p className="text-sm text-gray-600">{template.subject}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTemplate(template)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(template.body);
                          toast.success("Sao chép thành công");
                        }}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EmailTemplateDesigner;
