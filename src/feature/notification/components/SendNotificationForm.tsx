"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import apiClient from "@/shared/services/api-client";
import {
  Send,
  Save,
  X,
  Plus,
  FileText,
  Trash2,
  Bold,
  Italic,
  List,
  Link2,
  Code,
  Paperclip,
} from "lucide-react";

const SendNotificationSchema = z.object({
  priority: z.enum(["NORMAL", "DIRECTIVE", "URGENT", "REMINDER"]),
  title: z.string().min(1, "Tiêu đề không được để trống").max(255),
  message: z.string().min(1, "Nội dung không được để trống"),
  recipientIds: z.array(z.number()).min(1, "Chọn ít nhất 1 người nhận"),
  requireRead24h: z.boolean(),
  pinToTop: z.boolean(),
});

type SendNotificationFormData = z.infer<typeof SendNotificationSchema>;

interface Recipient {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface Department {
  id: string;
  name: string;
}

interface SendNotificationFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const PRIORITY_OPTIONS = [
  { value: "NORMAL", label: "Bình thường", icon: "●", color: "text-gray-400" },
  {
    value: "DIRECTIVE",
    label: "Chỉ thị BGH",
    icon: "◆",
    color: "text-purple-400",
  },
  {
    value: "URGENT",
    label: "⚡ Hỏa tốc",
    icon: "⚡",
    color: "text-red-500",
    animated: true,
  },
  {
    value: "REMINDER",
    label: "⏰ Nhắc hạn",
    icon: "⏰",
    color: "text-yellow-500",
  },
];

const SendNotificationForm: React.FC<SendNotificationFormProps> = ({
  onSuccess,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<SendNotificationFormData>({
    resolver: zodResolver(SendNotificationSchema),
    defaultValues: {
      priority: "URGENT",
      recipientIds: [],
      requireRead24h: true,
      pinToTop: false,
    },
  });

  const selectedPriority = watch("priority");
  const selectedIds = watch("recipientIds");
  const wordCount = (watch("message") || "").length;

  const [departments, setDepartments] = useState<Department[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    if (selectedDept) {
      loadRecipientsByDept(selectedDept);
    }
  }, [selectedDept]);

  const loadDepartments = async () => {
    setLoadingDepts(true);
    try {
      const data = await apiClient.get<{
        departments: Department[];
      }>("/notifications/compose/departments");
      setDepartments(data.departments || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách khoa/viện");
    } finally {
      setLoadingDepts(false);
    }
  };

  const loadRecipientsByDept = async (deptId: string) => {
    setLoadingRecipients(true);
    try {
      const data = await apiClient.get<{ users: Recipient[] }>(
        `/notifications/compose/departments/${deptId}/users`,
      );
      setRecipients(data.users || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách người dùng");
      setRecipients([]);
    } finally {
      setLoadingRecipients(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === recipients.length) {
      setValue("recipientIds", []);
    } else {
      setValue(
        "recipientIds",
        recipients.map((r) => r.id),
      );
    }
  };

  const handleToggleRecipient = (id: number) => {
    const current = selectedIds;
    if (current.includes(id)) {
      setValue(
        "recipientIds",
        current.filter((rid) => rid !== id),
      );
    } else {
      setValue("recipientIds", [...current, id]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(file.size);
    }
  };

  const onSubmit = async (
    data: SendNotificationFormData,
    saveDraft: boolean = false,
  ) => {
    try {
      const endpoint = saveDraft
        ? "/notifications/compose/send"
        : "/notifications/compose/send";

      await apiClient.post(endpoint, {
        ...data,
        saveDraft,
        fileName,
        fileSize: fileSize || undefined,
      });

      toast.success(
        saveDraft
          ? "Đã lưu thông báo vào bản nháp"
          : "Phát hành thông báo thành công",
      );
      reset();
      setFileName("");
      setFileSize(0);
      setSelectedDept("");
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Lỗi khi xử lý thông báo",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f1422] border border-[#1e293b] rounded-2xl w-full max-w-2xl shadow-2xl shadow-black/90 my-auto overflow-hidden ring-1 ring-white/5">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b]/70 bg-[#131b2c]/40 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-[#f1f5f9] tracking-tight">
                Soạn Thông Báo & Chỉ Đạo
              </h3>
              <p className="text-xs text-[#64748b] mt-0.5">
                Phát hành thông tri học thuật và điều hành toàn trường
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748b] hover:text-[#f1f5f9] hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit((data) => onSubmit(data, false))(e);
          }}
          className="p-6 space-y-4"
        >
          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">
              Mức độ ưu tiên
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRIORITY_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg border transition-all cursor-pointer ${
                    selectedPriority === option.value
                      ? option.value === "URGENT"
                        ? "border-red-500/50 bg-red-500/10 text-red-400"
                        : option.value === "DIRECTIVE"
                          ? "border-purple-500/40 bg-purple-500/10 text-purple-400"
                          : option.value === "REMINDER"
                            ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
                            : "border-sky-500/50 bg-sky-500/10 text-sky-400"
                      : "border-[#1e293b] bg-[#0f1523]/50 text-[#64748b] hover:bg-[#131b2c]"
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    {...register("priority")}
                    className="hidden"
                  />
                  <span className="text-xs">{option.icon}</span>
                  <span className="font-medium text-xs">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Target Audience & Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
            <div className="sm:col-span-4">
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">
                Đối tượng tiếp nhận
              </label>
              <div className="relative">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  disabled={loadingDepts}
                  className="w-full px-3 py-2 rounded-lg bg-[#0f1523] border border-[#1e293b] text-[#f1f5f9] text-xs focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/40 focus:outline-none transition-all disabled:opacity-50"
                >
                  <option value="">-- Chọn Khoa / Viện --</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipients List */}
              {selectedDept && (
                <div className="mt-2 p-2.5 rounded-lg border border-[#1e293b] bg-[#0f1523]/50 max-h-40 overflow-y-auto">
                  {loadingRecipients ? (
                    <p className="text-xs text-[#64748b]">Đang tải...</p>
                  ) : recipients.length === 0 ? (
                    <p className="text-xs text-[#64748b]">
                      Không có người dùng nào
                    </p>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 pb-1 border-b border-[#1e293b]">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === recipients.length}
                          onChange={handleSelectAll}
                          className="w-3.5 h-3.5 rounded bg-[#131b2c] border-[#1e293b] text-sky-500 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-xs text-[#94a3b8] font-medium">
                          Chọn tất cả ({recipients.length})
                        </span>
                      </div>
                      {recipients.map((recipient) => (
                        <label
                          key={recipient.id}
                          className="flex items-center gap-2 p-1.5 hover:bg-[#131b2c] rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(recipient.id)}
                            onChange={() => handleToggleRecipient(recipient.id)}
                            className="w-3.5 h-3.5 rounded bg-[#131b2c] border-[#1e293b] text-sky-500 focus:ring-0 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#f1f5f9]">
                              {recipient.name}
                            </p>
                            <p className="text-[10px] text-[#64748b] truncate">
                              {recipient.email}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Recipient Count */}
            <div className="sm:col-span-3 flex items-end">
              <div className="w-full p-2.5 rounded-lg bg-[#0f1523] border border-[#1e293b]">
                <p className="text-xs text-[#94a3b8] mb-1">Tiếp nhận</p>
                <p className="text-sm font-bold text-[#f1f5f9]">
                  {selectedIds.length}{" "}
                  <span className="text-xs text-[#64748b] font-normal">
                    người
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">
              Tiêu đề thông báo
            </label>
            <input
              type="text"
              {...register("title")}
              placeholder="Nhập tiêu đề thông báo hoặc chỉ đạo..."
              className="w-full bg-[#0f1523] border border-[#1e293b] focus:border-sky-500/60 rounded-lg px-3 py-2 text-xs text-[#f1f5f9] placeholder:text-[#64748b] focus:ring-1 focus:ring-sky-500/40 focus:outline-none transition-all"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-[#94a3b8]">
                Nội dung chỉ đạo & yêu cầu thực hiện
              </label>
              <span className="text-[10px] font-mono text-[#64748b]">
                {wordCount} ký tự
              </span>
            </div>
            <div className="rounded-lg border border-[#1e293b] bg-[#0f1523]/80 overflow-hidden focus-within:border-sky-500/60 focus-within:ring-1 focus-within:ring-sky-500/40 transition-all">
              {/* Toolbar */}
              <div className="flex items-center gap-0.5 px-2.5 py-1 border-b border-[#1e293b]/70 bg-[#131b2c]/40 text-[#64748b]">
                <button
                  type="button"
                  className="p-1 hover:text-[#f1f5f9] rounded hover:bg-[#0f1523] transition-colors"
                  title="Đậm"
                >
                  <Bold size={16} />
                </button>
                <button
                  type="button"
                  className="p-1 hover:text-[#f1f5f9] rounded hover:bg-[#0f1523] transition-colors"
                  title="Nghiêng"
                >
                  <Italic size={16} />
                </button>
                <button
                  type="button"
                  className="p-1 hover:text-[#f1f5f9] rounded hover:bg-[#0f1523] transition-colors"
                  title="Danh sách"
                >
                  <List size={16} />
                </button>
                <div className="w-px h-3 bg-[#1e293b] mx-1"></div>
                <button
                  type="button"
                  className="p-1 hover:text-[#f1f5f9] rounded hover:bg-[#0f1523] transition-colors"
                  title="Chèn liên kết"
                >
                  <Link2 size={16} />
                </button>
                <button
                  type="button"
                  className="p-1 hover:text-[#f1f5f9] rounded hover:bg-[#0f1523] transition-colors"
                  title="Mã code"
                >
                  <Code size={16} />
                </button>
              </div>
              <textarea
                {...register("message")}
                rows={4}
                placeholder="Nhập nội dung thông tri học thuật hoặc chỉ đạo chi tiết..."
                className="w-full bg-transparent px-3 py-2.5 text-xs text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none resize-none leading-relaxed"
              />
            </div>
            {errors.message && (
              <p className="mt-1 text-xs text-red-500">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* File Attachment */}
          {fileName && (
            <div className="p-2.5 rounded-lg border border-[#1e293b] bg-[#0f1523]/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-red-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#f1f5f9] truncate max-w-[200px]">
                    {fileName}
                  </p>
                  <p className="text-[10px] font-mono text-[#64748b]">
                    ({(fileSize / 1024 / 1024).toFixed(1)} MB)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFileName("");
                  setFileSize(0);
                }}
                className="text-[#64748b] hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Options */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-2.5 rounded-lg bg-[#0f1523]/50 border border-[#1e293b]">
            <label className="flex items-center gap-1.5 text-xs text-[#94a3b8] cursor-pointer hover:text-[#f1f5f9] transition-colors select-none">
              <input
                type="checkbox"
                {...register("requireRead24h")}
                className="w-3.5 h-3.5 rounded bg-[#131b2c] border-[#1e293b] text-sky-500 focus:ring-0 cursor-pointer"
              />
              <span>Xác nhận đọc 24h</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#94a3b8] cursor-pointer transition-colors select-none">
              <input
                type="checkbox"
                {...register("pinToTop")}
                className="w-3.5 h-3.5 rounded bg-[#131b2c] border-[#1e293b] text-sky-500 focus:ring-0 cursor-pointer"
              />
              <span>Ghim đầu trang</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#1e293b]/70">
            <button
              type="button"
              onClick={() => handleSubmit((data) => onSubmit(data, true))()}
              disabled={isSubmitting || isSavingDraft}
              className="px-3 py-1.5 rounded-lg border border-[#1e293b] hover:bg-[#131b2c] text-xs font-medium text-[#94a3b8] hover:text-[#f1f5f9] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save size={15} />
              <span>Lưu nháp</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border border-[#1e293b] hover:bg-[#131b2c] text-xs font-medium text-[#94a3b8] hover:text-[#f1f5f9] transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting || selectedIds.length === 0}
                className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-[#041a2e] text-xs font-semibold tracking-tight shadow-md shadow-sky-500/20 hover:shadow-sky-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={15} />
                <span>
                  {isSubmitting ? "Đang gửi..." : "Phát hành thông báo"}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendNotificationForm;
