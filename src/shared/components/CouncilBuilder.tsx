"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Button,
  Divider,
  Alert,
  IconButton,
  Paper,
} from "@mui/material";
import {
  DragIndicator as DragIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { useState, useCallback, useMemo } from "react";

export type CouncilRole = "chutich" | "pth" | "uv1" | "uv2";

export interface CouncilMember {
  id: string;
  name: string;
  title: string; // chức danh: TS., PGS., GS.
  faculty?: string;
  isExternal?: boolean;
}

export interface ThesisInCouncil {
  id: string;
  studentName: string;
  topicName: string;
  lecturer: string;
}

export interface Council {
  id: string;
  name: string;
  date: string;
  room: string;
  members: Partial<Record<CouncilRole, CouncilMember>>;
  theses: ThesisInCouncil[];
}

export interface CouncilBuilderProps {
  council?: Partial<Council>;
  allLecturers: CouncilMember[];
  theses: ThesisInCouncil[];
  onSave: (council: Partial<Council>) => void;
  readonly?: boolean;
}

const ROLE_LABELS: Record<CouncilRole, { label: string; short: string; required: boolean }> = {
  chutich: { label: "Chủ tịch", short: "CT", required: true },
  pth: { label: "Phó Chủ tịch", short: "PCT", required: true },
  uv1: { label: "Ủy viên 1", short: "UV1", required: true },
  uv2: { label: "Ủy viên 2", short: "UV2", required: true },
};

const ROLE_COLORS: Record<CouncilRole, string> = {
  chutich: "primary",
  pth: "info",
  uv1: "warning",
  uv2: "secondary",
};

export function CouncilBuilder({
  council,
  allLecturers,
  theses,
  onSave,
  readonly = false,
}: CouncilBuilderProps) {
  const [members, setMembers] = useState<Partial<Record<CouncilRole, CouncilMember>>>(council?.members ?? {});
  const [assignedTheses, setAssignedTheses] = useState<ThesisInCouncil[]>(council?.theses ?? []);
  const [selectedLecturer, setSelectedLecturer] = useState<CouncilRole | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const lecturerIds = Object.values(members).map((m) => m?.id).filter(Boolean) as string[];

  // Validate: no duplicate lecturers
  const duplicateLecturerIds = useMemo(() => {
    const seen = new Set<string>();
    const dupes = new Set<string>();
    for (const id of lecturerIds) {
      if (seen.has(id)) dupes.add(id);
      seen.add(id);
    }
    return dupes;
  }, [lecturerIds]);

  // Validate: no duplicate theses
  const duplicateThesisIds = useMemo(() => {
    const seen = new Set<string>();
    const dupes = new Set<string>();
    for (const t of assignedTheses) {
      if (seen.has(t.id)) dupes.add(t.id);
      seen.add(t.id);
    }
    return dupes;
  }, [assignedTheses]);

  const isValid =
    Object.keys(members).length >= 4 &&
    duplicateLecturerIds.size === 0 &&
    duplicateThesisIds.size === 0;

  const assignMember = useCallback((role: CouncilRole, member: CouncilMember) => {
    setMembers((prev) => ({ ...prev, [role]: member }));
    setShowPicker(false);
    setSelectedLecturer(null);
  }, []);

  const removeMember = useCallback((role: CouncilRole) => {
    setMembers((prev) => {
      const next = { ...prev };
      delete next[role];
      return next;
    });
  }, []);

  const assignThesis = useCallback((thesis: ThesisInCouncil) => {
    setAssignedTheses((prev) => {
      if (prev.some((t) => t.id === thesis.id)) return prev;
      return [...prev, thesis];
    });
  }, []);

  const removeThesis = useCallback((thesisId: string) => {
    setAssignedTheses((prev) => prev.filter((t) => t.id !== thesisId));
  }, []);

  const handleSave = useCallback(() => {
    if (!isValid) return;
    onSave({
      ...council,
      members,
      theses: assignedTheses,
    });
  }, [council, members, assignedTheses, isValid, onSave]);

  const availableLecturers = allLecturers.filter((l) => !lecturerIds.includes(l.id));

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 3 }}>
        {/* Left: Council members */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            Thành viên Hội đồng ({Object.keys(members).length}/4)
          </Typography>

          {duplicateLecturerIds.size > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="caption">
                Trùng giảng viên! Mỗi thành viên chỉ xuất hiện 1 lần trong HĐ.
              </Typography>
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {(Object.keys(ROLE_LABELS) as CouncilRole[]).map((role) => {
              const cfg = ROLE_LABELS[role];
              const member = members[role];
              const isDupe = member && duplicateLecturerIds.has(member.id);

              return (
                <Paper
                  key={role}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    borderColor: member
                      ? isDupe
                        ? "error.main"
                        : `${ROLE_COLORS[role]}.main`
                      : "divider",
                    borderLeft: `4px solid`,
                    borderLeftColor: member ? `${ROLE_COLORS[role]}.main` : "divider",
                    bgcolor: member ? `${ROLE_COLORS[role]}.50` : "background.paper",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      {!readonly && (
                        <DragIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                      )}
                      <Chip
                        label={cfg.short}
                        size="small"
                        color={ROLE_COLORS[role] as "primary" | "info" | "warning" | "secondary"}
                        sx={{ fontWeight: 900, minWidth: 40 }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {cfg.label}
                          {cfg.required && (
                            <Typography component="span" color="error.main"> *</Typography>
                          )}
                        </Typography>
                      </Box>
                    </Box>

                    {member ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Tooltip title={`${member.title} ${member.name} — ${member.faculty ?? ""}${member.isExternal ? " (Ngoài trường)" : ""}`}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: "0.7rem", bgcolor: `${ROLE_COLORS[role]}.main` }}>
                              {member.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                {member.name}
                              </Typography>
                              {isDupe && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <WarningIcon sx={{ fontSize: 12, color: "error.main" }} />
                                  <Typography variant="caption" color="error.main">Trùng!</Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Tooltip>
                        {!readonly && (
                          <IconButton size="small" color="error" onClick={() => removeMember(role)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    ) : (
                      !readonly && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => { setSelectedLecturer(role); setShowPicker(true); }}
                        >
                          Chọn GV
                        </Button>
                      )
                    )}
                  </Box>
                </Paper>
              );
            })}
          </Box>

          {/* Lecturer picker */}
          {showPicker && selectedLecturer && (
            <Paper variant="outlined" sx={{ mt: 2, p: 2, borderRadius: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: "block" }}>
                Chọn {ROLE_LABELS[selectedLecturer].label}:
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, maxHeight: 200, overflowY: "auto" }}>
                {availableLecturers.length === 0 ? (
                  <Typography variant="caption" color="text.secondary">Không còn GV khả dụng.</Typography>
                ) : (
                  availableLecturers.map((lecturer) => (
                    <Box
                      key={lecturer.id}
                      onClick={() => assignMember(selectedLecturer, lecturer)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1,
                        borderRadius: 1,
                        cursor: "pointer",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <Avatar sx={{ width: 24, height: 24, fontSize: "0.65rem" }}>
                        {lecturer.name.charAt(0)}
                      </Avatar>
                      <Typography variant="caption">
                        <strong>{lecturer.title} {lecturer.name}</strong>
                        {lecturer.faculty && ` — ${lecturer.faculty}`}
                        {lecturer.isExternal && (
                          <Chip label="Ngoài" size="small" sx={{ ml: 0.5, height: 16, fontSize: "0.6rem" }} />
                        )}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
              <Button size="small" onClick={() => { setShowPicker(false); setSelectedLecturer(null); }} sx={{ mt: 1 }}>
                Đóng
              </Button>
            </Paper>
          )}
        </Box>

        {/* Right: Assigned theses */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            Đề tài trong HĐ ({assignedTheses.length})
          </Typography>

          {duplicateThesisIds.size > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="caption">Trùng đề tài!</Typography>
            </Alert>
          )}

          {/* Available theses */}
          {!readonly && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                Thêm đề tài:
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, maxHeight: 200, overflowY: "auto" }}>
                {theses
                  .filter((t) => !assignedTheses.some((a) => a.id === t.id))
                  .map((thesis) => (
                    <Paper
                      key={thesis.id}
                      variant="outlined"
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        cursor: "pointer",
                        "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
                      }}
                      onClick={() => assignThesis(thesis)}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        {thesis.studentName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        {thesis.topicName.substring(0, 50)}...
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        GVHD: {thesis.lecturer}
                      </Typography>
                    </Paper>
                  ))}
                {theses.filter((t) => !assignedTheses.some((a) => a.id === t.id)).length === 0 && (
                  <Typography variant="caption" color="text.secondary">Tất cả đề tài đã được thêm.</Typography>
                )}
              </Box>
            </Box>
          )}

          {/* Assigned theses */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {assignedTheses.map((thesis, idx) => (
              <Paper
                key={thesis.id}
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  borderColor: duplicateThesisIds.has(thesis.id) ? "error.main" : "success.main",
                  borderLeft: "4px solid",
                  borderLeftColor: duplicateThesisIds.has(thesis.id) ? "error.main" : "success.main",
                  bgcolor: duplicateThesisIds.has(thesis.id) ? "error.50" : "success.50",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Chip label={`#${idx + 1}`} size="small" color="success" sx={{ height: 18, fontSize: "0.65rem" }} />
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        {thesis.studentName}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      {thesis.topicName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      GVHD: {thesis.lecturer}
                    </Typography>
                  </Box>
                  {!readonly && (
                    <IconButton size="small" color="error" onClick={() => removeThesis(thesis.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Paper>
            ))}

            {assignedTheses.length === 0 && (
              <Alert severity="info">
                <Typography variant="caption">
                  Chưa có đề tài nào. Thêm đề tài từ danh sách bên trên.
                </Typography>
              </Alert>
            )}
          </Box>
        </Box>
      </Box>

      {/* Save */}
      {!readonly && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={isValid ? <CheckIcon /> : undefined}
              onClick={handleSave}
              disabled={!isValid}
            >
              Lưu Hội đồng
            </Button>
            {!isValid && (
              <Typography variant="caption" color="text.secondary">
                Cần đủ 4 thành viên, không trùng GV, không trùng đề tài.
              </Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
