"use client";

// ============================================================
// CommitteeFormDialog — Form tạo / sửa Hội đồng bảo vệ
//
// Logic đặc thù (Nghiệp vụ Giai đoạn 3):
//  - Chủ tịch, Thư ký, Phản biện trong: chỉ được chọn từ danh sách
//    availableTeachers (đã được lọc bỏ các GV đang bận ở HĐ khác).
//  - Phản biện ngoài: dùng allTeachers (được phép ngồi nhiều HĐ).
//  - excludedTeacherIds: danh sách ID GVHD của các đề tài thuộc HĐ này —
//    bị loại khỏi TẤT CẢ dropdown để tránh GV tự chấm sinh viên của mình.
//  - Các vị trí cố định (Chủ tịch, Thư ký, Phản biện trong 1 & 2) không
//    được trùng nhau trong cùng một Hội đồng.
// ============================================================

import { useState, useEffect, useRef, useMemo } from "react";
import { Box, Typography, Grid, Alert, Tooltip } from "@mui/material";
import { Dialog } from "@/shared/components";
import { Input } from "@/shared/components";
import { Select } from "@/shared/components";
import { MultiSelect } from "@/shared/components";
import { Button } from "@/shared/components";
import { ShieldAlert } from "lucide-react";
import type { Committee, TeacherBasic } from "../services";

interface CommitteeFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    chairmanId?: number;
    secretaryId?: number;
    internal1Id?: number;
    internal2Id?: number;
    externalReviewerIds: number[];
  }) => Promise<void>;
  committee?: Committee | null;
  loading?: boolean;
  /** Tất cả GV trong hệ thống (dùng cho dropdown Phản biện ngoài) */
  allTeachers: TeacherBasic[];
  /** GV còn "trống" — chưa được gán cố định vào HĐ nào (dùng cho Chủ tịch, Thư ký, PB trong) */
  availableTeachers: TeacherBasic[];
  /**
   * Danh sách ID của Giảng viên hướng dẫn có đề tài thuộc HĐ này.
   * Các GV này bị loại khỏi TẤT CẢ dropdown (conflict of interest).
   */
  excludedTeacherIds?: number[];
}

export function CommitteeFormDialog({
  open,
  onClose,
  onSubmit,
  committee,
  loading = false,
  allTeachers,
  availableTeachers,
  excludedTeacherIds = [],
}: CommitteeFormDialogProps) {
  const isEdit = !!committee;
  const prevOpenRef = useRef<boolean>(open);

  const [formData, setFormData] = useState({
    name: "",
    chairmanId: null as number | null,
    secretaryId: null as number | null,
    internal1Id: null as number | null,
    internal2Id: null as number | null,
    externalReviewerIds: [] as number[],
  });

  // ---- Reset form khi dialog mở ----
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      if (committee) {
        setFormData({
          name: committee.name,
          chairmanId: committee.chairmanId,
          secretaryId: committee.secretaryId,
          internal1Id: committee.internal1Id,
          internal2Id: committee.internal2Id,
          externalReviewerIds: committee.externalReviewers.map(
            (er: { id: number }) => er.id,
          ),
        });
      } else {
        setFormData({
          name: "",
          chairmanId: null,
          secretaryId: null,
          internal1Id: null,
          internal2Id: null,
          externalReviewerIds: [],
        });
      }
    }
    prevOpenRef.current = open;
  }, [open, committee]);

  // ---- Tính toán danh sách GV đã được chọn ở các vị trí CỐ ĐỊNH trong form ----
  // Mục đích: ẩn GV đang được chọn ở vị trí này ra khỏi các dropdown khác
  // để tránh 1 GV giữ 2 vai trong cùng 1 HĐ.
  const selectedFixedIds = useMemo(
    () =>
      [
        formData.chairmanId,
        formData.secretaryId,
        formData.internal1Id,
        formData.internal2Id,
      ].filter((id): id is number => id !== null),
    [
      formData.chairmanId,
      formData.secretaryId,
      formData.internal1Id,
      formData.internal2Id,
    ],
  );

  /**
   * Lấy danh sách GV hợp lệ cho một vị trí cố định (Chủ tịch / Thư ký / PB trong).
   * Loại bỏ:
   *  1. GVHD (conflict of interest) — excludedTeacherIds
   *  2. GV đang được chọn ở vị trí khác trong cùng form — để tránh trùng vai
   *     (ngoại trừ chính vị trí hiện tại đang xét — currentId)
   */
  const getFixedOptions = (currentId: number | null) => {
    const otherSelected = selectedFixedIds.filter((id) => id !== currentId);
    return availableTeachers
      .filter(
        (t) =>
          !excludedTeacherIds.includes(t.id) && !otherSelected.includes(t.id),
      )
      .map((t) => ({
        value: String(t.id),
        label: `${t.name} (${t.teacherId})`,
      }));
  };

  /**
   * Danh sách GV cho Phản biện ngoài:
   *  - Dùng allTeachers (không bị ràng buộc "chỉ 1 HĐ")
   *  - Vẫn loại bỏ GVHD có đề tài trong HĐ này (conflict of interest)
   */
  const externalOptions = useMemo(
    () =>
      allTeachers
        .filter((t) => !excludedTeacherIds.includes(t.id))
        .map((t) => ({
          value: String(t.id),
          label: `${t.name} (${t.teacherId})${t.department ? ` — ${t.department}` : ""}`,
        })),
    [allTeachers, excludedTeacherIds],
  );

  // ---- Validation trước khi submit ----
  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    await onSubmit({
      name: formData.name.trim(),
      chairmanId: formData.chairmanId ?? undefined,
      secretaryId: formData.secretaryId ?? undefined,
      internal1Id: formData.internal1Id ?? undefined,
      internal2Id: formData.internal2Id ?? undefined,
      externalReviewerIds: formData.externalReviewerIds,
    });
  };

  const isSubmitDisabled = loading || !formData.name.trim();

  return (
    <Dialog
      open={open}
      onClose={loading ? () => {} : onClose}
      title={isEdit ? "Sửa Hội đồng" : "Tạo Hội đồng mới"}
      description={
        isEdit
          ? "Cập nhật thông tin hội đồng bảo vệ"
          : "Thiết lập thông tin cho hội đồng bảo vệ mới"
      }
      size="lg"
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            loading={loading}
          >
            {isEdit ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </>
      }
    >
      <Box sx={{ mt: 2 }}>
        {/* Tên Hội đồng */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Tên hội đồng <span style={{ color: "red" }}>*</span>
          </Typography>
          <Input
            placeholder="VD: Hội đồng chấm luận văn KHDL 2026"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
          />
        </Box>

        {/* Cảnh báo GVHD bị loại trừ */}
        {excludedTeacherIds.length > 0 && (
          <Alert
            severity="warning"
            icon={<ShieldAlert size={18} />}
            sx={{ mb: 3 }}
          >
            <Typography variant="body2">
              <strong>{excludedTeacherIds.length} Giảng viên hướng dẫn</strong>{" "}
              đang hướng dẫn đề tài trong Hội đồng này đã bị loại khỏi danh sách
              giám khảo (quy định xung đột lợi ích).
            </Typography>
          </Alert>
        )}

        {/* Hàng 1: Chủ tịch + Thư ký */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Chủ tịch
            </Typography>
            <Tooltip
              title={
                excludedTeacherIds.length > 0
                  ? "GVHD của đề tài trong HĐ này đã bị loại"
                  : ""
              }
              placement="top"
            >
              <span style={{ display: "block" }}>
                <Select
                  placeholder="Chọn chủ tịch"
                  value={
                    formData.chairmanId
                      ? String(formData.chairmanId)
                      : undefined
                  }
                  onChange={(v) =>
                    setFormData({
                      ...formData,
                      chairmanId: v ? Number(v) : null,
                    })
                  }
                  options={getFixedOptions(formData.chairmanId)}
                  fullWidth
                />
              </span>
            </Tooltip>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Thư ký HĐ
            </Typography>
            <Select
              placeholder="Chọn thư ký"
              value={
                formData.secretaryId ? String(formData.secretaryId) : undefined
              }
              onChange={(v) =>
                setFormData({
                  ...formData,
                  secretaryId: v ? Number(v) : null,
                })
              }
              options={getFixedOptions(formData.secretaryId)}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Hàng 2: Phản biện trong 1 + 2 */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Phản biện trong 1
            </Typography>
            <Select
              placeholder="Chọn phản biện trong 1"
              value={
                formData.internal1Id ? String(formData.internal1Id) : undefined
              }
              onChange={(v) =>
                setFormData({
                  ...formData,
                  internal1Id: v ? Number(v) : null,
                })
              }
              options={getFixedOptions(formData.internal1Id)}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Phản biện trong 2
            </Typography>
            <Select
              placeholder="Chọn phản biện trong 2"
              value={
                formData.internal2Id ? String(formData.internal2Id) : undefined
              }
              onChange={(v) =>
                setFormData({
                  ...formData,
                  internal2Id: v ? Number(v) : null,
                })
              }
              options={getFixedOptions(formData.internal2Id)}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Phản biện ngoài */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Phản biện ngoài
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 1, display: "block" }}
          >
            Có thể chọn nhiều người. Phản biện ngoài được phép tham gia nhiều
            Hội đồng.
          </Typography>
          <MultiSelect
            placeholder="Chọn phản biện ngoài..."
            value={formData.externalReviewerIds.map(String)}
            onChange={(v) =>
              setFormData({
                ...formData,
                externalReviewerIds: v.map(Number),
              })
            }
            options={externalOptions}
          />
        </Box>

        {/* Quy tắc nghiệp vụ */}
        <Alert severity="info">
          <Typography variant="body2" component="div">
            <strong>Quy tắc thành viên Hội đồng:</strong>
            <ul style={{ margin: "4px 0 0 16px", paddingLeft: 0 }}>
              <li>
                Chủ tịch, Thư ký HĐ và Phản biện trong chỉ được thuộc{" "}
                <strong>một</strong> Hội đồng.
              </li>
              <li>
                Phản biện ngoài có thể tham gia <strong>nhiều Hội đồng</strong>{" "}
                khác nhau.
              </li>
              <li>
                GVHD của đề tài trong Hội đồng <strong>không được</strong> ngồi
                ghế giám khảo (tránh xung đột lợi ích).
              </li>
            </ul>
          </Typography>
        </Alert>
      </Box>
    </Dialog>
  );
}
