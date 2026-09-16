"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { notificationApi } from "@/shared/services/api/notification.api";
import { toast } from "sonner";
import apiClient from "@/shared/services/api-client";

const SendNotificationSchema = z.object({
  recipientRole: z.enum(["STUDENT", "TEACHER"]),
  title: z.string().min(1, "Tiêu đề không được để trống").max(255),
  message: z.string().min(1, "Nội dung không được để trống"),
  type: z.enum([
    "STATUS_CHANGED",
    "REPORT_SUBMITTED",
    "REPORT_APPROVED",
    "REPORT_REJECTED",
    "BAN_APPLIED",
    "BAN_WARNING",
  ]),
  recipientIds: z.array(z.number()).min(1, "Chọn ít nhất 1 người nhận"),
});

type SendNotificationFormData = z.infer<typeof SendNotificationSchema>;

interface Recipient {
  id: number;
  name: string;
  email: string;
}

interface SendNotificationFormProps {
  onSuccess?: () => void;
}

const SendNotificationForm: React.FC<SendNotificationFormProps> = ({
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<SendNotificationFormData>({
    resolver: zodResolver(SendNotificationSchema),
    defaultValues: {
      recipientRole: "STUDENT",
      type: "STATUS_CHANGED",
      recipientIds: [],
    },
  });

  const selectedRole = watch("recipientRole");
  const selectedIds = watch("recipientIds");
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);

  useEffect(() => {
    const loadRecipients = async () => {
      setLoadingRecipients(true);
      try {
        const data = await apiClient.get<{ users: Recipient[] }>(
          `/notification/users-by-role?role=${selectedRole}`,
        );
        setRecipients(data.users || []);
      } catch (error) {
        toast.error("Lỗi khi tải danh sách người dùng");
        setRecipients([]);
      } finally {
        setLoadingRecipients(false);
      }
    };

    if (selectedRole) {
      loadRecipients();
    }
  }, [selectedRole]);

  const onSubmit = async (data: SendNotificationFormData) => {
    try {
      await notificationApi.sendNotification({
        title: data.title,
        message: data.message,
        type: data.type,
        recipientIds: data.recipientIds,
      });
      toast.success("Gửi thông báo thành công");
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Lỗi khi gửi thông báo",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold text-gray-900">Gửi Thông báo</h2>

      {/* Recipient Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gửi tới
        </label>
        <select
          {...register("recipientRole")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="STUDENT">Sinh viên</option>
          <option value="TEACHER">Giảng viên</option>
        </select>
      </div>

      {/* Notification Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loại thông báo
        </label>
        <select
          {...register("type")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="STATUS_CHANGED">Thay đổi trạng thái</option>
          <option value="REPORT_SUBMITTED">Nộp báo cáo</option>
          <option value="REPORT_APPROVED">Phê duyệt báo cáo</option>
          <option value="REPORT_REJECTED">Từ chối báo cáo</option>
          <option value="BAN_APPLIED">Bị cấm</option>
          <option value="BAN_WARNING">Cảnh báo cấm</option>
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tiêu đề
        </label>
        <input
          type="text"
          {...register("title")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nhập tiêu đề thông báo"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nội dung
        </label>
        <textarea
          {...register("message")}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nhập nội dung thông báo"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      {/* Recipients Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Chọn người nhận
          </label>
          {selectedIds.length > 0 && (
            <span className="text-sm text-blue-600 font-medium">
              Đã chọn {selectedIds.length}
            </span>
          )}
        </div>
        {loadingRecipients ? (
          <div className="border border-gray-300 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-500">Đang tải danh sách...</p>
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
            {recipients.length === 0 ? (
              <p className="text-sm text-gray-500">Không có người dùng nào</p>
            ) : (
              recipients.map((recipient) => (
                <label
                  key={recipient.id}
                  className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={recipient.id}
                    {...register("recipientIds")}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {recipient.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {recipient.email}
                    </p>
                  </div>
                </label>
              ))
            )}
          </div>
        )}
        {errors.recipientIds && (
          <p className="mt-1 text-sm text-red-600">
            {errors.recipientIds.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || loadingRecipients}
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {isSubmitting ? "Đang gửi..." : "Gửi thông báo"}
      </button>
    </form>
  );
};

export default SendNotificationForm;
