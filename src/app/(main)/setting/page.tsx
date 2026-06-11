"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from "@mui/material";
import {
  Save as SaveIcon,
  Settings as SettingsIcon,
  Notifications as NotifyIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { PageHeader } from "@/shared/components";

export default function SettingPage() {
  const [settings, setSettings] = useState({
    siteName: "Thesis Manager",
    siteDescription: "Hệ thống quản lý đồ án tốt nghiệp",
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    autoBackup: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  });

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Cài đặt"
        subtitle="Cấu hình hệ thống"
        actions={
          <Button variant="contained" startIcon={<SaveIcon />}>
            Lưu thay đổi
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <SettingsIcon color="primary" />
                <Typography variant="h6">Cấu hình chung</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Tên hệ thống"
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  label="Mô tả"
                  value={settings.siteDescription}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      siteDescription: e.target.value,
                    })
                  }
                  fullWidth
                  multiline
                  rows={2}
                />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <NotifyIcon color="primary" />
                <Typography variant="h6">Thông báo</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          emailNotifications: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Thông báo qua email"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pushNotifications: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Thông báo đẩy"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.weeklyReport}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          weeklyReport: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Báo cáo hàng tuần"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <SecurityIcon color="primary" />
                <Typography variant="h6">Bảo mật</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoBackup}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          autoBackup: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Sao lưu tự động"
                />
                <TextField
                  label="Thời gian chờ phiên (phút)"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sessionTimeout: parseInt(e.target.value),
                    })
                  }
                  fullWidth
                  inputProps={{ min: 5, max: 120 }}
                />
                <TextField
                  label="Số lần đăng nhập tối đa"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxLoginAttempts: parseInt(e.target.value),
                    })
                  }
                  fullWidth
                  inputProps={{ min: 3, max: 10 }}
                />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Hành động hệ thống
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button variant="outlined" fullWidth>
                  Xuất dữ liệu
                </Button>
                <Button variant="outlined" fullWidth>
                  Nhập dữ liệu
                </Button>
                <Divider />
                <Button variant="outlined" color="warning" fullWidth>
                  Xóa cache
                </Button>
                <Button variant="outlined" color="error" fullWidth>
                  Khôi phục mặc định
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ mt: 3 }}>
        Các thay đổi cài đặt sẽ có hiệu lực ngay lập tức. Một số cài đặt có thể
        yêu cầu đăng nhập lại.
      </Alert>
    </Box>
  );
}
