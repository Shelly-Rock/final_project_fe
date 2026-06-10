// ============================================================
// MIDDLEWARE — Route protection & role-based access control
// ============================================================
// TEMPORARILY DISABLED FOR FRONTEND TESTING — re-enable when BE is ready
// import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// ---------- Public routes ----------
// const PUBLIC_ROUTES = [
//   "/login",
//   "/register",
//   "/forgot-password",
//   "/unauthorized",
// ];

// const AUTH_ROUTES = ["/login", "/register"];

// ---------- Role-based restricted routes ----------
// const ROLE_ROUTES: Partial<Record<Role, RegExp[]>> = {
//   student: [
//     /^\/user/,
//     /^\/role/,
//     /^\/setting/,
//     /^\/audit/,
//     /^\/department/,
//     /^\/major/,
//     /^\/course/,
//     /^\/statistic/,
//   ],
// };

// ---------- Admin-only routes ----------
// const ADMIN_ONLY_ROUTES = [
//   /^\/user/,
//   /^\/role/,
//   /^\/setting/,
//   /^\/audit/,
// ];

// ---------- Helpers ----------
// function isPublicRoute(pathname: string): boolean {
//   return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
// }

// function canAccessRoute(role: Role, pathname: string): boolean {
//   if (role === "admin") return true;
//   const restricted = ROLE_ROUTES[role] ?? [];
//   return !restricted.some((pattern) => pattern.test(pathname));
// }

// function isAdminOnlyRoute(pathname: string): boolean {
//   return ADMIN_ONLY_ROUTES.some((pattern) => pattern.test(pathname));
// }

// ---------- Main middleware ----------
export function middleware() {
  // const { pathname } = req.nextUrl;

  // TODO (BE): Uncomment when backend is ready
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // const role = token?.role as Role | undefined;

  // --- TEMP: Allow all routes for frontend testing ---
  return NextResponse.next();

  // --- Full auth (re-enable later) ---
  // if (isPublicRoute(pathname)) {
  //   if (token && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
  //     return NextResponse.redirect(new URL("/dashboard", req.url));
  //   }
  //   return NextResponse.next();
  // }
  // if (!token) {
  //   const loginUrl = new URL("/login", req.url);
  //   loginUrl.searchParams.set("callbackUrl", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }
  // if (role && !canAccessRoute(role, pathname)) {
  //   return NextResponse.redirect(new URL("/unauthorized", req.url));
  // }
  // if (role && isAdminOnlyRoute(pathname) && role !== "admin") {
  //   return NextResponse.redirect(new URL("/unauthorized", req.url));
  // }
  // return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf)).*)",
  ],
};
