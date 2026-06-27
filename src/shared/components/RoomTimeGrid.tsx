"use client";

import {
  Box,
  Typography,
  Paper,
  Chip,
  Tooltip,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Warning as WarningIcon,
  DragIndicator as DragIcon,
  Schedule as ScheduleIcon,
  Delete as DeleteIcon,
  AutoFixHigh as AutoIcon,
  MoreVert as MoreIcon,
  Room as RoomIcon,
} from "@mui/icons-material";
import { useState, useCallback, useMemo } from "react";
import { ConflictWarningBadge, type ConflictType } from "./ConflictWarningBadge";

export interface DefenseSlot {
  id: string;
  thesisId: string;
  studentName: string;
  topicName: string;
  room: string;
  time: string; // "08:00"
  duration: number; // minutes
  councilMembers?: string[];
  conflicts?: ConflictType[];
}

export interface TimeSlot {
  time: string;
  label: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
}

interface RoomTimeGridProps {
  rooms: Room[];
  timeSlots: TimeSlot[];
  slots: DefenseSlot[];
  onSlotMove?: (slotId: string, newRoom: string, newTime: string) => void;
  onSlotRemove?: (slotId: string) => void;
  onAutoArrange?: () => void;
  readonly?: boolean;
}

const SLOT_HEIGHT = 60; // px per 15 min

export function RoomTimeGrid({
  rooms,
  timeSlots,
  slots,
  onSlotMove,
  onSlotRemove,
  onAutoArrange,
  readonly = false,
}: RoomTimeGridProps) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<{ room: string; time: string } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ anchor: HTMLElement; slotId: string } | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Conflict detection
  const conflicts = useMemo(() => {
    const map: Record<string, DefenseSlot[]> = {};
    slots.forEach((slot) => {
      const key = `${slot.room}-${slot.time}`;
      if (!map[key]) map[key] = [];
      map[key].push(slot);
    });
    return Object.entries(map)
      .filter(([, list]) => list.length > 1)
      .flatMap(([, list]) => list)
      .map((s) => s.id);
  }, [slots]);

  const getSlotAt = useCallback(
    (roomId: string, time: string) =>
      slots.find((s) => s.room === roomId && s.time === time),
    [slots]
  );

  const handleDragStart = useCallback((e: React.DragEvent, slotId: string) => {
    if (readonly) return;
    e.dataTransfer.setData("slotId", slotId);
    setDragging(slotId);
  }, [readonly]);

  const handleDragOver = useCallback((e: React.DragEvent, room: string, time: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver({ room, time });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, room: string, time: string) => {
      e.preventDefault();
      const slotId = e.dataTransfer.getData("slotId");
      if (slotId && onSlotMove) {
        onSlotMove(slotId, room, time);
      }
      setDragging(null);
      setDragOver(null);
    },
    [onSlotMove]
  );

  const handleDragEnd = useCallback(() => {
    setDragging(null);
    setDragOver(null);
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent, slotId: string) => {
    e.preventDefault();
    setContextMenu({ anchor: e.currentTarget as HTMLElement, slotId });
  }, []);

  const slotColor = (slot: DefenseSlot) => {
    if (conflicts.includes(slot.id)) return "error";
    return "primary";
  };

  const COLS = rooms.length + 1;
  const ROWS = timeSlots.length + 1;

  return (
    <Box sx={{ overflowX: "auto" }}>
      {/* Controls */}
      {!readonly && (
        <Box sx={{ display: "flex", gap: 1, mb: 2, justifyContent: "flex-end" }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AutoIcon />}
            onClick={onAutoArrange}
          >
            Tự động xếp
          </Button>
        </Box>
      )}

      {/* Grid */}
      <Paper variant="outlined" sx={{ minWidth: 600, overflow: "hidden" }}>
        {/* Header row */}
        <Box sx={{ display: "grid", gridTemplateColumns: `80px repeat(${rooms.length}, 1fr)`, borderBottom: "2px solid", borderColor: "divider" }}>
          {/* Corner */}
          <Box sx={{ p: 1, bgcolor: "grey.100", display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid", borderColor: "divider" }}>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>Giờ / Phòng</Typography>
          </Box>
          {/* Rooms */}
          {rooms.map((room) => (
            <Box
              key={room.id}
              sx={{
                p: 1,
                bgcolor: "primary.50",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRight: "1px solid",
                borderColor: "divider",
                "&:last-child": { borderRight: "none" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <RoomIcon sx={{ fontSize: 14, color: "primary.main" }} />
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {room.name}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {room.capacity} chỗ
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Time rows */}
        {timeSlots.map((slot) => {
          return (
            <Box
              key={slot.time}
              sx={{
                display: "grid",
                gridTemplateColumns: `80px repeat(${rooms.length}, 1fr)`,
                borderBottom: "1px solid",
                borderColor: "divider",
                minHeight: SLOT_HEIGHT,
              }}
            >
              {/* Time label */}
              <Box
                sx={{
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRight: "1px solid",
                  borderColor: "divider",
                  bgcolor: "grey.50",
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: "monospace" }}>
                  {slot.time}
                </Typography>
              </Box>

              {/* Room cells */}
              {rooms.map((room) => {
                const defenseSlot = getSlotAt(room.id, slot.time);
                const isDragOverThis =
                  dragOver?.room === room.id && dragOver?.time === slot.time;
                const hasConflict = defenseSlot && conflicts.includes(defenseSlot.id);

                return (
                  <Box
                    key={`${room.id}-${slot.time}`}
                    onDragOver={(e) => handleDragOver(e, room.id, slot.time)}
                    onDrop={(e) => handleDrop(e, room.id, slot.time)}
                    onClick={() => setSelectedSlot(defenseSlot?.id ?? null)}
                    sx={{
                      p: 0.5,
                      borderRight: "1px solid",
                      borderColor: "divider",
                      "&:last-child": { borderRight: "none" },
                      bgcolor: isDragOverThis
                        ? "action.dragOver"
                        : hasConflict
                        ? "error.50"
                        : "background.paper",
                      transition: "background 0.2s",
                      cursor: readonly ? "default" : "pointer",
                      minHeight: SLOT_HEIGHT,
                      "&:hover": readonly ? {} : { bgcolor: "action.hover" },
                      position: "relative",
                    }}
                  >
                    {/* Conflict highlight border */}
                    {hasConflict && (
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          border: "2px solid",
                          borderColor: "error.main",
                          borderRadius: 1,
                          pointerEvents: "none",
                        }}
                      />
                    )}

                    {/* Drag over highlight */}
                    {isDragOverThis && !defenseSlot && (
                      <Box
                        sx={{
                          height: "100%",
                          border: "2px dashed",
                          borderColor: "primary.main",
                          borderRadius: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700 }}>
                          Thả vào đây
                        </Typography>
                      </Box>
                    )}

                    {/* Defense slot */}
                    {defenseSlot && (
                      <Paper
                        draggable={!readonly}
                        onDragStart={(e) => handleDragStart(e, defenseSlot.id)}
                        onDragEnd={handleDragEnd}
                        onContextMenu={(e) => handleContextMenu(e, defenseSlot.id)}
                        elevation={selectedSlot === defenseSlot.id ? 4 : 1}
                        sx={{
                          p: 0.75,
                          height: "100%",
                          border: "1px solid",
                          borderColor: "primary.main",
                          borderRadius: 1,
                          cursor: readonly ? "default" : "grab",
                          "&:active": { cursor: "grabbing" },
                          opacity: dragging === defenseSlot.id ? 0.4 : 1,
                          bgcolor: `${slotColor(defenseSlot)}.50`,
                          transition: "opacity 0.2s",
                          overflow: "hidden",
                        }}
                      >
                        {/* Conflict badge */}
                        {hasConflict && (
                          <Box sx={{ mb: 0.5 }}>
                            <ConflictWarningBadge conflicts={["room", "time"]} />
                          </Box>
                        )}

                        {/* Content */}
                        <Box sx={{ display: "flex", gap: 0.5, height: "100%" }}>
                          {!readonly && (
                            <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                              <DragIcon sx={{ fontSize: 14 }} />
                            </Box>
                          )}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Tooltip title={defenseSlot.studentName}>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 700,
                                  display: "block",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  fontSize: "0.7rem",
                                }}
                              >
                                {defenseSlot.studentName}
                              </Typography>
                            </Tooltip>
                            <Tooltip title={defenseSlot.topicName}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: "block",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  fontSize: "0.65rem",
                                }}
                              >
                                {defenseSlot.topicName.substring(0, 30)}...
                              </Typography>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Paper>
                    )}
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Paper>

      {/* Context menu */}
      <Menu
        open={contextMenu !== null}
        anchorEl={contextMenu?.anchor}
        onClose={() => setContextMenu(null)}
      >
        <MenuItem
          onClick={() => {
            if (contextMenu?.slotId) {
              const slot = slots.find((s) => s.id === contextMenu.slotId);
              if (slot) {
                navigator.clipboard.writeText(`${slot.studentName} — ${slot.time} — ${slot.room}`);
              }
            }
            setContextMenu(null);
          }}
        >
          <ScheduleIcon sx={{ mr: 1, fontSize: 18 }} />
          Sao chép thông tin
        </MenuItem>
        {!readonly && onSlotRemove && (
          <MenuItem
            onClick={() => {
              if (contextMenu?.slotId) {
                onSlotRemove(contextMenu.slotId);
              }
              setContextMenu(null);
            }}
            sx={{ color: "error.main" }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
            Xóa khỏi lịch
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}
