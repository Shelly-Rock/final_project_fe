// ============================================================
// MIDDLEWARE — Route protection & role-based access control
// ============================================================
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ---------- Inline Role type (middleware can't use path aliases) ----------
type Role = "admin" | "secretary" | "teacher" | "student";

// ---------- Public routes ----------
const PUBLIC_ROUTES = [
  "/login",
  "/unauthorized",
  "/change-password",
  "/verify-email",
  "/auth/verify-email",
];

// ---------- Role-based restricted routes ----------
const ROLE_ROUTES: Partial<Record<Role, RegExp[]>> = {
  student: [
    /^\/students/,
    /^\/teachers/,
    /^\/registration-periods/,
    /^\/user/,
    /^\/role/,
    /^\/setting/,
    /^\/audit/,
    /^\/department/,
    /^\/major/,
    /^\/course/,
    /^\/statistic/,
  ],
  teacher: [
    /^\/students/,
    /^\/teachers/,
    /^\/user/,
    /^\/role/,
    /^\/setting/,
    /^\/audit/,
    /^\/department/,
    /^\/statistic/,
  ],
};

// ---------- Admin/secretary-only routes ----------
const ADMIN_ONLY_ROUTES = [
  /^\/students/,
  /^\/teachers/,
  /^\/user/,
  /^\/role/,
  /^\/setting/,
  /^\/audit/,
];

// ---------- Helpers ----------
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

function canAccessRoute(role: Role, pathname: string): boolean {
  if (role === "admin" || role === "secretary") return true;
  const restricted = ROLE_ROUTES[role] ?? [];
  return !restricted.some((pattern) => pattern.test(pathname));
}

function isAdminOnlyRoute(pathname: string): boolean {
  return ADMIN_ONLY_ROUTES.some((pattern) => pattern.test(pathname));
}

// ---------- Main middleware ----------
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Allow Next.js internal paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get JWT token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // No token → redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role as Role | undefined;

  if (
    role &&
    isAdminOnlyRoute(pathname) &&
    role !== "admin" &&
    role !== "secretary"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (role && !canAccessRoute(role, pathname)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf)).*)",
  ],
};
