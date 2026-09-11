# final_project_fe

> Hệ thống Frontend quản lý đề tài sinh viên — được xây dựng với Next.js 16, React 19 và Tailwind CSS v4.

---

## 1. Môi trường & Ngôn ngữ

| Package        | Version | Vai trò                                 |
| -------------- | ------- | --------------------------------------- |
| **Next.js**    | 16.2.6  | Framework React SSR/SSG, routing, build |
| **React**      | 19.2.4  | Thư viện UI                             |
| **React DOM**  | 19.2.4  | DOM rendering                           |
| **TypeScript** | ^5      | Type-safe JavaScript                    |
| **Sass**       | 1.100.0 | CSS preprocessor (SCSS)                 |

---

## 2. Giao diện & Styling

| Package                  | Version | Vai trò                                              |
| ------------------------ | ------- | ---------------------------------------------------- |
| **Tailwind CSS**         | ^4      | Utility-first CSS framework                          |
| **@tailwindcss/postcss** | ^4      | PostCSS plugin cho Tailwind v4                       |
| **@mui/material**        | ^6.5.0  | UI component library (table, form, modal, menu...)   |
| **clsx**                 | ^2.1.1  | Tạo className động từ điều kiện                      |
| **tailwind-merge**       | ^3.6.0  | Merge Tailwind classes không bị đè (dùng với `cn()`) |

```ts
// Ví dụ: cn() utility
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 3. HTTP Client & API

| Package   | Version | Vai trò                                                 |
| --------- | ------- | ------------------------------------------------------- |
| **axios** | ^1.17.0 | Gọi HTTP REST API (GET, POST, PUT, DELETE)              |
| **qs**    | ^6.15.2 | Serialize/deserialize query string (`?page=1&limit=10`) |

---

## 4. Form & Validation

| Package                 | Version | Vai trò                                        |
| ----------------------- | ------- | ---------------------------------------------- |
| **react-hook-form**     | ^7.78.0 | Quản lý form state (đăng nhập, register, CRUD) |
| **zod**                 | ^4.4.3  | Schema validation phía client                  |
| **@hookform/resolvers** | ^5.4.0  | Kết nối Zod với react-hook-form                |

---

## 5. Server State Management

| Package                   | Version  | Vai trò                                  |
| ------------------------- | -------- | ---------------------------------------- |
| **@tanstack/react-query** | ^5.101.0 | Cache API, pagination, refetch, mutation |

---

## 6. Client State Management

| Package     | Version | Vai trò                                                     |
| ----------- | ------- | ----------------------------------------------------------- |
| **zustand** | ^5.0.14 | Lightweight global store (user, theme, sidebar, permission) |

---

## 7. Routing & Navigation

| Package              | Version | Vai trò                                        |
| -------------------- | ------- | ---------------------------------------------- |
| **react-router-dom** | ^7.17.0 | Client-side routing, URL params, query strings |

---

## 8. UI Components & Icons

| Package                    | Version | Vai trò                                        |
| -------------------------- | ------- | ---------------------------------------------- |
| **lucide-react**           | ^1.17.0 | Bộ icon SVG minimal, đẹp                       |
| **sonner**                 | ^2.0.7  | Toast notification (thông báo, success, error) |
| **react-loading-skeleton** | ^3.5.0  | Skeleton loading placeholder                   |

---

## 9. Table & Grid

| Package                   | Version | Vai trò                                             |
| ------------------------- | ------- | --------------------------------------------------- |
| **@tanstack/react-table** | ^8.21.3 | Headless table (sort, filter, pagination, grouping) |

---

## 10. Rich Text Editor

| Package           | Version | Vai trò                                |
| ----------------- | ------- | -------------------------------------- |
| **@tiptap/react** | ^3.26.0 | WYSIWYG editor (mô tả đề tài, báo cáo) |

---

## 11. Charts & Visualization

| Package       | Version | Vai trò                                        |
| ------------- | ------- | ---------------------------------------------- |
| **recharts**  | ^3.8.1  | Chart library React (bar, line, pie, area...)  |
| **chroma-js** | ^3.2.0  | Thao tác màu sắc (scale, interpolate, convert) |

---

## 12. File Upload & Processing

| Package            | Version | Vai trò                                |
| ------------------ | ------- | -------------------------------------- |
| **react-dropzone** | ^15.0.0 | Kéo-thả file upload (Excel, PDF, DOCX) |
| **xlsx**           | ^0.18.5 | Đọc & ghi file Excel (.xlsx, .xls)     |
| **jspdf**          | ^4.2.1  | Tạo file PDF từ HTML/canvas            |
| **html2canvas**    | ^1.4.1  | Chụp ảnh DOM → ảnh (dùng với jsPDF)    |

---

## 13. Authentication & Security

| Package                | Version  | Vai trò                                           |
| ---------------------- | -------- | ------------------------------------------------- |
| **jwt-decode**         | ^4.0.0   | Giải mã JWT token (lấy user info từ access token) |
| **js-cookie**          | ^3.0.8   | Đọc/ghi cookie (lưu access token, refresh token)  |
| **@t3-oss/env-nextjs** | ^0.13.11 | Validate biến môi trường `.env`                   |

---

## 14. Drag & Drop

| Package               | Version | Vai trò                                         |
| --------------------- | ------- | ----------------------------------------------- |
| **@dnd-kit/core**     | ^6.3.1  | Drag and drop primitive (sortable list, kanban) |
| **@dnd-kit/sortable** | ^10.0.0 | DnD helpers cho sortable items                  |

---

## 15. Date & Time

| Package   | Version  | Vai trò                                   |
| --------- | -------- | ----------------------------------------- |
| **dayjs** | ^1.11.21 | Thao tác ngày tháng (format, diff, parse) |

---

## 16. Code Quality & Tooling

| Package                    | Version | Vai trò                                      |
| -------------------------- | ------- | -------------------------------------------- |
| **eslint**                 | ^9      | Linter JavaScript/TypeScript                 |
| **eslint-config-next**     | 16.2.6  | ESLint config Next.js                        |
| **eslint-config-prettier** | ^10.1.8 | Tắt eslint rules xung đột với Prettier       |
| **prettier**               | ^3.8.3  | Code formatter (tab, semicolon, quote style) |
| **husky**                  | ^9.1.7  | Git hooks (pre-commit, pre-push...)          |
| **lint-staged**            | ^17.0.7 | Chạy linter chỉ trên file staged             |
| **@types/node**            | ^20     | TypeScript types cho Node.js                 |
| **@types/react**           | ^19     | TypeScript types cho React                   |
| **@types/react-dom**       | ^19     | TypeScript types cho React DOM               |
| **@types/chroma-js**       | ^3.1.2  | TypeScript types cho chroma-js               |
| **@types/js-cookie**       | ^3.0.6  | TypeScript types cho js-cookie               |

---

## 17. Package Manager

|          |         |
| -------- | ------- |
| **pnpm** | v11.5.2 |

### Các lệnh thường dùng

```bash
# Cài đặt dependencies
pnpm install

# Chạy development server
pnpm dev

# Build production
pnpm build

# Chạy production server
pnpm start

# Format code
pnpm format

# Kiểm tra lỗi ESLint
pnpm lint
```

---

## Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────┐
│                    UI Layer                      │
│  MUI         ·  Lucide Icons  ·  Recharts       │
│  TipTap Editor  ·  Sonner Toasts                 │
├─────────────────────────────────────────────────┤
│               State Management                   │
│  Zustand (client)  ·  React Query (server)       │
├─────────────────────────────────────────────────┤
│                  Forms                           │
│  React Hook Form  +  Zod Validation              │
├─────────────────────────────────────────────────┤
│               HTTP & Auth                        │
│  Axios  ·  JWT Decode  ·  Cookies               │
├─────────────────────────────────────────────────┤
│          Framework & Language                    │
│  Next.js 16  ·  React 19  ·  TypeScript 5       │
└─────────────────────────────────────────────────┘
```

---

## Tính năng chính được hỗ trợ

- **Authentication** — JWT decode, cookie-based token management
- **Authorization** — Phân quyền Admin / Thư ký / Giảng viên / Sinh viên
- **CRUD** — Full form validation với react-hook-form + zod
- **Upload / Export** — Excel (xlsx), PDF (jsPDF + html2canvas)
- **Table** — Sort, filter, pagination với @tanstack/react-table
- **Dashboard** — Charts với recharts
- **Drag & Drop** — Sắp xếp, kanban với @dnd-kit
- **Rich Text** — Soạn thảo nội dung với TipTap
- **Notification** — Toast với sonner
- **Skeleton Loading** — Placeholder đẹp khi chờ data

  1234567890

// // ============================================================
// // MIDDLEWARE — Route protection & role-based access control
// // ============================================================
// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // ---------- Inline Role type (middleware can't use path aliases) ----------
// type Role = "admin" | "secretary" | "teacher" | "student";

// // ---------- Public routes ----------
// const PUBLIC_ROUTES = [
// "/login",
// "/unauthorized",
// "/change-password",
// "/verify-email",
// "/auth/verify-email",
// ];

// // ---------- Role-based restricted routes ----------
// const ROLE_ROUTES: Partial<Record<Role, RegExp[]>> = {
// student: [
// /^\/students/,
// /^\/teachers/,
// /^\/registration-periods/,
// /^\/project-config/,
// /^\/user/,
// /^\/role/,
// /^\/setting/,
// /^\/audit/,
// /^\/department/,
// /^\/major/,
// /^\/course/,
// /^\/statistic/,
// ],
// teacher: [
// /^\/students/,
// /^\/teachers/,
// /^\/registration-periods/,
// /^\/project-config/,
// /^\/user/,
// /^\/role/,
// /^\/setting/,
// /^\/audit/,
// /^\/department/,
// /^\/statistic/,
// ],
// };

// // ---------- Admin/secretary-only routes ----------
// const ADMIN_ONLY_ROUTES = [
// /^\/students/,
// /^\/teachers/,
// /^\/user/,
// /^\/setting/,
// /^\/audit/,
// ];

// // ---------- Admin-only (no secretary) ----------
// const ADMIN_STRICT_ROUTES = [/^\/role/];

// // ---------- Helpers ----------
// function isPublicRoute(pathname: string): boolean {
// return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
// }

// function canAccessRoute(role: Role, pathname: string): boolean {
// if (role === "admin" || role === "secretary") return true;
// const restricted = ROLE_ROUTES[role] ?? [];
// return !restricted.some((pattern) => pattern.test(pathname));
// }

// function isAdminOnlyRoute(pathname: string): boolean {
// return ADMIN_ONLY_ROUTES.some((pattern) => pattern.test(pathname));
// }

// function isAdminStrictRoute(pathname: string): boolean {
// return ADMIN_STRICT_ROUTES.some((pattern) => pattern.test(pathname));
// }

// // ---------- Main middleware ----------
// export default async function middleware(req: NextRequest) {
// const { pathname } = req.nextUrl;

// // Allow public routes
// if (isPublicRoute(pathname)) {
// return NextResponse.next();
// }

// // Allow Next.js internal paths
// if (
// pathname.startsWith("/\_next") ||
// pathname.startsWith("/api/auth") ||
// pathname.includes(".")
// ) {
// return NextResponse.next();
// }

// // Get JWT token
// const token = await getToken({
// req,
// secret: process.env.NEXTAUTH_SECRET,
// });

// // No token → redirect to login
// if (!token) {
// const loginUrl = new URL("/login", req.url);
// loginUrl.searchParams.set("callbackUrl", pathname);
// return NextResponse.redirect(loginUrl);
// }

// if (token.mustChangePassword && pathname !== "/change-password") {
// return NextResponse.redirect(
// new URL("/change-password?mustChangePassword=1", req.url),
// );
// }

// const role = token.role as Role | undefined;

// if (
// role &&
// isAdminOnlyRoute(pathname) &&
// role !== "admin" &&
// role !== "secretary"
// ) {
// return NextResponse.redirect(new URL("/unauthorized", req.url));
// }

// if (role && isAdminStrictRoute(pathname) && role !== "admin") {
// return NextResponse.redirect(new URL("/unauthorized", req.url));
// }

// if (role && !canAccessRoute(role, pathname)) {
// return NextResponse.redirect(new URL("/unauthorized", req.url));
// }

// return NextResponse.next();
// }

// export const config = {
// matcher: [
// "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf)).*)",
// ],
// };
