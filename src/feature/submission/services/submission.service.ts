/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/shared/services/api-client";

const API_BASE = "/submissions";

export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";
export type SubmissionType = "WORD" | "PDF" | "POWERPOINT";

export interface Submission {
  id: number;
  studentId: number;
  projectId: number;
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
}

function mapSubmission(raw: any): Submission {
  return {
    id: raw.id,
    studentId: raw.student_id,
    projectId: raw.project_id,
    fileUrl: raw.file_url,
    fileName: raw.file_name,
    originalName: raw.original_name,
    fileSize: raw.file_size,
    fileType: raw.file_type,
    status: raw.status,
    submittedAt: raw.submitted_at,
    reviewedBy: raw.reviewed_by,
    reviewedAt: raw.reviewed_at,
    rejectionReason: raw.rejection_reason,
    studentName: raw.student_name,
    studentMssv: raw.student_mssv,
    projectCode: raw.project_code,
    projectName: raw.project_name,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

class SubmissionService {
  async getSubmissions(params?: {
    page?: number;
    limit?: number;
    status?: SubmissionStatus;
    studentId?: number;
    projectId?: number;
  }): Promise<PaginatedResult<Submission>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    if (params?.studentId)
      searchParams.set("student_id", String(params.studentId));
    if (params?.projectId)
      searchParams.set("project_id", String(params.projectId));

    const response: any = await apiClient.get(
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
    const response: any = await apiClient.get(`${API_BASE}/${id}`);
    return mapSubmission(response);
  }

  async getMySubmissions(): Promise<Submission[]> {
    const response: any = await apiClient.get(`${API_BASE}/my`);
    return response.map(mapSubmission);
  }

  async createSubmission(data: {
    studentId?: number;
    projectId: number;
    fileUrl: string;
    fileName: string;
    originalName: string;
    fileSize: number;
    fileType?: SubmissionType;
  }): Promise<Submission> {
    const response: any = await apiClient.post(API_BASE, {
      project_id: data.projectId,
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
    const response: any = await apiClient.put(`${API_BASE}/${id}/review`, {
      status: data.status,
      rejection_reason: data.rejectionReason,
    });
    return mapSubmission(response);
  }

  async getEligibleStudents(): Promise<EligibleStudent[]> {
    const response: any = await apiClient.get(`${API_BASE}/eligible-students`);
    const students = Array.isArray(response) ? response : response.data || [];
    return students.map((raw: any) => ({
      id: raw.id,
      studentId: raw.student_id,
      name: raw.name,
      className: raw.class_name,
      projectCode: raw.project_code,
      projectName: raw.project_name,
      email: raw.email,
    }));
  }

  async getStats(): Promise<SubmissionStats> {
    const response: any = await apiClient.get(`${API_BASE}/stats/summary`);
    return {
      total: response.total || 0,
      pending: response.pending || 0,
      approved: response.approved || 0,
      rejected: response.rejected || 0,
    };
  }

  async initDriveUpload(data: {
    projectId: number;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }): Promise<DriveUploadSession> {
    const response: any = await apiClient.post(
      `${API_BASE}/drive/init-upload`,
      {
        projectId: data.projectId,
        fileName: data.fileName,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
      },
    );
    return {
      sessionUrl: response.sessionUrl || response.session_url,
      driveFileId: response.driveFileId || response.drive_file_id,
      webViewLink: response.webViewLink || response.web_view_link,
    };
  }

  /**
   * Bước 2: FE tự PUT file trực tiếp lên Google Drive qua sessionUrl.
   * Dùng XMLHttpRequest thay vì fetch để có thể lắng nghe sự kiện upload progress.
   * @param onProgress Callback nhận vào % đã upload (0–100)
   */
  uploadToDrive(
    sessionUrl: string,
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Lắng nghe sự kiện progress để cập nhật thanh % cho UI
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      });

      xhr.addEventListener("load", () => {
        // Google Drive trả 200 hoặc 308 là thành công
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

      // PUT trực tiếp lên sessionUrl của Google (không cần Auth header — URL đã chứa token tạm)
      xhr.open("PUT", sessionUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  }

  /**
   * Bước 3: Sau khi file đã lên Drive, gọi BE để lưu thông tin vào Database.
   * BE sẽ map driveFileId với projectId và lưu webViewLink để Giám khảo có thể xem file.
   */
  async confirmDriveUpload(data: {
    projectId: number;
    driveFileId: string;
    webViewLink: string;
    fileName: string;
    fileSize: number;
    fileType?: SubmissionType;
  }): Promise<Submission> {
    const response: any = await apiClient.post(`${API_BASE}/drive/confirm`, {
      projectId: data.projectId,
      driveFileId: data.driveFileId,
      webViewLink: data.webViewLink,
      fileName: data.fileName,
      fileSize: data.fileSize,
      fileType: data.fileType,
    });
    return mapSubmission(response);
  }
}

// ---------- Singleton Export ----------
export const submissionService = new SubmissionService();
export default submissionService;
