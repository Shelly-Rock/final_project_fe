"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { GripVertical } from "lucide-react";

export interface ResizableProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  enableResize?: {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
    topRight?: boolean;
    topLeft?: boolean;
    bottomRight?: boolean;
    bottomLeft?: boolean;
  };
  handleStyles?: {
    top?: React.CSSProperties;
    right?: React.CSSProperties;
    bottom?: React.CSSProperties;
    left?: React.CSSProperties;
    topRight?: React.CSSProperties;
    topLeft?: React.CSSProperties;
    bottomRight?: React.CSSProperties;
    bottomLeft?: React.CSSProperties;
  };
}

export function Resizable({
  children,
  width,
  height,
  minWidth = 100,
  maxWidth = Infinity,
  minHeight = 100,
  maxHeight = Infinity,
  defaultWidth = 300,
  defaultHeight = 200,
  enableResize = { right: true, bottom: true, bottomRight: true },
  handleStyles,
}: ResizableProps) {
  const [size, setSize] = useState({
    width: width || defaultWidth,
    height: height || defaultHeight,
  });
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{
    direction: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  const handleMouseDown = useCallback(
    (direction: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      resizeRef.current = {
        direction,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: size.width,
        startHeight: size.height,
      };
    },
    [size],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeRef.current || !isResizing) return;

      const { direction, startX, startY, startWidth, startHeight } =
        resizeRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      setSize((prev) => {
        let newWidth = prev.width;
        let newHeight = prev.height;

        if (direction.includes("right")) {
          newWidth = Math.min(
            maxWidth,
            Math.max(minWidth, startWidth + deltaX),
          );
        }
        if (direction.includes("left")) {
          newWidth = Math.min(
            maxWidth,
            Math.max(minWidth, startWidth - deltaX),
          );
        }
        if (direction.includes("bottom")) {
          newHeight = Math.min(
            maxHeight,
            Math.max(minHeight, startHeight + deltaY),
          );
        }
        if (direction.includes("top")) {
          newHeight = Math.min(
            maxHeight,
            Math.max(minHeight, startHeight - deltaY),
          );
        }

        return { width: newWidth, height: newHeight };
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeRef.current = null;
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth, minHeight, maxHeight]);

  const getHandle = (
    position: string,
    cursor: string,
    style?: React.CSSProperties,
  ) => {
    if (!enableResize[position as keyof typeof enableResize]) return null;
    return (
      <Box
        onMouseDown={handleMouseDown(position)}
        sx={{
          position: "absolute",
          cursor,
          ...(position.includes("top") && {
            top: 0,
            ...style,
            ...handleStyles?.top,
          }),
          ...(position.includes("bottom") && {
            bottom: 0,
            ...style,
            ...handleStyles?.bottom,
          }),
          ...(position.includes("left") && {
            left: 0,
            ...style,
            ...handleStyles?.left,
          }),
          ...(position.includes("right") && {
            right: 0,
            ...style,
            ...handleStyles?.right,
          }),
          ...(position === "topRight" && {
            top: 0,
            right: 0,
            ...style,
            ...handleStyles?.topRight,
          }),
          ...(position === "topLeft" && {
            top: 0,
            left: 0,
            ...style,
            ...handleStyles?.topLeft,
          }),
          ...(position === "bottomRight" && {
            bottom: 0,
            right: 0,
            ...style,
            ...handleStyles?.bottomRight,
          }),
          ...(position === "bottomLeft" && {
            bottom: 0,
            left: 0,
            ...style,
            ...handleStyles?.bottomLeft,
          }),
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: size.width,
        height: size.height,
        minWidth,
        minHeight,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
        userSelect: isResizing ? "none" : "auto",
      }}
    >
      {children}
      {getHandle("right", "ew-resize")}
      {getHandle("bottom", "ns-resize")}
      {getHandle("bottomRight", "nwse-resize")}
      {getHandle("top", "ns-resize")}
      {getHandle("left", "ew-resize")}
      {getHandle("topLeft", "nwse-resize")}
      {getHandle("topRight", "nesw-resize")}
      {getHandle("bottomLeft", "nesw-resize")}
    </Box>
  );
}
