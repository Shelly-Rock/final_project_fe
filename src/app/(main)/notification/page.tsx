"use client";

import { NotificationPage } from "@/feature/notification";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotificationPage />
    </Suspense>
  );
}
