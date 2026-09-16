"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { INotification } from "@/shared/types/notification.types";
import { GripVertical } from "lucide-react";

interface SortableNotificationItemProps {
  notification: INotification;
  index: number;
  onSelect?: (id: number) => void;
}

function SortableNotificationItem({
  notification,
  index,
  onSelect,
}: SortableNotificationItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: notification.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "URGENT":
        return "bg-red-50 border-red-200";
      case "DIRECTIVE":
        return "bg-purple-50 border-purple-200";
      case "REMINDER":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 border rounded-lg ${getTypeColor(notification.type)} ${
        isDragging ? "shadow-lg" : "shadow-sm"
      } transition-all`}
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => onSelect?.(notification.id)}
        >
          <h3 className="font-semibold text-gray-900 truncate">
            {notification.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                notification.isRead
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {notification.isRead ? "Đã đọc" : "Chưa đọc"}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(notification.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NotificationDragDropProps {
  notifications: INotification[];
  onReorder: (reorderedNotifications: INotification[]) => void;
  onNotificationSelect?: (id: number) => void;
}

const NotificationDragDrop: React.FC<NotificationDragDropProps> = ({
  notifications,
  onReorder,
  onNotificationSelect,
}) => {
  const [items, setItems] = useState(notifications);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((n) => n.id === active.id);
      const newIndex = items.findIndex((n) => n.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        setItems(reorderedItems);
        onReorder(reorderedItems);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((n) => n.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {items.map((notification, index) => (
            <SortableNotificationItem
              key={notification.id}
              notification={notification}
              index={index}
              onSelect={onNotificationSelect}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default NotificationDragDrop;
