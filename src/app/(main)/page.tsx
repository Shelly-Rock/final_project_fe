"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function getDefaultRouteForRole(role?: string) {
  switch (role) {
    case "student":
      return "/topic-registration";
    case "teacher":
      return "/my-topics";
    case "admin":
    case "secretary":
    default:
      return "/students";
  }
}

export default function MainPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    const target = getDefaultRouteForRole(session?.user?.role);
    router.replace(target);
  }, [router, session?.user?.role, status]);

  return null;
}
