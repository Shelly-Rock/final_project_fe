"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { PageHeader } from "@/shared/components";
import { mockRoles } from "@/feature/role/constants";

export default function RolePage() {
  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Vai trò"
        subtitle="Quản lý vai trò và phân quyền người dùng"
        actions={
          <Button variant="contained" startIcon={<AddIcon />}>
            Thêm vai trò
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {mockRoles.map((role) => (
          <Grid item xs={12} md={6} key={role.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Chip
                      label={role.name}
                      color={role.color}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="h6">{role.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {role.description}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Button size="small" startIcon={<EditIcon />}>
                      Sửa
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {role.userCount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Người dùng
                    </Typography>
                  </Box>
                  <Box sx={{ borderLeft: 1, borderColor: "divider", pl: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      Quyền hạn:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {role.permissions.slice(0, 3).map((p) => (
                        <Chip
                          key={p}
                          label={p}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {role.permissions.length > 3 && (
                        <Chip
                          label={`+${role.permissions.length - 3}`}
                          size="small"
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Danh sách quyền hạn chi tiết
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {mockRoles.length} vai trò với tổng{" "}
            {mockRoles.reduce((sum, r) => sum + r.permissions.length, 0)} quyền
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
