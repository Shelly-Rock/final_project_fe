"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Description as FileIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { PageHeader, FilterBar } from "@/shared/components";
import { mockDocuments, typeColors } from "@/feature/document/constants";

export default function DocumentPage() {
  const [search, setSearch] = useState("");

  const filteredDocuments = mockDocuments.filter(
    (doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Tài liệu"
        subtitle="Quản lý tài liệu và biểu mẫu"
        actions={
          <Button variant="contained" startIcon={<AddIcon />}>
            Tải lên
          </Button>
        }
      />

      <FilterBar
        totalCount={mockDocuments.length}
        filteredCount={filteredDocuments.length}
      >
        <TextField
          size="small"
          placeholder="Tìm kiếm tài liệu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </FilterBar>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockDocuments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng tài liệu
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockDocuments.reduce((sum, d) => sum + d.downloadCount, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lượt tải xuống
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {new Set(mockDocuments.map((d) => d.category)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Danh mục
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <List>
          {filteredDocuments.map((doc) => (
            <ListItem
              key={doc.id}
              sx={{
                borderBottom: "1px solid",
                borderColor: "divider",
                "&:last-child": { borderBottom: "none" },
              }}
            >
              <ListItemIcon>
                <FileIcon color="action" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {doc.name}
                    <Chip
                      label={doc.type.toUpperCase()}
                      size="small"
                      color={typeColors[doc.type] ?? "default"}
                    />
                    <Chip
                      label={doc.category}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={`${doc.size} • ${doc.uploadDate} • ${doc.downloadCount} lượt tải`}
              />
              <ListItemSecondaryAction>
                <Button size="small" startIcon={<DownloadIcon />}>
                  Tải
                </Button>
                <IconButton size="small">
                  <EditIcon />
                </IconButton>
                <IconButton size="small" color="error">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Card>
    </Box>
  );
}
