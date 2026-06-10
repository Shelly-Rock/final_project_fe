import type { ReactNode, CSSProperties, RefObject } from "react";
import type { ID } from "./base";
import type { JSX } from "react";
// ---------- Composition ----------
export type WithChildren<T = Record<string, never>> = T & {
  children?: ReactNode;
};
export type WithClassName<T = Record<string, never>> = T & {
  className?: string;
};
export type WithStyle<T = Record<string, never>> = T & {
  style?: CSSProperties;
};

export type ComponentProps<T extends keyof JSX.IntrinsicElements = "div"> =
  JSX.IntrinsicElements[T] & { children?: ReactNode };

// ---------- Convenience combos ----------
export type StandardProps = WithChildren<WithClassName<WithStyle>>;

// ---------- Page / Layout props ----------
export interface PageProps<P = Record<string, unknown>> {
  params?: P;
  searchParams?: Record<string, string | string[] | undefined>;
}

export interface LayoutProps {
  children: ReactNode;
}

// ---------- Generic list item ----------
export interface ListItem {
  id: ID;
  label: string;
  value?: string | number;
  disabled?: boolean;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  group?: string;
}

// ---------- Action / Callback ----------
export type VoidFn = () => void;
export type AsyncFn<T = void> = (...args: unknown[]) => Promise<T>;
export type EventFn<T = unknown> = (event: T) => void;

// ---------- Ref forward ----------
export type ElementRef<T = HTMLElement> = RefObject<T | null>;
export type ElementRefOrNull<T = HTMLElement> = RefObject<T | null>;

// ---------- Modal / Drawer state ----------
export interface ModalState {
  open: boolean;
  loading?: boolean;
}

export type OpenModalFn = (id?: ID) => void;
export type CloseModalFn = VoidFn;

// ---------- Server Action (Next.js App Router) ----------
export interface ActionState<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export type ServerAction<T = unknown> = (
  prevState: ActionState<T>,
  formData: FormData,
) => Promise<ActionState<T>>;
