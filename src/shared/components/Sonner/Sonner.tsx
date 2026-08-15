"use client";

import { Toaster as SonnerToaster } from "sonner";

export interface SonnerProps {
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  richColors?: boolean;
  expand?: boolean;
  duration?: number;
  theme?: "light" | "dark" | "system";
  closeButton?: boolean;
}

export function Sonner({
  position = "top-right",
  richColors = true,
  expand = false,
  duration = 4000,
  theme = "light",
  closeButton = true,
}: SonnerProps) {
  return (
    <SonnerToaster
      position={position}
      richColors={richColors}
      expand={expand}
      duration={duration}
      theme={theme}
      closeButton={closeButton}
    />
  );
}

export { toast } from "sonner";

export const toastConfig = {
  success: (message: string, description?: string) => ({
    message,
    description,
    type: "success" as const,
  }),
  error: (message: string, description?: string) => ({
    message,
    description,
    type: "error" as const,
  }),
  info: (message: string, description?: string) => ({
    message,
    description,
    type: "info" as const,
  }),
  warning: (message: string, description?: string) => ({
    message,
    description,
    type: "warning" as const,
  }),
};
