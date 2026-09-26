"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@mui/material";
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
  message: z
    .string()
    .refine(
      (v) => htmlToPlainText(v).length > 0,
      "Nội dung không được để trống",
    ),
  recipientIds: z.array(z.number()).min(1, "Chọn ít nhất 1 người nhận"),
  requireRead24h: z.boolean(),
  pinToTop: z.boolean(),
});

type SendNotificationFormData = z.infer<typeof SendNotificationSchema>;

function htmlToPlainText(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const BLOCK_OPTIONS = [
  { value: "p", label: "Đoạn văn" },
  { value: "h1", label: "Tiêu đề 1" },
  { value: "h2", label: "Tiêu đề 2" },
  { value: "h3", label: "Tiêu đề 3" },
] as const;

const EDITOR_CSS = `
.compose-editor h1,.compose-preview h1{font-size:22px;font-weight:700;margin:0 0 8px;line-height:1.3}
.compose-editor h2,.compose-preview h2{font-size:18px;font-weight:700;margin:0 0 8px;line-height:1.3}
.compose-editor h3,.compose-preview h3{font-size:16px;font-weight:700;margin:0 0 8px;line-height:1.35}
.compose-editor p,.compose-preview p{margin:0 0 8px}
.compose-editor ul,.compose-preview ul,.compose-editor ol,.compose-preview ol{margin:0 0 8px;padding-left:22px}
.compose-editor img,.compose-preview img{max-width:100%;height:auto;border-radius:8px}
.compose-editor table,.compose-preview table{width:100%;border-collapse:collapse;margin:8px 0}
.compose-editor td,.compose-preview td,.compose-editor th,.compose-preview th{border:1px solid #cbd5e1;padding:6px 8px;min-width:48px}
.compose-editor a,.compose-preview a{color:#1a7af0;text-decoration:underline}
`;

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
}> = [
  {
    value: "NORMAL",
    label: "Bình thường",
    icon: <List size={14} />,
  },
  {
    value: "DIRECTIVE",
    label: "Chỉ thị BGH",
    icon: <Building2 size={14} />,
  },
  {
    value: "URGENT",
    label: "Hỏa tốc",
    icon: <Zap size={14} />,
  },
  {
    value: "REMINDER",
    label: "Nhắc hạn",
    icon: <CalendarClock size={14} />,
  },
];

const PRIORITY_ACTIVE_DARK: Record<
  SendNotificationFormData["priority"],
  string
> = {
  NORMAL: "border-sky-500/60 bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30",
  DIRECTIVE:
    "border-violet-500/50 bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/25",
  URGENT: "border-red-500/50 bg-red-500/10 text-red-300 ring-1 ring-red-500/25",
  REMINDER:
    "border-amber-500/40 bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20",
};

const PRIORITY_ACTIVE_LIGHT: Record<
  SendNotificationFormData["priority"],
  string
> = {
  NORMAL: "border-sky-500 bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  DIRECTIVE:
    "border-violet-500 bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  URGENT: "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-200",
  REMINDER: "border-amber-500 bg-amber-50 text-amber-800 ring-1 ring-amber-200",
};

const PRIORITY_BADGE_DARK: Record<
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

const PRIORITY_BADGE_LIGHT: Record<
  SendNotificationFormData["priority"],
  { label: string; className: string }
> = {
  NORMAL: {
    label: "Bình thường",
    className: "bg-sky-50 text-sky-700 border-sky-200",
  },
  DIRECTIVE: {
    label: "Chỉ thị BGH",
    className: "bg-violet-50 text-violet-700 border-violet-200",
  },
  URGENT: {
    label: "Hỏa tốc",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  REMINDER: {
    label: "Nhắc hạn",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
};

const SendNotificationForm: React.FC<SendNotificationFormProps> = ({
  onSuccess,
  onClose,
}) => {
  const searchParams = useSearchParams();
  const scopedDepartmentId = searchParams.get("departmentId") || "";
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const t = isDark
    ? {
        overlay: "rgba(8, 16, 32, 0.55)",
        dialog: "#0f1c33",
        dialogBorder: "rgba(30, 58, 95, 0.7)",
        headerBorder: "rgba(30, 58, 95, 0.45)",
        title: "#fff",
        muted: "#7aa0c7",
        ink: "#fff",
        label: "#e8f0fa",
        body: "#cbd9ec",
        field: "#0b1e3a",
        fieldBorder: "rgba(30, 58, 95, 0.7)",
        previewBg: "#0d1d36",
        previewCard: "rgba(11, 30, 58, 0.75)",
        footerBg: "rgba(13, 29, 54, 0.7)",
        cancelBorder: "#1e3a5f",
        cancelText: "#a8c1e0",
        hover: "rgba(255,255,255,0.05)",
        selected: "#7dd3fc",
        toolbar: "rgba(15, 37, 71, 0.5)",
        divider: "rgba(30, 58, 95, 0.5)",
        count: "#5a7aa0",
        optionIdle: "border-[#1e3a5f]/60 bg-[#0b1e3a]/80 text-[#7aa0c7]",
        radioIdle: "border-[#2a4a73]",
        shadow: "0 24px 64px rgba(0,0,0,0.45)",
        recipientList: "rgba(11, 30, 58, 0.7)",
      }
    : {
        overlay: "rgba(15, 23, 42, 0.4)",
        dialog: "#ffffff",
        dialogBorder: "#e2e8f0",
        headerBorder: "#e2e8f0",
        title: "#0f172a",
        muted: "#64748b",
        ink: "#0f172a",
        label: "#334155",
        body: "#334155",
        field: "#ffffff",
        fieldBorder: "#e2e8f0",
        previewBg: "#f8fafc",
        previewCard: "#ffffff",
        footerBg: "#f8fafc",
        cancelBorder: "#e2e8f0",
        cancelText: "#334155",
        hover: "#f1f5f9",
        selected: "#0369a1",
        toolbar: "#f8fafc",
        divider: "#e2e8f0",
        count: "#94a3b8",
        optionIdle: "border-slate-200 bg-white text-slate-600",
        radioIdle: "border-slate-300",
        shadow: "0 24px 64px rgba(15,23,42,0.18)",
        recipientList: "#f8fafc",
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
    color: t.label,
    letterSpacing: 0.1,
  };
  const priorityActive = isDark ? PRIORITY_ACTIVE_DARK : PRIORITY_ACTIVE_LIGHT;
  const priorityBadgeMap = isDark ? PRIORITY_BADGE_DARK : PRIORITY_BADGE_LIGHT;

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
      title: "",
      message: "",
      recipientIds: [],
      requireRead24h: true,
      pinToTop: false,
    },
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [blockOpen, setBlockOpen] = useState(false);
  const [fmt, setFmt] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    ul: false,
    ol: false,
    align: "" as "" | "left" | "center" | "right" | "justify",
    block: "p",
  });

  const refreshFmt = () => {
    if (typeof document === "undefined") return;
    const block = (document.queryCommandValue("formatBlock") || "p")
      .replace(/[<>]/g, "")
      .toLowerCase();
    setFmt({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strike: document.queryCommandState("strikeThrough"),
      ul: document.queryCommandState("insertUnorderedList"),
      ol: document.queryCommandState("insertOrderedList"),
      align: document.queryCommandState("justifyCenter")
        ? "center"
        : document.queryCommandState("justifyRight")
          ? "right"
          : document.queryCommandState("justifyFull")
            ? "justify"
            : document.queryCommandState("justifyLeft")
              ? "left"
              : "",
      block: BLOCK_OPTIONS.some((b) => b.value === block) ? block : "p",
    });
  };

  const syncFromEditor = () => {
    const html = editorRef.current?.innerHTML ?? "";
    setValue("message", html, { shouldValidate: true, shouldDirty: true });
  };

  const runCmd = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncFromEditor();
    refreshFmt();
  };

  const applyBlock = (tag: string) => {
    runCmd("formatBlock", tag === "p" ? "P" : tag.toUpperCase());
    setBlockOpen(false);
  };

  const insertLink = () => {
    const url = window.prompt("Nhập đường dẫn liên kết", "https://");
    if (!url) return;
    runCmd("createLink", url);
  };

  const insertTable = () => {
    editorRef.current?.focus();
    document.execCommand(
      "insertHTML",
      false,
      `<table><tbody>${Array.from({ length: 3 }, () => `<tr>${"<td>&nbsp;</td>".repeat(3)}</tr>`).join("")}</tbody></table>`,
    );
    syncFromEditor();
  };

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      editorRef.current?.focus();
      document.execCommand("insertImage", false, String(reader.result));
      const imgs = editorRef.current?.querySelectorAll("img");
      const last = imgs?.[imgs.length - 1];
      if (last)
        last.setAttribute(
          "style",
          "max-width:100%;height:auto;border-radius:8px",
        );
      syncFromEditor();
    };
    reader.readAsDataURL(file);
  };

  const selectedPriority = watch("priority");
  const selectedIds = watch("recipientIds");
  const titleVal = watch("title") || "";
  const messageVal = watch("message") || "";

  const [departments, setDepartments] = useState<Department[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>(scopedDepartmentId);
  const [deptOpen, setDeptOpen] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    setSelectedDept(scopedDepartmentId);
    setValue("recipientIds", []);
  }, [scopedDepartmentId, setValue]);

  useEffect(() => {
    setValue("recipientIds", []);
    if (selectedDept) loadRecipientsByDept(selectedDept);
    else setRecipients([]);
  }, [selectedDept, setValue]);

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    register("message");
  }, [register]);

  useEffect(() => {
    const onSel = () => {
      const node = document.getSelection()?.anchorNode;
      if (!editorRef.current || !node) return;
      if (
        !editorRef.current.contains(node) &&
        document.activeElement !== editorRef.current
      )
        return;
      refreshFmt();
    };
    document.addEventListener("selectionchange", onSel);
    return () => document.removeEventListener("selectionchange", onSel);
  }, []);

  useEffect(() => {
    if (!blockOpen) return;
    const close = () => setBlockOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [blockOpen]);

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
      if (editorRef.current) editorRef.current.innerHTML = "";
      setFileName("");
      setFileSize(0);
      setSelectedDept(scopedDepartmentId);
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
  const priorityBadge = priorityBadgeMap[selectedPriority];

  const dialog = (
    <div
      className="fixed inset-0 z-[1400] flex items-center justify-center p-4 sm:p-6"
      style={{ background: t.overlay }}
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
          background: t.dialog,
          border: `1px solid ${t.dialogBorder}`,
          borderRadius: 16,
          boxShadow: t.shadow,
        }}
      >
        <style>{EDITOR_CSS}</style>
        {/* Header */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{
            padding: "16px 24px",
            borderBottom: `1px solid ${t.headerBorder}`,
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
                  color: t.title,
                  lineHeight: "24px",
                }}
              >
                Soạn thông báo
              </h2>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: 12,
                  color: t.muted,
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
              color: t.muted,
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
              syncFromEditor();
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
                        active ? priorityActive[opt.value] : t.optionIdle
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
                          active ? "border-current" : t.radioIdle
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
                    onClick={() => {
                      if (scopedDepartmentId) return;
                      setDeptOpen((v) => !v);
                    }}
                    disabled={loadingDepts || !!scopedDepartmentId}
                    className="w-full flex items-center justify-between cursor-pointer disabled:opacity-50"
                    style={{
                      height: 44,
                      padding: "0 12px",
                      borderRadius: 12,
                      background: t.field,
                      border: `1px solid ${t.fieldBorder}`,
                      color: t.ink,
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
                        style={{ color: t.muted, flexShrink: 0 }}
                      />
                      <span
                        className="truncate"
                        style={{ color: selectedDept ? t.ink : t.muted }}
                      >
                        {loadingDepts ? "Đang tải..." : selectedDeptName}
                      </span>
                    </span>
                    <ChevronDown
                      size={16}
                      style={{
                        color: t.muted,
                        flexShrink: 0,
                        transform: deptOpen ? "rotate(180deg)" : undefined,
                      }}
                    />
                  </button>
                  {deptOpen && !scopedDepartmentId && (
                    <div
                      className="absolute z-20 overflow-hidden overflow-y-auto"
                      style={{
                        marginTop: 6,
                        width: "100%",
                        maxHeight: 220,
                        borderRadius: 12,
                        border: `1px solid ${t.fieldBorder}`,
                        background: t.field,
                        boxShadow: t.shadow,
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
                          background: !selectedDept ? t.hover : "transparent",
                          color: !selectedDept ? t.selected : t.body,
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
                              selectedDept === d.id ? t.hover : "transparent",
                            color: selectedDept === d.id ? t.selected : t.body,
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
                    background: t.field,
                    border: `1px solid ${t.fieldBorder}`,
                    color: t.muted,
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
                    border: `1px solid ${t.fieldBorder}`,
                    background: t.recipientList,
                    padding: 8,
                  }}
                >
                  {loadingRecipients ? (
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: t.muted,
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
                        color: t.muted,
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
                        <span style={{ fontSize: 12, color: t.body }}>
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
                                color: t.ink,
                              }}
                            >
                              {r.name}
                            </span>
                            <span
                              className="block truncate"
                              style={{ fontSize: 11, color: t.muted }}
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
                    color: t.muted,
                  }}
                >
                  <Type size={15} />
                </span>
                <input
                  type="text"
                  {...register("title")}
                  placeholder="Nhập tiêu đề thông báo..."
                  className="placeholder:opacity-70"
                  style={{
                    width: "100%",
                    height: 44,
                    background: t.field,
                    border: `1px solid ${t.fieldBorder}`,
                    borderRadius: 12,
                    padding: "0 12px 0 36px",
                    fontSize: 14,
                    color: t.ink,
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
                  border: `1px solid ${t.fieldBorder}`,
                  background: t.field,
                }}
              >
                <div
                  className="flex items-center flex-wrap"
                  style={{
                    gap: 2,
                    padding: "6px 8px",
                    borderBottom: `1px solid ${t.divider}`,
                    background: t.toolbar,
                    color: t.muted,
                  }}
                >
                  <div className="relative" style={{ marginRight: 4 }}>
                    <button
                      type="button"
                      className="flex items-center cursor-pointer"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setBlockOpen((v) => !v);
                      }}
                      style={{
                        gap: 4,
                        padding: "4px 8px",
                        borderRadius: 8,
                        background: t.field,
                        border: `1px solid ${t.fieldBorder}`,
                        fontSize: 12,
                        color: t.body,
                      }}
                    >
                      {BLOCK_OPTIONS.find((b) => b.value === fmt.block)
                        ?.label ?? "Đoạn văn"}{" "}
                      <ChevronDown size={12} />
                    </button>
                    {blockOpen && (
                      <div
                        className="absolute z-20 overflow-hidden"
                        style={{
                          top: "100%",
                          left: 0,
                          marginTop: 4,
                          minWidth: 140,
                          borderRadius: 10,
                          border: `1px solid ${t.fieldBorder}`,
                          background: t.field,
                          boxShadow: t.shadow,
                        }}
                      >
                        {BLOCK_OPTIONS.map((b) => (
                          <button
                            key={b.value}
                            type="button"
                            className="w-full text-left cursor-pointer"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => applyBlock(b.value)}
                            style={{
                              display: "block",
                              padding: "8px 12px",
                              fontSize: 12,
                              fontWeight: b.value === "p" ? 500 : 700,
                              border: "none",
                              background:
                                fmt.block === b.value ? t.hover : "transparent",
                              color: t.body,
                            }}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {(
                    [
                      [Bold, "Đậm", () => runCmd("bold"), fmt.bold],
                      [Italic, "Nghiêng", () => runCmd("italic"), fmt.italic],
                      [
                        Underline,
                        "Gạch chân",
                        () => runCmd("underline"),
                        fmt.underline,
                      ],
                      [
                        Strikethrough,
                        "Gạch ngang",
                        () => runCmd("strikeThrough"),
                        fmt.strike,
                      ],
                      [Link2, "Liên kết", insertLink, false],
                    ] as const
                  ).map(([Icon, title, onClick, active]) => (
                    <button
                      key={title}
                      type="button"
                      title={title}
                      className="cursor-pointer"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={onClick}
                      style={{
                        padding: 6,
                        border: "none",
                        background: active ? t.hover : "transparent",
                        color: active ? t.ink : "inherit",
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
                      background: t.divider,
                      margin: "0 4px",
                    }}
                  />
                  {(
                    [
                      [
                        List,
                        "Danh sách",
                        () => runCmd("insertUnorderedList"),
                        fmt.ul,
                      ],
                      [
                        ListOrdered,
                        "Danh sách số",
                        () => runCmd("insertOrderedList"),
                        fmt.ol,
                      ],
                      [
                        AlignLeft,
                        "Căn trái",
                        () => runCmd("justifyLeft"),
                        fmt.align === "left",
                      ],
                      [
                        AlignCenter,
                        "Căn giữa",
                        () => runCmd("justifyCenter"),
                        fmt.align === "center",
                      ],
                      [
                        AlignRight,
                        "Căn phải",
                        () => runCmd("justifyRight"),
                        fmt.align === "right",
                      ],
                      [
                        AlignJustify,
                        "Căn đều",
                        () => runCmd("justifyFull"),
                        fmt.align === "justify",
                      ],
                      [Indent, "Thụt lề", () => runCmd("indent"), false],
                      [
                        ImagePlus,
                        "Ảnh",
                        () => imageInputRef.current?.click(),
                        false,
                      ],
                      [Table2, "Bảng", insertTable, false],
                      [Undo2, "Hoàn tác", () => runCmd("undo"), false],
                      [Redo2, "Làm lại", () => runCmd("redo"), false],
                    ] as const
                  ).map(([Icon, title, onClick, active]) => (
                    <button
                      key={title}
                      type="button"
                      title={title}
                      className="cursor-pointer"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={onClick}
                      style={{
                        padding: 6,
                        border: "none",
                        background: active ? t.hover : "transparent",
                        color: active ? t.ink : "inherit",
                        borderRadius: 8,
                      }}
                    >
                      <Icon size={15} />
                    </button>
                  ))}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={onPickImage}
                  />
                </div>
                <div style={{ position: "relative" }}>
                  {!htmlToPlainText(messageVal) && (
                    <span
                      style={{
                        position: "absolute",
                        left: 12,
                        top: 12,
                        fontSize: 14,
                        color: t.count,
                        pointerEvents: "none",
                      }}
                    >
                      Nhập nội dung thông báo tại đây...
                    </span>
                  )}
                  <div
                    ref={editorRef}
                    className="compose-editor"
                    contentEditable
                    role="textbox"
                    aria-multiline
                    suppressContentEditableWarning
                    onInput={syncFromEditor}
                    onBlur={syncFromEditor}
                    onFocus={refreshFmt}
                    style={{
                      width: "100%",
                      minHeight: 132,
                      background: "transparent",
                      border: "none",
                      padding: "12px",
                      fontSize: 14,
                      color: t.ink,
                      outline: "none",
                      lineHeight: 1.6,
                    }}
                  />
                </div>
                <div
                  className="flex justify-end"
                  style={{
                    padding: "6px 12px",
                    borderTop: `1px solid ${t.divider}`,
                  }}
                >
                  <span style={{ fontSize: 11, color: t.count }}>
                    {htmlToPlainText(messageVal).length}/2000
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
                  color: t.body,
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
                  color: t.body,
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
              borderLeft: `1px solid ${t.headerBorder}`,
              background: t.previewBg,
              padding: "22px 20px",
            }}
          >
            <div
              className="flex items-center"
              style={{
                gap: 8,
                marginBottom: 14,
                color: t.title,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              <Eye size={16} style={{ color: t.muted }} />
              Xem trước
            </div>
            <div
              style={{
                borderRadius: 12,
                border: `1px solid ${t.fieldBorder}`,
                background: t.previewCard,
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
                      color: t.ink,
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
                  <span style={{ fontSize: 11, color: t.muted }}>
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
                    color: t.ink,
                    lineHeight: 1.4,
                  }}
                >
                  {titleVal.trim()
                    ? titleVal
                    : "Tiêu đề thông báo sẽ hiển thị ở đây"}
                </p>
                {htmlToPlainText(messageVal) ? (
                  <div
                    className="compose-preview"
                    style={{
                      margin: "8px 0 0",
                      fontSize: 12,
                      color: t.muted,
                      lineHeight: 1.6,
                    }}
                    dangerouslySetInnerHTML={{ __html: messageVal }}
                  />
                ) : (
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: 12,
                      color: t.muted,
                      lineHeight: 1.6,
                    }}
                  >
                    Nội dung thông điệp sẽ hiển thị ở đây. Bạn có thể viết nội
                    dung chi tiết của thông báo tại phần soạn thảo bên trái.
                  </p>
                )}
                <div
                  className="flex items-center justify-between"
                  style={{
                    marginTop: 14,
                    paddingTop: 12,
                    borderTop: `1px solid ${t.divider}`,
                    fontSize: 12,
                    color: t.muted,
                  }}
                >
                  <span className="flex items-center" style={{ gap: 6 }}>
                    <Users size={13} />
                    Gửi đến:{" "}
                    {selectedDept ? selectedDeptName : "Chọn Khoa / Viện"}
                  </span>
                  <ChevronRight size={14} style={{ color: t.muted }} />
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
            borderTop: `1px solid ${t.headerBorder}`,
            background: t.footerBg,
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
              border: `1px solid ${t.cancelBorder}`,
              background: "transparent",
              color: t.cancelText,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => {
              syncFromEditor();
              handleSubmit((d) => onSubmit(d, true))();
            }}
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
