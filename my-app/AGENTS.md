# 관리포털 프론트엔드 (STANDARD_FRONTEND)

- **Vite + React + TypeScript + React Router**
- **구조**: `src/features/{domain}/` — barrel `index.ts`, `{Domain}Routes.tsx`, `pages/`, `components/`, `services/`
- **레이아웃**: `features/admin-shell` — 사이드바 1차 메뉴(IA), 상단 breadcrumb·빠른 이동·역할 뱃지(목업)
- **대시보드**: `features/dashboard` — `docs/page-composition-guide.md` 필수 블록 + `docs/dashboard-wireframe.md` 배치
- **대상자**: `features/subjects` — 목록+상세 작업공간(UI만)
- **TanStack Query**: 프로바이더만 연결됨. 현재 화면은 목업 데이터

문서: `docs/admin-portal-plan.md`, `docs/dashboard-wireframe.md`, `docs/page-composition-guide.md`
