"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import apiClient from "@/shared/services/api-client";
import {
  Bell,
  X,
  List,
  Building2,
  Zap,
  CalendarClock,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link2,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  ImagePlus,
  Table2,
  Undo2,
  Redo2,
  Eye,
  Users,
  Save,
  ChevronRight,
  ChevronDown,
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

const PRIORITY_OPTIONS: Array<{
  value: SendNotificationFormData["priority"];
  label: string;
  icon: React.ReactNode;
  activeClass: string;
}> = [
  {
    value: "NORMAL",
    label: "Bình thường",
    icon: <List size={14} />,
    activeClass:
      "border-sky-500/60 bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30",
  },
  {
    value: "DIRECTIVE",
    label: "Chỉ thị BGH",
    icon: <Building2 size={14} />,
    activeClass:
      "border-violet-500/50 bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/25",
  },
  {
    value: "URGENT",
    label: "Hỏa tốc",
    icon: <Zap size={14} className="fill-red-400 text-red-400" />,
    activeClass:
      "border-red-500/50 bg-red-500/10 text-red-300 ring-1 ring-red-500/25",
  },
  {
    value: "REMINDER",
    label: "Nhắc hạn",
    icon: <CalendarClock size={14} className="text-amber-400" />,
    activeClass:
      "border-amber-500/40 bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20",
  },
];

const PRIORITY_BADGE: Record<
  SendNotificationFormData["priority"],
  { label: string; className: string }
> = {
  NORMAL: {
    label: "Bình thường",
    className: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  },
  DIRECTIVE: {
    label: "Chỉ thị BGH",
    className: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  },
  URGENT: {
    label: "Hỏa tốc",
    className: "bg-red-500/15 text-red-300 border-red-500/30",
  },
  REMINDER: {
    label: "Nhắc hạn",
    className: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
};

const fieldLabelStyle: React.CSSProperties = {
  display: "block",
  position: "static",
  transform: "none",
  margin: "0 0 8px",
  padding: 0,
  fontSize: 13,
  fontWeight: 600,
  lineHeight: "20px",
  color: "#e8f0fa",
  letterSpacing: 0.1,
};

const SendNotificationForm: React.FC<SendNotificationFormProps> = ({
  onSuccess,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<SendNotificationFormData>({
    resolver: zodResolver(SendNotificationSchema),
    defaultValues: {
      priority: "NORMAL",
      recipientIds: [],
      requireRead24h: true,
      pinToTop: false,
    },
  });

  const selectedPriority = watch("priority");
  const selectedIds = watch("recipientIds");
  const titleVal = watch("title") || "";
  const messageVal = watch("message") || "";

  const [departments, setDepartments] = useState<Department[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [deptOpen, setDeptOpen] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    if (selectedDept) loadRecipientsByDept(selectedDept);
    else setRecipients([]);
  }, [selectedDept]);

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const loadDepartments = async () => {
    setLoadingDepts(true);
    try {
      const data = await apiClient.get<{ departments: Department[] }>(
        "/notifications/compose/departments",
      );
      setDepartments(data.departments || []);
    } catch {
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
    } catch {
      toast.error("Lỗi khi tải danh sách người dùng");
      setRecipients([]);
    } finally {
      setLoadingRecipients(false);
    }
  };

  const handleToggleRecipient = (id: number) => {
    const cur = selectedIds;
    if (cur.includes(id))
      setValue(
        "recipientIds",
        cur.filter((v) => v !== id),
      );
    else setValue("recipientIds", [...cur, id]);
  };

  const onSubmit = async (
    data: SendNotificationFormData,
    saveDraft = false,
  ) => {
    try {
      await apiClient.post("/notifications/compose/send", {
        ...data,
        saveDraft,
        fileName,
        fileSize: fileSize || undefined,
      });
      toast.success(
        saveDraft ? "Đã lưu nháp" : "Phát hành thông báo thành công",
      );
      reset();
      setFileName("");
      setFileSize(0);
      setSelectedDept("");
      onSuccess?.();
      if (saveDraft) onClose?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Lỗi khi xử lý thông báo",
      );
    }
  };

  const selectedDeptName =
    departments.find((d) => d.id === selectedDept)?.name || "Chọn Khoa / Viện";
  const priorityBadge = PRIORITY_BADGE[selectedPriority];

  const dialog = (
    <div
      className="fixed inset-0 z-[1400] flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(8, 16, 32, 0.28)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="compose-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="w-full overflow-hidden flex flex-col"
        style={{
          maxWidth: 1000,
          maxHeight: "86vh",
          background: "#0f1c33",
          border: "1px solid rgba(30, 58, 95, 0.7)",
          borderRadius: 16,
          boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid rgba(30, 58, 95, 0.45)",
          }}
        >
          <div className="flex items-center" style={{ gap: 12 }}>
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "#1a5fb4",
              }}
            >
              <Bell size={18} className="text-white" />
            </div>
            <div>
              <h2
                id="compose-title"
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: "24px",
                }}
              >
                Soạn thông báo
              </h2>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: 12,
                  color: "#7aa0c7",
                  lineHeight: "18px",
                }}
              >
                Phát hành thông tin học thuật và điều hành toàn trường
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: "#7aa0c7",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div
          className="flex-1 min-h-0"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 340px",
          }}
        >
          <form
            id="compose-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit((d) => onSubmit(d, false))(e);
            }}
            className="overflow-y-auto"
            style={{
              padding: "22px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            {/* Priority */}
            <div>
              <div style={fieldLabelStyle}>
                Mức độ ưu tiên <span style={{ color: "#f87171" }}>*</span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 8,
                }}
              >
                {PRIORITY_OPTIONS.map((opt) => {
                  const active = selectedPriority === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-center cursor-pointer select-none ${
                        active
                          ? opt.activeClass
                          : "border-[#1e3a5f]/60 bg-[#0b1e3a]/80 text-[#7aa0c7]"
                      }`}
                      style={{
                        gap: 8,
                        height: 44,
                        padding: "0 10px",
                        borderRadius: 12,
                        borderWidth: 1,
                        borderStyle: "solid",
                        fontSize: 12,
                        fontWeight: 600,
                        position: "static",
                        transform: "none",
                        margin: 0,
                      }}
                    >
                      <input
                        type="radio"
                        value={opt.value}
                        {...register("priority")}
                        className="sr-only"
                      />
                      <span
                        className={`flex items-center justify-center shrink-0 ${
                          active ? "border-current" : "border-[#2a4a73]"
                        }`}
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 999,
                          borderWidth: 1.5,
                          borderStyle: "solid",
                        }}
                      >
                        {active && (
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: 999,
                              background: "currentColor",
                            }}
                          />
                        )}
                      </span>
                      <span className="shrink-0">{opt.icon}</span>
                      <span className="truncate">{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Recipients */}
            <div>
              <div style={fieldLabelStyle}>
                Đối tượng nhận thông báo{" "}
                <span style={{ color: "#f87171" }}>*</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div className="relative" style={{ flex: 1 }}>
                  <button
                    type="button"
                    onClick={() => setDeptOpen((v) => !v)}
                    disabled={loadingDepts}
                    className="w-full flex items-center justify-between cursor-pointer disabled:opacity-50"
                    style={{
                      height: 44,
                      padding: "0 12px",
                      borderRadius: 12,
                      background: "#0b1e3a",
                      border: "1px solid rgba(30, 58, 95, 0.7)",
                      color: "#fff",
                      fontSize: 14,
                      textAlign: "left",
                    }}
                  >
                    <span
                      className="flex items-center min-w-0"
                      style={{ gap: 8 }}
                    >
                      <Users
                        size={15}
                        style={{ color: "#7aa0c7", flexShrink: 0 }}
                      />
                      <span
                        className="truncate"
                        style={{ color: selectedDept ? "#fff" : "#7aa0c7" }}
                      >
                        {loadingDepts ? "Đang tải..." : selectedDeptName}
                      </span>
                    </span>
                    <ChevronDown
                      size={16}
                      style={{
                        color: "#7aa0c7",
                        flexShrink: 0,
                        transform: deptOpen ? "rotate(180deg)" : undefined,
                      }}
                    />
                  </button>
                  {deptOpen && (
                    <div
                      className="absolute z-20 overflow-hidden overflow-y-auto"
                      style={{
                        marginTop: 6,
                        width: "100%",
                        maxHeight: 220,
                        borderRadius: 12,
                        border: "1px solid #1e3a5f",
                        background: "#0b1e3a",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDept("");
                          setDeptOpen(false);
                          setValue("recipientIds", []);
                        }}
                        className="w-full text-left cursor-pointer"
                        style={{
                          padding: "10px 12px",
                          fontSize: 13,
                          background: !selectedDept
                            ? "rgba(255,255,255,0.05)"
                            : "transparent",
                          color: !selectedDept ? "#7dd3fc" : "#cbd9ec",
                          border: "none",
                        }}
                      >
                        Chọn Khoa / Viện
                      </button>
                      {departments.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => {
                            setSelectedDept(d.id);
                            setDeptOpen(false);
                            setValue("recipientIds", []);
                          }}
                          className="w-full text-left truncate cursor-pointer"
                          style={{
                            padding: "10px 12px",
                            fontSize: 13,
                            background:
                              selectedDept === d.id
                                ? "rgba(255,255,255,0.05)"
                                : "transparent",
                            color:
                              selectedDept === d.id ? "#7dd3fc" : "#cbd9ec",
                            border: "none",
                          }}
                        >
                          {d.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div
                  className="flex items-center shrink-0"
                  style={{
                    height: 44,
                    padding: "0 14px",
                    gap: 6,
                    borderRadius: 12,
                    background: "#0b1e3a",
                    border: "1px solid rgba(30, 58, 95, 0.7)",
                    color: "#7aa0c7",
                    fontSize: 12,
                    whiteSpace: "nowrap",
                  }}
                >
                  <Users size={13} />
                  Đã chọn: {selectedIds.length}
                </div>
              </div>
              {selectedDept && (
                <div
                  className="overflow-y-auto"
                  style={{
                    marginTop: 8,
                    maxHeight: 148,
                    borderRadius: 12,
                    border: "1px solid rgba(30, 58, 95, 0.55)",
                    background: "rgba(11, 30, 58, 0.7)",
                    padding: 8,
                  }}
                >
                  {loadingRecipients ? (
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "#7aa0c7",
                        padding: 4,
                      }}
                    >
                      Đang tải...
                    </p>
                  ) : recipients.length === 0 ? (
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "#7aa0c7",
                        padding: 4,
                      }}
                    >
                      Không có người dùng
                    </p>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <label
                        className="flex items-center cursor-pointer"
                        style={{
                          gap: 8,
                          padding: "6px 6px",
                          position: "static",
                          transform: "none",
                          margin: 0,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={
                            recipients.length > 0 &&
                            selectedIds.length === recipients.length
                          }
                          onChange={() => {
                            if (selectedIds.length === recipients.length)
                              setValue("recipientIds", []);
                            else
                              setValue(
                                "recipientIds",
                                recipients.map((r) => r.id),
                              );
                          }}
                        />
                        <span style={{ fontSize: 12, color: "#a8c1e0" }}>
                          Chọn tất cả ({recipients.length})
                        </span>
                      </label>
                      {recipients.map((r) => (
                        <label
                          key={r.id}
                          className="flex items-center cursor-pointer"
                          style={{
                            gap: 8,
                            padding: "6px 6px",
                            position: "static",
                            transform: "none",
                            margin: 0,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(r.id)}
                            onChange={() => handleToggleRecipient(r.id)}
                          />
                          <span className="flex-1 min-w-0">
                            <span
                              className="block truncate"
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#fff",
                              }}
                            >
                              {r.name}
                            </span>
                            <span
                              className="block truncate"
                              style={{ fontSize: 11, color: "#7aa0c7" }}
                            >
                              {r.email}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {errors.recipientIds && (
                <p
                  style={{ margin: "6px 0 0", fontSize: 12, color: "#f87171" }}
                >
                  {errors.recipientIds.message}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <div style={fieldLabelStyle}>
                Tiêu đề thông báo <span style={{ color: "#f87171" }}>*</span>
              </div>
              <div className="relative">
                <span
                  className="absolute pointer-events-none"
                  style={{
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#7aa0c7",
                  }}
                >
                  <Type size={15} />
                </span>
                <input
                  type="text"
                  {...register("title")}
                  placeholder="Nhập tiêu đề thông báo..."
                  style={{
                    width: "100%",
                    height: 44,
                    background: "#0b1e3a",
                    border: "1px solid rgba(30, 58, 95, 0.7)",
                    borderRadius: 12,
                    padding: "0 12px 0 36px",
                    fontSize: 14,
                    color: "#fff",
                    outline: "none",
                  }}
                />
              </div>
              {errors.title && (
                <p
                  style={{ margin: "6px 0 0", fontSize: 12, color: "#f87171" }}
                >
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <div style={fieldLabelStyle}>
                Nội dung thông điệp <span style={{ color: "#f87171" }}>*</span>
              </div>
              <div
                style={{
                  borderRadius: 12,
                  border: "1px solid rgba(30, 58, 95, 0.7)",
                  background: "#0b1e3a",
                  overflow: "hidden",
                }}
              >
                <div
                  className="flex items-center flex-wrap"
                  style={{
                    gap: 2,
                    padding: "6px 8px",
                    borderBottom: "1px solid rgba(30, 58, 95, 0.5)",
                    background: "rgba(15, 37, 71, 0.5)",
                    color: "#7aa0c7",
                  }}
                >
                  <div
                    className="flex items-center"
                    style={{
                      gap: 4,
                      padding: "4px 8px",
                      borderRadius: 8,
                      background: "#0b1e3a",
                      border: "1px solid rgba(30, 58, 95, 0.5)",
                      fontSize: 12,
                      color: "#a8c1e0",
                      marginRight: 4,
                    }}
                  >
                    Đoạn văn <ChevronDown size={12} />
                  </div>
                  {[
                    [Bold, "Đậm"],
                    [Italic, "Nghiêng"],
                    [Underline, "Gạch chân"],
                    [Strikethrough, "Gạch ngang"],
                    [Link2, "Liên kết"],
                  ].map(([Icon, title]) => (
                    <button
                      key={String(title)}
                      type="button"
                      title={String(title)}
                      className="cursor-pointer"
                      style={{
                        padding: 6,
                        border: "none",
                        background: "transparent",
                        color: "inherit",
                        borderRadius: 8,
                      }}
                    >
                      <Icon size={15} />
                    </button>
                  ))}
                  <span
                    style={{
                      width: 1,
                      height: 14,
                      background: "rgba(30,58,95,0.6)",
                      margin: "0 4px",
                    }}
                  />
                  {[
                    [List, "Danh sách"],
                    [ListOrdered, "Danh sách số"],
                    [AlignLeft, "Căn trái"],
                    [AlignCenter, "Căn giữa"],
                    [AlignRight, "Căn phải"],
                    [AlignJustify, "Căn đều"],
                    [Indent, "Thụt lề"],
                    [ImagePlus, "Ảnh"],
                    [Table2, "Bảng"],
                    [Undo2, "Hoàn tác"],
                    [Redo2, "Làm lại"],
                  ].map(([Icon, title]) => (
                    <button
                      key={String(title)}
                      type="button"
                      title={String(title)}
                      className="cursor-pointer"
                      style={{
                        padding: 6,
                        border: "none",
                        background: "transparent",
                        color: "inherit",
                        borderRadius: 8,
                      }}
                    >
                      <Icon size={15} />
                    </button>
                  ))}
                </div>
                <textarea
                  {...register("message")}
                  rows={6}
                  placeholder="Nhập nội dung thông báo tại đây..."
                  style={{
                    width: "100%",
                    minHeight: 132,
                    background: "transparent",
                    border: "none",
                    padding: "12px",
                    fontSize: 14,
                    color: "#fff",
                    outline: "none",
                    resize: "none",
                    lineHeight: 1.6,
                    display: "block",
                  }}
                />
                <div
                  className="flex justify-end"
                  style={{
                    padding: "6px 12px",
                    borderTop: "1px solid rgba(30, 58, 95, 0.3)",
                  }}
                >
                  <span style={{ fontSize: 11, color: "#5a7aa0" }}>
                    {messageVal.length}/2000
                  </span>
                </div>
              </div>
              {errors.message && (
                <p
                  style={{ margin: "6px 0 0", fontSize: 12, color: "#f87171" }}
                >
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Options */}
            <div className="flex flex-wrap items-center" style={{ gap: 24 }}>
              <label
                className="flex items-center cursor-pointer select-none"
                style={{
                  gap: 8,
                  fontSize: 13,
                  color: "#a8c1e0",
                  position: "static",
                  transform: "none",
                  margin: 0,
                }}
              >
                <input type="checkbox" {...register("requireRead24h")} />
                Xác nhận đọc 24h
              </label>
              <label
                className="flex items-center cursor-pointer select-none"
                style={{
                  gap: 8,
                  fontSize: 13,
                  color: "#a8c1e0",
                  position: "static",
                  transform: "none",
                  margin: 0,
                }}
              >
                <input type="checkbox" {...register("pinToTop")} />
                Ghim đầu trang
              </label>
            </div>
          </form>

          {/* Preview */}
          <aside
            className="overflow-y-auto"
            style={{
              borderLeft: "1px solid rgba(30, 58, 95, 0.45)",
              background: "#0d1d36",
              padding: "22px 20px",
            }}
          >
            <div
              className="flex items-center"
              style={{
                gap: 8,
                marginBottom: 14,
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              <Eye size={16} style={{ color: "#7aa0c7" }} />
              Xem trước
            </div>
            <div
              style={{
                borderRadius: 12,
                border: "1px solid rgba(30, 58, 95, 0.55)",
                background: "rgba(11, 30, 58, 0.75)",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: 16 }}>
                <div
                  className="flex items-center justify-between"
                  style={{ marginBottom: 12 }}
                >
                  <span
                    className="flex items-center"
                    style={{
                      gap: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#fff",
                    }}
                  >
                    <span
                      className="flex items-center justify-center"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: "#1a5fb4",
                      }}
                    >
                      <Bell size={13} className="text-white" />
                    </span>
                    Thông báo
                  </span>
                  <span style={{ fontSize: 11, color: "#7aa0c7" }}>
                    Hôm nay, 10:24
                  </span>
                </div>
                <span
                  className={`inline-flex items-center ${priorityBadge.className}`}
                  style={{
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: 999,
                    borderWidth: 1,
                    borderStyle: "solid",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: "currentColor",
                      opacity: 0.75,
                    }}
                  />
                  {priorityBadge.label}
                </span>
                <p
                  style={{
                    margin: "12px 0 0",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1.4,
                  }}
                >
                  {titleVal.trim()
                    ? titleVal
                    : "Tiêu đề thông báo sẽ hiển thị ở đây"}
                </p>
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: 12,
                    color: "#7aa0c7",
                    lineHeight: 1.6,
                  }}
                >
                  {messageVal.trim()
                    ? messageVal
                    : "Nội dung thông điệp sẽ hiển thị ở đây. Bạn có thể viết nội dung chi tiết của thông báo tại phần soạn thảo bên trái."}
                </p>
                <div
                  className="flex items-center justify-between"
                  style={{
                    marginTop: 14,
                    paddingTop: 12,
                    borderTop: "1px solid rgba(30, 58, 95, 0.4)",
                    fontSize: 12,
                    color: "#7aa0c7",
                  }}
                >
                  <span className="flex items-center" style={{ gap: 6 }}>
                    <Users size={13} />
                    Gửi đến:{" "}
                    {selectedDept ? selectedDeptName : "Chọn Khoa / Viện"}
                  </span>
                  <ChevronRight size={14} style={{ color: "#3a5a7a" }} />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end shrink-0"
          style={{
            gap: 10,
            padding: "14px 24px",
            borderTop: "1px solid rgba(30, 58, 95, 0.45)",
            background: "rgba(13, 29, 54, 0.7)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer"
            style={{
              height: 40,
              padding: "0 20px",
              borderRadius: 10,
              border: "1px solid #1e3a5f",
              background: "transparent",
              color: "#a8c1e0",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => handleSubmit((d) => onSubmit(d, true))()}
            disabled={isSubmitting}
            className="inline-flex items-center cursor-pointer disabled:opacity-50"
            style={{
              height: 40,
              padding: "0 18px",
              gap: 6,
              borderRadius: 10,
              border: "none",
              background: "#1a7af0",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              boxShadow: "0 6px 16px rgba(26, 122, 240, 0.28)",
            }}
          >
            <Save size={15} />
            Lưu nháp
          </button>
          <button
            type="submit"
            form="compose-form"
            disabled={isSubmitting || selectedIds.length === 0}
            className="hidden"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );

  if (!mounted) return dialog;
  return createPortal(dialog, document.body);
};

export default SendNotificationForm;
