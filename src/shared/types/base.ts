export type ID = string | number;
export type Timestamp = number; // Unix ms
export type DateString = string; // ISO 8601
export type UUID = string;

// ---------- Nullable / Optional ----------
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Maybe<T> = T | null | undefined;
export type NonEmptyArray<T> = [T, ...T[]];

// ---------- Literal string/number ----------
export type StringLiteral<T> = T extends string
  ? string extends T
    ? never
    : T
  : never;
export type NumericLiteral<T> = T extends number
  ? number extends T
    ? never
    : T
  : never;

// ---------- Entity base ----------
export interface Entity {
  id: ID;
  createdAt: DateString;
  updatedAt: DateString;
}

export interface SoftDeletable extends Entity {
  deletedAt: Nullable<DateString>;
}

// ---------- Status / Enum-like ----------
export type Status = "active" | "inactive" | "suspended" | "pending";
export type SortDirection = "asc" | "desc";
export type Booleanish = true | false | "true" | "false";

// ---------- Record / Key-value ----------
export type StringRecord = Record<string, string>;
export type NumberRecord = Record<string, number>;
export type BoolRecord = Record<string, boolean>;
export type UnknownRecord = Record<string, unknown>;
