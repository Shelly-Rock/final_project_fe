"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import {
  DragIndicator as DragIcon,
  ArrowUpward as UpIcon,
  ArrowDownward as DownIcon,
} from "@mui/icons-material";
import { useState, useCallback } from "react";

export interface PriorityItem {
  id: string;
  label: string;
  sublabel?: string;
  avatar?: string;
  meta?: Record<string, string | number>;
}

interface PriorityDragListProps {
  items: PriorityItem[];
  onReorder: (items: PriorityItem[]) => void;
  priorityLabel?: string;
  emptyMessage?: string;
  maxItems?: number;
  showIndex?: boolean;
}

function SortableItem({
  item,
  index,
  showIndex,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  item: PriorityItem;
  index: number;
  showIndex?: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = ["success", "info", "warning", "default", "secondary", "error"];
          const color = (priorityColors[index] ?? "default") as "success" | "info" | "warning" | "default";

  return (
    <Box ref={setNodeRef} style={style}>
      <Card
        sx={{
          mb: 1,
          border: "1px solid",
          borderColor: isDragging ? "primary.main" : "divider",
          boxShadow: isDragging ? 4 : 0,
          borderLeft: "4px solid",
          borderLeftColor: `${color}.main`,
          bgcolor: isDragging ? "action.hover" : "background.paper",
          transition: "all 0.2s",
        }}
        elevation={isDragging ? 4 : 0}
      >
        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 }, display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Drag handle */}
          <Box
            {...attributes}
            {...listeners}
            sx={{
              cursor: "grab",
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
              "&:active": { cursor: "grabbing" },
            }}
          >
            <DragIcon />
          </Box>

          {/* Index */}
          {showIndex && (
            <Chip
              label={`#${index + 1}`}
              size="small"
              color={color}
              sx={{ fontWeight: 800, fontSize: "0.75rem", minWidth: 36 }}
            />
          )}

          {/* Avatar */}
          {item.avatar ? (
            <Avatar src={item.avatar} sx={{ width: 32, height: 32 }} />
          ) : (
            <Avatar sx={{ width: 32, height: 32, bgcolor: `${color}.main`, fontSize: "0.75rem" }}>
              {item.label.charAt(0)}
            </Avatar>
          )}

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </Typography>
            {item.sublabel && (
              <Typography variant="caption" color="text.secondary">
                {item.sublabel}
              </Typography>
            )}
            {item.meta && (
              <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                {Object.entries(item.meta).map(([key, val]) => (
                  <Typography key={key} variant="caption" color="text.secondary">
                    {key}: {val}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>

          {/* Arrow buttons */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <IconButton
              size="small"
              onClick={onMoveUp}
              disabled={isFirst}
              sx={{ p: 0.25 }}
            >
              <UpIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={onMoveDown}
              disabled={isLast}
              sx={{ p: 0.25 }}
            >
              <DownIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export function PriorityDragList({
  items,
  onReorder,
  priorityLabel = "Thứ tự ưu tiên",
  emptyMessage = "Chưa có nguyện vọng nào",
  maxItems,
  showIndex = true,
}: PriorityDragListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        onReorder(arrayMove(items, oldIndex, newIndex));
      }
    },
    [items, onReorder]
  );

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index === 0) return;
      onReorder(arrayMove(items, index, index - 1));
    },
    [items, onReorder]
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index === items.length - 1) return;
      onReorder(arrayMove(items, index, index + 1));
    },
    [items, onReorder]
  );

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;

  if (items.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 4,
          color: "text.secondary",
          border: "2px dashed",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Typography variant="body2">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {priorityLabel}
          {maxItems && (
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              (tối đa {maxItems})
            </Typography>
          )}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Kéo thả hoặc dùng ▲▼ để sắp xếp
        </Typography>
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item, index) => (
            <SortableItem
              key={item.id}
              item={item}
              index={index}
              showIndex={showIndex}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              isFirst={index === 0}
              isLast={index === items.length - 1}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {activeItem ? (
            <Card
              sx={{
                border: "2px solid",
                borderColor: "primary.main",
                boxShadow: 6,
                borderLeft: "4px solid primary.main",
              }}
            >
              <CardContent sx={{ py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
                <DragIcon />
                <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "0.75rem" }}>
                  {activeItem.label.charAt(0)}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {activeItem.label}
                </Typography>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Box>
  );
}
