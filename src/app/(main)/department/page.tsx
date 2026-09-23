"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/shared/hooks/useUserRole";
import { RoleGate } from "@/shared/components/PermissionGuard/PermissionGuard";
import { AdminDepartmentDashboard } from "@/feature/admin/components";

export default function DepartmentPage() {
  const router = useRouter();
  const userRole = useUserRole();

  useEffect(() => {
    if (userRole === "secretary") {
      router.replace("/department/BM_KTPM");
    }
  }, [userRole, router]);

  if (userRole === "secretary") {
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
