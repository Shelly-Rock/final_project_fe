import { apiClient } from "@/shared/services/api-client";

const API_BASE = "/submissions";

export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";
export type SubmissionType = "WORD" | "PDF" | "POWERPOINT";

export interface Submission {
  id: number;
  studentId: number;
  topicId: number;
  fileUrl: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  fileType: SubmissionType;
  status: SubmissionStatus;
  submittedAt: string;
  reviewedBy: number | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  studentName?: string;
  studentMssv?: string;
  projectCode?: string;
  projectName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EligibleStudent {
  id: number;
  studentId: string;
  name: string;
  className: string;
  projectCode: string;
  projectName: string;
  email: string;
}

export interface SubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DriveUploadSession {
  sessionUrl: string;
  driveFileId: string;
  webViewLink: string;
  session_url?: string;
  drive_file_id?: string;
  web_view_link?: string;
}

interface RawSubmission {
  id: number;
  student_id?: number;
  topic_id?: number;
  file_url?: string;
  file_name?: string;
  original_name?: string;
  file_size?: number;
  file_type?: SubmissionType;
  status?: SubmissionStatus;
  submitted_at?: string;
  reviewed_by?: number;
  reviewed_at?: string;
  rejection_reason?: string;
  student_name?: string;
  student_mssv?: string;
  project_code?: string;
  project_name?: string;
  created_at?: string;
  updated_at?: string;
}

interface EligibilityResponse {
  eligible?: boolean;
  reason?: string;
  isLeader?: boolean;
}

interface PaginatedRawSubmissionResponse {
  data?: RawSubmission[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

interface RawEligibleStudent {
  id: number;
  student_id: number;
  name: string;
  class_name?: string;
  project_code?: string;
  project_name?: string;
  email?: string;
}

interface StatsSummaryResponse {
  total?: number;
  pending?: number;
  approved?: number;
  rejected?: number;
}

interface EligibleStudentResponse {
  data?: RawEligibleStudent[];
}

function mapSubmission(raw: RawSubmission): Submission {
  return {
    id: raw.id,
    studentId: raw.student_id || 0,
    topicId: raw.topic_id || 0,
    fileUrl: raw.file_url || "",
    fileName: raw.file_name || "",
    originalName: raw.original_name || "",
    fileSize: raw.file_size || 0,
    fileType: raw.file_type as SubmissionType,
    status: raw.status as SubmissionStatus,
    submittedAt: raw.submitted_at || "",
    reviewedBy: raw.reviewed_by ?? null,
    reviewedAt: raw.reviewed_at ?? null,
    rejectionReason: raw.rejection_reason ?? null,
    studentName: raw.student_name || "",
    studentMssv: raw.student_mssv || "",
    projectCode: raw.project_code || "",
    projectName: raw.project_name || "",
    createdAt: raw.created_at || "",
    updatedAt: raw.updated_at || "",
  };
}

class SubmissionService {
  async getMyEligibility(): Promise<{
    eligible: boolean;
    reason?: string;
    isLeader?: boolean;
  }> {
    const response = await apiClient.get<EligibilityResponse>(
      `${API_BASE}/my/eligibility`,
    );
    return {
      eligible: !!response.eligible,
      reason: response.reason,
      isLeader: response.isLeader,
    };
  }

  async getSubmissions(params?: {
    page?: number;
    limit?: number;
    status?: SubmissionStatus;
    studentId?: number;
    topicId?: number;
  }): Promise<PaginatedResult<Submission>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    if (params?.studentId)
      searchParams.set("student_id", String(params.studentId));
    if (params?.topicId) searchParams.set("topic_id", String(params.topicId));

    const response = await apiClient.get<PaginatedRawSubmissionResponse>(
      `${API_BASE}?${searchParams.toString()}`,
    );
    return {
      data: (response.data || []).map(mapSubmission),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 20,
      totalPages: response.totalPages || 1,
    };
  }

  async getSubmissionById(id: number): Promise<Submission> {
    const response = await apiClient.get<RawSubmission>(`${API_BASE}/${id}`);
    return mapSubmission(response);
  }

  async getMySubmissions(): Promise<Submission[]> {
    const response = await apiClient.get<RawSubmission[]>(`${API_BASE}/my`);
    return response.map(mapSubmission);
  }

  async createSubmission(data: {
    studentId?: number;
    topicId: number;
    fileUrl: string;
    fileName: string;
    originalName: string;
    fileSize: number;
    fileType?: SubmissionType;
  }): Promise<Submission> {
    const response = await apiClient.post<RawSubmission>(API_BASE, {
      topic_id: data.topicId,
      file_url: data.fileUrl,
      file_name: data.fileName,
      original_name: data.originalName,
      file_size: data.fileSize,
      ...(data.fileType ? { file_type: data.fileType } : {}),
    });
    return mapSubmission(response);
  }

  async reviewSubmission(
    id: number,
    data: {
      status: SubmissionStatus;
      rejectionReason?: string;
    },
    _reviewerId?: number,
  ): Promise<Submission> {
    const response = await apiClient.put<RawSubmission>(
      `${API_BASE}/${id}/review`,
      {
        status: data.status,
        rejection_reason: data.rejectionReason,
      },
    );
    return mapSubmission(response);
  }

  async getEligibleStudents(): Promise<EligibleStudent[]> {
    const response = await apiClient.get<
      RawEligibleStudent[] | EligibleStudentResponse
    >(`${API_BASE}/eligible-students`);
    const students = Array.isArray(response) ? response : response.data || [];
    return students.map((raw: RawEligibleStudent) => ({
      id: raw.id,
      studentId: String(raw.student_id),
      name: raw.name,
      className: raw.class_name || "",
      projectCode: raw.project_code || "",
      projectName: raw.project_name || "",
      email: raw.email || "",
    }));
  }

  async getStats(): Promise<SubmissionStats> {
    const response = await apiClient.get<StatsSummaryResponse>(
      `${API_BASE}/stats/summary`,
    );
    return {
      total: response.total || 0,
      pending: response.pending || 0,
      approved: response.approved || 0,
      rejected: response.rejected || 0,
    };
  }

  async initDriveUpload(data: {
    topicId: number;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }): Promise<DriveUploadSession> {
    const response = await apiClient.post<DriveUploadSession>(
      `${API_BASE}/drive/init-upload`,
      {
        topicId: data.topicId,
        fileName: data.fileName,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
      },
    );
    return {
      sessionUrl: response.sessionUrl || response.session_url || "",
      driveFileId: response.driveFileId || response.drive_file_id || "",
      webViewLink: response.webViewLink || response.web_view_link || "",
    };
  }

  /**
   * Bước 2: FE tự PUT file trực tiếp lên Google Drive qua sessionUrl.
   * Dùng XMLHttpRequest thay vì fetch để có thỒ lắng nghe sự kiện upload progress.
   * @param onProgress Callback nhận vào % đã upload (0–100)
   */
  uploadToDrive(
    sessionUrl: string,
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200 || xhr.status === 308) {
          resolve();
        } else {
          reject(new Error(`Google Drive upload failed: HTTP ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(
          new Error("Mạng không ổn định. Upload lên Google Drive thất bại."),
        );
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload đã bị hủy."));
      });

      xhr.open("PUT", sessionUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  }

  async confirmDriveUpload(data: {
    topicId: number;
    driveFileId: string;
    webViewLink: string;
    fileName: string;
    fileSize: number;
    fileType?: SubmissionType;
  }): Promise<Submission> {
    const response = await apiClient.post<RawSubmission>(
      `${API_BASE}/drive/confirm`,
      {
        topicId: data.topicId,
        driveFileId: data.driveFileId,
        webViewLink: data.webViewLink,
        fileName: data.fileName,
        fileSize: data.fileSize,
        fileType: data.fileType,
      },
    );
    return mapSubmission(response);
  }
}

export const submissionService = new SubmissionService();
export default submissionService;
