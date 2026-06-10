import React from "react";
/**
 * Check có phải browser environment không
 */
export const isBrowser = (): boolean => {
  return typeof window !== "undefined" && typeof document !== "undefined";
};

/**
 * Check có phải server environment không
 */
export const isServer = (): boolean => {
  return typeof window === "undefined" || typeof document === "undefined";
};

/**
 * Check có phải development environment không
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === "development";
};

/**
 * Check có phải production environment không
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === "production";
};

/**
 * Check có phải test environment không
 */
export const isTest = (): boolean => {
  return process.env.NODE_ENV === "test";
};

/**
 * Get current environment
 */
export const getEnvironment = (): string => {
  return process.env.NODE_ENV ?? "development";
};

/**
 * Check có phải Next.js không
 */
export const isNextJS = (): boolean => {
  return isBrowser() && "__NEXT_DATA__" in window;
};

/**
 * Check có phải React environment không
 */
export const isReact = (): boolean => {
  return typeof React !== "undefined";
};
