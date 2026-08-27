import { redirect } from "next/navigation";

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string | string[] }>;
}

export default async function LegacyVerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams;
  const value = Array.isArray(token) ? token[0] : token;

  redirect(
    value ? `/change-password?token=${encodeURIComponent(value)}` : "/login",
  );
}
