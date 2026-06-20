"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Paper,
  Autocomplete,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { mockCouncilMembers } from "@/feature/thesis/constants";
import type { DefenseSchedule, CouncilMember } from "@/feature/thesis/types";

interface DefenseScheduleFormProps {
  open: boolean;
  schedule?: DefenseSchedule;
  onClose: () => void;
  onSave: (schedule: DefenseSchedule) => void;
}

const availableMembers = mockCouncilMembers;

export function DefenseScheduleForm({
  open,
  schedule,
  onClose,
  onSave,
}: DefenseScheduleFormProps) {
  const [formData, setFormData] = useState({
    room: schedule?.room || "",
    date: schedule?.date || "",
    timeSlot: schedule?.timeSlot || "",
    councilName: schedule?.councilName || "",
    councilMembers: schedule?.councilMembers || [],
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addMember = (member: CouncilMember) => {
    if (!formData.councilMembers.find((m) => m.id === member.id)) {
      setFormData((prev) => ({
        ...prev,
        councilMembers: [...prev.councilMembers, member],
      }));
    }
  };

  const removeMember = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      councilMembers: prev.councilMembers.filter((m) => m.id !== memberId),
    }));
  };

  const handleSave = () => {
    onSave({
      id: schedule?.id || `ds-${Date.now()}`,
      room: formData.room,
      date: formData.date,
      timeSlot: formData.timeSlot,
      councilId: schedule?.councilId || `council-${Date.now()}`,
      councilName: formData.councilName,
      councilMembers: formData.councilMembers,
      defenses: schedule?.defenses || [],
    });
    onClose();
  };

  const isValid =
    formData.room &&
    formData.date &&
    formData.timeSlot &&
    formData.councilName &&
    formData.councilMembers.length >= 3;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {schedule ? "Chỉnh sửa lịch bảo vệ" : "Tạo lịch bảo vệ mới"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Phòng"
              value={formData.room}
              onChange={(e) => handleChange("room", e.target.value)}
              placeholder="VD: A101"
              sx={{ flex: 1 }}
            />
            <TextField
              label="Ngày"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
          </Box>

          <TextField
            label="Ca bảo vệ"
            value={formData.timeSlot}
            onChange={(e) => handleChange("timeSlot", e.target.value)}
            placeholder="VD: 08:00 - 10:00"
            helperText="Thời gian bắt đầu và kết thúc buổi bảo vệ"
          />

          <TextField
            label="Tên hội đồng"
            value={formData.councilName}
            onChange={(e) => handleChange("councilName", e.target.value)}
            placeholder="VD: Hội đồng chấm bảo vệ số 1"
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Thành viên hội đồng (tối thiểu 3 người)
            </Typography>

            {/* Selected Members */}
            <Paper sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}>
              <Stack spacing={1}>
                {formData.councilMembers.map((member) => (
                  <Box
                    key={member.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1,
                      bgcolor: "background.paper",
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                        {member.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">{member.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {member.department}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={
                          member.role === "chairman"
                            ? "Chủ tịch"
                            : member.role === "secretary"
                              ? "Thư ký"
                              : "Thành viên"
                        }
                        size="small"
                      />
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeMember(member.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
                {formData.councilMembers.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Chưa có thành viên nào
                  </Typography>
                )}
              </Stack>
            </Paper>

            {/* Add Member */}
            <Autocomplete
              options={availableMembers.filter(
                (m) => !formData.councilMembers.find((cm) => cm.id === m.id)
              )}
              getOptionLabel={(option) => option.name}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: 14 }}>
                    {option.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.department}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Thêm thành viên"
                  placeholder="Tìm kiếm giảng viên..."
                />
              )}
              onChange={(_, value) => value && addMember(value)}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!isValid}
        >
          Lưu lịch
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import { useState } from "react";
