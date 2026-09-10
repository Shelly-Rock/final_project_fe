// ============================================================
// TYPES — Project Governance & Managed Topics
// ============================================================

export type DeadlineType =
  | "TOPIC_CREATION"
  | "STUDENT_REGISTRATION"
  | "TEACHER_APPROVAL"
  | "PERIODIC_REPORT"
  | "FINAL_SUBMISSION";

export type AlertEvent = "DUE_IN_3_DAYS" | "DUE_IN_1_DAY" | "EXPIRED";
export type AlertStatus = "PROCESSING" | "SENT" | "FAILED";
export type AlertRecipientRole = "TEACHER" | "STUDENT" | "SECRETARY";
export type TopicStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ProjectStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "WAITING_SECRETARY"
  | "ASSIGNED";
export type GovernanceStageState = "DISABLED" | "CLOSED" | "UPCOMING" | "OPEN";
export type TopicSortBy = "code" | "name" | "teacher" | "status" | "createdAt";
export type SortOrder = "asc" | "desc";
export type TopicAuditAction =
  | "FORCE_UPDATE"
  | "BULK_APPROVE"
  | "BULK_REJECT"
  | "MANUAL_ASSIGN"
  | "SUPPLEMENTAL_CREATE"
  | "CODE_GENERATE"
  | "CREATE"
  | "UPDATE"
  | "REGISTRATION_APPROVE"
  | "REGISTRATION_REJECT"
  | "DELETE";

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Đợt đồ án ở dạng tối thiểu, đủ cho selector — tránh phụ thuộc chéo feature. */
export interface PeriodOption {
  id: number;
  name: string;
  semester: string;
  schoolYear: string;
  status: string;
}

export interface GovernanceConfig {
  id: number;
  periodId: number;
  defaultTopicLimit: number;
  maxTopicLimit: number;
  maxStudentsPerTopic: number;
  alertsEnabled: boolean;
  alertOffsetsDays: number[];
  lastAlertRunAt: string | null;
  updatedByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PeriodDeadline {
  id: number;
  periodId: number;
  type: DeadlineType;
  seq: number;
  label: string;
  deadlineAt: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GovernanceStage {
  id: number;
  type: DeadlineType;
  seq: number;
  label: string;
  deadlineAt: string;
  enabled: boolean;
  state: GovernanceStageState;
  remainingMs: number;
}

export interface GovernanceLocks {
  topicWritable: boolean;
  registrationOpen: boolean;
  approvalOpen: boolean;
  reportOpen: boolean;
  finalSubmissionOpen: boolean;
}

export interface GovernanceView {
  periodId: number;
  config: Pick<
    GovernanceConfig,
    | "defaultTopicLimit"
    | "maxTopicLimit"
    | "maxStudentsPerTopic"
    | "alertsEnabled"
    | "alertOffsetsDays"
    | "lastAlertRunAt"
  >;
  stages: GovernanceStage[];
  locks: GovernanceLocks;
  serverTime: string;
}

export interface AlertStats {
  lastRunAt: string | null;
  processing: number;
  sent: number;
  failed: number;
}

export interface GovernanceConfigResponse {
  config: GovernanceConfig;
  deadlines: PeriodDeadline[];
  alertStats: AlertStats;
  governance: GovernanceView;
}

export interface PeriodDeadlineInput {
  type: DeadlineType;
  seq: number;
  label: string;
  deadlineAt: string;
  enabled: boolean;
}

export interface UpdateGovernanceConfigInput {
  periodId: number;
  defaultTopicLimit: number;
  maxTopicLimit: number;
  maxStudentsPerTopic: number;
  alertsEnabled: boolean;
  alertOffsetsDays: number[];
  deadlines: PeriodDeadlineInput[];
}

export interface TeacherOverrideConfig {
  defaultTopicLimit: number;
  maxTopicLimit: number;
  maxStudentsPerTopic: number;
}

export interface TeacherOverrideRow {
  id: number;
  teacher_id: string;
  name: string;
  email: string;
  faculty_id: string | null;
  department_id: string | null;
  faculty: { id: string; name: string } | null;
  department: { id: string; name: string } | null;
  assignedQuota: number;
  submittedTopics: number;
  remainingTopics: number;
  maxStudents: number;
  isOverride: boolean;
  status: "SUFFICIENT" | "INSUFFICIENT";
  lastNotifiedAt: string | null;
}

export interface TeacherOverridePage {
  items: TeacherOverrideRow[];
  total: number;
  page: number;
  limit: number;
  config: TeacherOverrideConfig;
}

export interface ListTeacherOverridesParams {
  periodId: number;
  search?: string;
  facultyId?: string;
  departmentId?: string;
  page?: number;
  limit?: number;
}

export interface UpsertTeacherOverridesInput {
  periodId: number;
  teacherIds: number[];
  assignedQuota: number;
  maxStudentsPerTopic?: number;
}

export interface TeacherQuotaRecord {
  id: number;
  period_id: number;
  teacher_id: number;
  assigned_quota: number;
  submitted_topics: number;
  max_students: number;
  status: "SUFFICIENT" | "INSUFFICIENT";
  is_override: boolean;
  last_notified_at: string | null;
}

export interface UpsertTeacherOverridesResult {
  updated: number;
  items: TeacherQuotaRecord[];
}

export interface SendDeadlineAlertsInput {
  periodId: number;
  deadlineType: DeadlineType;
  deadlineSeq?: number;
  event: AlertEvent;
  recipientRole?: AlertRecipientRole;
  recipientIds?: number[];
}

export interface AlertDispatchError {
  recipientId: number;
  email: string;
  message: string;
}

export interface AlertDispatchResult {
  matched: number;
  sent: number;
  skipped: number;
  failed: number;
  errors: AlertDispatchError[];
}

export interface AlertLogDeadline {
  id: number;
  type: DeadlineType;
  seq: number;
  label: string;
  deadline_at: string;
}

export interface AlertLogItem {
  id: number;
  deadline_id: number;
  event: AlertEvent;
  recipient_role: AlertRecipientRole;
  recipient_id: number;
  recipient_email: string;
  status: AlertStatus;
  error: string | null;
  attempt_count: number;
  claimed_at: string;
  sent_at: string | null;
  updated_at: string;
  deadline: AlertLogDeadline;
}

export interface AlertLogPage {
  items: AlertLogItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ListAlertLogsParams {
  periodId: number;
  status?: AlertStatus;
  deadlineType?: DeadlineType;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ManagedTopicTeacher {
  id: number;
  teacherId: string;
  name: string;
  email: string;
  departmentId: string | null;
  departmentName: string | null;
  facultyId: string | null;
  facultyName: string | null;
}

export interface ManagedTopicStudent {
  projectId: number;
  projectCode: string;
  studentDbId: number | null;
  studentCode: string | null;
  name: string | null;
  className: string | null;
  email: string | null;
  major: string | null;
  status: ProjectStatus;
  statusLabel: string;
  registeredAt: string;
  decidedAt: string | null;
  assignReason: string | null;
  moderatorNote: string | null;
  assignedByUserId: number | null;
  decidedByUserId: number | null;
}

export interface RegistrationSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  waitingSecretary: number;
  assigned: number;
}

export interface ManagedTopicRow {
  id: number;
  code: string | null;
  name: string;
  description: string;
  maxStudents: number;
  registeredStudents: number;
  occupiedStudents: number;
  remainingSlots: number;
  status: TopicStatus;
  statusLabel: string;
  moderatorNote: string | null;
  rejectionReason: string | null;
  isSupplemental: boolean;
  supplementalReason: string | null;
  locked: boolean;
  lockedAt: string | null;
  periodId: number;
  periodName: string | null;
  schoolYear: string | null;
  teacher: ManagedTopicTeacher | null;
  students: ManagedTopicStudent[];
  registrationSummary: RegistrationSummary;
  registrationHeadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface ManagedTopicPage extends Paginated<ManagedTopicRow> {
  periodId: number | null;
  facets: {
    statuses: Array<{ value: TopicStatus; label: string; count: number }>;
    faculties: Array<{ id: string; name: string }>;
    departments: Array<{ id: string; name: string; facultyId: string | null }>;
    teachers: Array<{ id: number; teacherId: string; name: string }>;
  };
}

export interface TopicManageParams {
  periodId?: number;
  search?: string;
  facultyId?: string;
  departmentId?: string;
  teacherId?: number;
  status?: TopicStatus;
  registrationStatus?: ProjectStatus;
  isSupplemental?: boolean;
  page?: number;
  limit?: number;
  sortBy?: TopicSortBy;
  sortOrder?: SortOrder;
}

export interface SearchPeriodEntityParams {
  periodId: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface StudentWithoutTopic {
  id: number;
  studentCode: string;
  name: string;
  email: string;
  className: string | null;
  major: string | null;
  isBanned: boolean;
  banReason: string | null;
  currentProject: {
    id: number;
    status: ProjectStatus;
    statusLabel: string;
    topicId: number | null;
  } | null;
}

export interface TeacherWithQuota {
  id: number;
  teacherId: string;
  name: string;
  email: string;
  departmentId: string | null;
  departmentName: string | null;
  facultyId: string | null;
  facultyName: string | null;
  assignedQuota: number;
  submittedTopics: number;
  remainingTopics: number;
  isOverride: boolean;
}

export interface TeacherWithQuotaPage extends Paginated<TeacherWithQuota> {
  config: TeacherOverrideConfig;
}

export interface ManualAssignInput {
  topicId: number;
  studentIds: number[];
  reason: string;
}

export interface ManualAssignResult {
  topicId: number;
  assigned: Array<{
    projectId: number;
    projectCode: string;
    studentId: number;
    status: ProjectStatus;
  }>;
  registeredStudents: number;
}

export interface ForceUpdateTopicInput {
  reason: string;
  name?: string;
  description?: string;
  maxStudents?: number;
  teacherId?: number;
  status?: TopicStatus;
  locked?: boolean;
}

export interface BulkModerationInput {
  topicIds: number[];
  action: "APPROVE" | "REJECT";
  reason?: string;
}

export interface BulkModerationResult {
  action: "APPROVE" | "REJECT";
  approved: number;
  rejected: number;
  updated: number;
  notFound: number[];
}

export interface CreateSupplementalTopicInput {
  periodId: number;
  teacherId: number;
  name: string;
  description: string;
  maxStudents: number;
  studentIds: number[];
  reason: string;
}

export interface SupplementalTopicResult {
  id: number;
  code: string;
  name: string;
  status: TopicStatus;
  maxStudents: number;
  registeredStudents: number;
  remainingQuota: number;
  assigned: Array<{
    projectId: number;
    studentId: number;
    status: ProjectStatus;
  }>;
}

export interface GenerateTopicCodesInput {
  periodId: number;
  topicIds?: number[];
  departmentCode?: string;
  overwrite?: boolean;
}

export interface GeneratedTopicCode {
  topicId: number;
  code: string;
  previous: string | null;
}

export interface GenerateCodesResult {
  periodId: number;
  generated: number;
  skipped: number;
  skippedTopicIds: number[];
  samples: GeneratedTopicCode[];
  items: GeneratedTopicCode[];
}

export interface TopicAuditEntry {
  id: number;
  action: TopicAuditAction;
  reason: string;
  before: unknown;
  after: unknown;
  actor: {
    id: number;
    username: string;
    email: string;
  } | null;
  createdAt: string;
}

export interface TopicAuditResponse {
  topic: { id: number; name: string; code: string | null };
  items: TopicAuditEntry[];
  total: number;
}
