"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { toast } from "sonner";

interface RecipientGroup {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  members: number[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const RecipientGroupManager: React.FC = () => {
  const [groups, setGroups] = useState<RecipientGroup[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<RecipientGroup | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    members: [] as number[],
    isDefault: false,
  });

  useEffect(() => {
    loadGroups();
    loadUsers();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const data = await notificationApi.getRecipientGroups();
      setGroups([]);
    } catch (error) {
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      // TODO: Replace with actual API call
      // const data = await notificationApi.getUsers();
      setUsers([]);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const handleOpenDialog = (group?: RecipientGroup) => {
    if (group) {
      setSelectedGroup(group);
      setFormData({
        name: group.name,
        description: group.description,
        members: group.members,
        isDefault: group.isDefault,
      });
    } else {
      setSelectedGroup(null);
      setFormData({
        name: "",
        description: "",
        members: [],
        isDefault: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGroup(null);
  };

  const handleSaveGroup = async () => {
    if (!formData.name.trim()) {
      toast.error("Group name is required");
      return;
    }

    if (formData.members.length === 0) {
      toast.error("Select at least one member");
      return;
    }

    setLoading(true);
    try {
      if (selectedGroup) {
        // TODO: Replace with actual API call
        // await notificationApi.updateRecipientGroup(selectedGroup.id, formData);
        toast.success("Group updated successfully");
      } else {
        // TODO: Replace with actual API call
        // await notificationApi.createRecipientGroup(formData);
        toast.success("Group created successfully");
      }
      loadGroups();
      handleCloseDialog();
    } catch (error) {
      toast.error("Failed to save group");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (!confirm("Are you sure you want to delete this group?")) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await notificationApi.deleteRecipientGroup(groupId);
      toast.success("Group deleted successfully");
      loadGroups();
    } catch (error) {
      toast.error("Failed to delete group");
    } finally {
      setLoading(false);
    }
  };

  const handleMemberToggle = (userId: number) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter((id) => id !== userId)
        : [...prev.members, userId],
    }));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <PeopleIcon sx={{ fontSize: 28 }} color="primary" />
          <Typography variant="h4" fontWeight={600}>
            Recipient Groups
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Group
        </Button>
      </Box>

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Groups
              </Typography>
              <Typography variant="h5">{groups.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Default Groups
              </Typography>
              <Typography variant="h5">
                {groups.filter((g) => g.isDefault).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Members
              </Typography>
              <Typography variant="h5">
                {groups.reduce((sum, g) => sum + g.memberCount, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Groups Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell sx={{ fontWeight: 600 }}>Group Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Members
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Default</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No recipient groups yet
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              groups.map((group) => (
                <TableRow key={group.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{group.name}</TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    {group.description}
                  </TableCell>
                  <TableCell align="right">
                    <Chip label={group.memberCount} size="small" />
                  </TableCell>
                  <TableCell>
                    {group.isDefault ? (
                      <Chip label="Default" color="primary" size="small" />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(group)}
                      title="Edit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteGroup(group.id)}
                      title="Delete"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedGroup ? `Edit Group: ${selectedGroup.name}` : "Create New Group"}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
            <TextField
              label="Group Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              fullWidth
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              multiline
              rows={2}
              fullWidth
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isDefault: e.target.checked,
                    }))
                  }
                />
              }
              label="Set as default group"
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Select Members ({formData.members.length})
              </Typography>
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  p: 2,
                  maxHeight: 300,
                  overflow: "auto",
                }}
              >
                {users.length === 0 ? (
                  <Typography color="text.secondary">No users available</Typography>
                ) : (
                  users.map((user) => (
                    <FormControlLabel
                      key={user.id}
                      control={
                        <Checkbox
                          checked={formData.members.includes(user.id)}
                          onChange={() => handleMemberToggle(user.id)}
                        />
                      }
                      label={`${user.name} (${user.email})`}
                      sx={{ display: "block", mb: 1 }}
                    />
                  ))
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveGroup}
            disabled={loading}
          >
            {loading ? "Saving..." : selectedGroup ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecipientGroupManager;
