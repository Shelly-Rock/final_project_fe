┌─────────────────────────────────────────────────────────────────┐
│ app/layout.tsx │
│ (getServerSession → lấy role) │
└───────────────────────────────┬─────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ core/providers/PermissionProvider │
│ (initialRole → defineAbilityFor) │
└───────────────────────────────┬─────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ core/permissions/ │
├─────────────────────────────────────────────────────────────────┤
│ types.ts ◄────── permissions.ts ◄────── ability.ts │
│ (Role,Action) (role→permissions) (defineAbilityFor) │
└───────────────────────────────┬─────────────────────────────────┘
│
┌───────────────────┼───────────────────┐
│ │ │
▼ ▼ ▼
┌───────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│ shared/hooks/ │ │ shared/components│ │ core/permissions/ │
│ useCan() │ │ PermissionGuard │ │ guards/ (server) │
│ usePermission() │ │ │ │ requirePermission()│
└───────────────────┘ └─────────────────┘ └─────────────────────┘
│ │ │
└───────────────────┼───────────────────┘
▼
┌─────────────────────────────────────────────────────────────────┐
│ feature/\*/page.tsx │
│ (dùng useCan() hoặc PermissionGuard) │
└─────────────────────────────────────────────────────────────────┘
📁 src/
│
├── 📁 app/ # (đã có - App Router)
│ ├── layout.tsx
│ ├── notFound.tsx
│ ├── page.tsx
│ └── 📁 (các route khác)
│
├── 📁 core/ # (đã có - core business logic)
│ ├── 📁 api/ # (đã có)
│ ├── 📁 auth/ # (đã có - mở rộng thêm role)
│ │ ├── auth.config.ts # cấu hình NextAuth với role
│ │ └── session.ts # lấy session + role
│ │
│ ├── 📁 permissions/ # toàn bộ permission logic
│ │ ├── index.ts # export tổng hợp
│ │ ├── types.ts # định nghĩa Role, Action, Resource, Permission
│ │ ├── permissions.ts # mapping Role → Permission[]
│ │ ├── ability.ts # CASL ability builder
│ │ │
│ │ ├── 📁 guards/ # Server-side guards
│ │ │ ├── permission.server.ts # requirePermission() dùng trong server component
│ │ │ └── page.guard.ts # guard cho page layout
│ │ │
│ │ └── 📁 helpers/ # (tuỳ chọn)
│ │ └── hasPermission.ts # hàm pure kiểm tra permission
│ │
│ ├── 📁 config/  
│ ├── 📁 constants/  
│ │
│ └── 📁 providers/  
│ ├── index.ts  
│ └── PermissionProvider.tsx # React Context Provider
│
├── 📁 feature/ # (feature modules)
│ └── 📁 homePage/ # (đã có)
│
├── 📁 layouts/ # (đã có)
│
├── 📁 shared/ # (đã có - shared code)
│ ├── 📁 components/
│ │ ├── 📁 ui/
│ │ │ ├── PermissionGuard.tsx # component guard
│ │ │ └── ProtectedComponent.tsx
│ │ └── index.ts
│ │
│ ├── 📁 hooks/
│ │ ├── index.ts
│ │ ├── useCan.ts # useCan() hook
│ │ └── usePermission.ts # usePermission() hook
│ │
│ ├── 📁 types/
│ │ └── index.ts # (đã có - thêm permission types nếu cần)
│ │
│ └── 📁 utils/
│ └── permission.utils.ts # ⭐ THÊM MỚI: util function helper
│
├── 📁 styles/ # (đã có)
│
└── 📁 TS index.ts # (các file index.ts tổng hợp) xây dựng permission cho dự án với 4 role admin,secretary,teachers,student
