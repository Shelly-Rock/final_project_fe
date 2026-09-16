import apiClient from "@/shared/services/api-client";

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailConfig {
  id: number;
  provider: "SMTP" | "SENDGRID" | "AWS_SES" | "MAILGUN";
  apiKey?: string;
  from: string;
  replyTo?: string;
  isActive: boolean;
}

export interface SendEmailOptions {
  notificationId: number;
  templateId?: number;
  recipients: Array<{
    email: string;
    recipientId: number;
    variables?: Record<string, string>;
  }>;
  subject?: string;
  htmlContent?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    mimeType: string;
  }>;
}

export const emailService = {
  // Get email templates
  getTemplates: async (): Promise<EmailTemplate[]> => {
    return apiClient.get("/email-templates");
  },

  // Get single template
  getTemplate: async (templateId: number): Promise<EmailTemplate> => {
    return apiClient.get(`/email-templates/${templateId}`);
  },

  // Create template
  createTemplate: async (data: {
    name: string;
    subject: string;
    htmlContent: string;
    textContent?: string;
  }): Promise<EmailTemplate> => {
    return apiClient.post("/email-templates", data);
  },

  // Update template
  updateTemplate: async (
    templateId: number,
    data: Partial<EmailTemplate>,
  ): Promise<EmailTemplate> => {
    return apiClient.patch(`/email-templates/${templateId}`, data);
  },

  // Delete template
  deleteTemplate: async (templateId: number): Promise<void> => {
    return apiClient.delete(`/email-templates/${templateId}`);
  },

  // Get email configuration
  getEmailConfig: async (): Promise<EmailConfig> => {
    return apiClient.get("/email-config");
  },

  // Update email configuration
  updateEmailConfig: async (data: Partial<EmailConfig>): Promise<EmailConfig> => {
    return apiClient.patch("/email-config", data);
  },

  // Send emails for notification
  sendEmails: async (options: SendEmailOptions): Promise<{ sentCount: number }> => {
    return apiClient.post("/email/send", options);
  },

  // Test email configuration
  testEmailConfig: async (testEmail: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post("/email-config/test", { testEmail });
  },

  // Get email preview
  getEmailPreview: async (templateId: number, variables?: Record<string, string>): Promise<{
    subject: string;
    htmlContent: string;
    textContent?: string;
  }> => {
    return apiClient.post(`/email-templates/${templateId}/preview`, { variables });
  },
};
