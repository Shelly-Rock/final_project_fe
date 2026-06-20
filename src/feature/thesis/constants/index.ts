// Re-export types
export * from "../types";

// Helper functions for score handling
export function getScoreColorSafe(
  score: number | undefined | null
): "default" | "success" | "info" | "warning" | "error" {
  if (score == null || score === 0) return "default";
  if (score >= 8.5) return "success";
  if (score >= 7) return "info";
  if (score >= 5) return "warning";
  return "error";
}

// Export mock data
export * from "./mockTheses";
export * from "./mockTopics";
export * from "./mockSubmissions";
export * from "./mockReviews";
export * from "./mockScores";
export * from "./mockDefenses";
export * from "./mockRegistrations";
export * from "./mockMilestones";
export * from "./mockWeeklyReports";
export * from "./mockScoreDetails";
export * from "./mockDefenseSchedules";
export * from "./mockExceptions";
export * from "./mockNotifications";
export * from "./mockStatistics";
