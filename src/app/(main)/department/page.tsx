"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUserRole } from "@/shared/hooks/useUserRole";
import { RoleGate } from "@/shared/components/PermissionGuard/PermissionGuard";
import { AdminDepartmentDashboard } from "@/feature/admin/components";
import { departmentService } from "@/feature/dashboard/services/department.service";

export default function DepartmentPage() {
  const router = useRouter();
  const userRole = useUserRole();

  const { data: departments, isLoading } = useQuery({
    queryKey: ["secretary-department-list"],
    queryFn: () => departmentService.getDepartments(),
    enabled: userRole === "secretary",
  });

  useEffect(() => {
    if (userRole !== "secretary" || isLoading) return;
    const departmentId = departments?.[0]?.department_id;
    if (departmentId) {
      router.replace(`/department/${encodeURIComponent(departmentId)}`);
    }
  }, [departments, isLoading, router, userRole]);

  if (userRole === "secretary") {
    if (isLoading) return null;

    if (!departments?.[0]?.department_id) {
      return (
        <div className="w-full p-3 text-center">
          <h6 className="text-red-600">Thư ký chưa được gán bộ môn/khoa</h6>
        </div>
      );
    }

    return null;
  }

  return (
    <RoleGate
      roles={["admin"]}
      fallback={
        <div className="w-full p-3 text-center">
          <h6 className="text-red-600">
            Bạn không có quyền truy cập trang này
          </h6>
        </div>
      }
    >
      <AdminDepartmentDashboard />
    </RoleGate>
  );
}
