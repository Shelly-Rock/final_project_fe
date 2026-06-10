import type { ID, DateString, UnknownRecord } from "./base";
import type { PaginationMeta } from "./pagination";

// ---------- HTTP primitives ----------
export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";
export type HttpStatus = number;
export type HttpHeaders = Record<string, string>;

// ---------- API response ----------
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  statusCode: HttpStatus;
}

export interface ApiListResponse<T = unknown> extends ApiResponse<T[]> {
  meta?: PaginationMeta;
}

// ---------- API error ----------
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: HttpStatus;
  details?: UnknownRecord;
  timestamp?: DateString;
}

export interface ApiErrorResponse {
  error: ApiError;
}

// ---------- Request config ----------
export interface ApiRequestConfig {
  method?: HttpMethod;
  headers?: HttpHeaders;
  params?: UnknownRecord;
  data?: unknown;
  timeout?: number;
  baseUrl?: string;
}

// ---------- Auth token shape ----------
export interface TokenPayload {
  sub: ID;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

// ---------- Upload ----------
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type UploadStatus = "idle" | "uploading" | "success" | "error";
