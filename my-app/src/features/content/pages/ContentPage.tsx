import { PageHeader } from "@/features/admin-shell";

/**
 * 콘텐츠 관리 — 자산 축 (page-composition-guide §3.4)
 */
export function ContentPage() {
  const blocks = [
    { title: "게시판 관리", desc: "공지·뉴스·FAQ — 목록/승인/예약게시 UI 자리" },
    { title: "배너/팝업", desc: "노출 기간·위치·우선순위 설정 UI 자리" },
    { title: "지도 카테고리", desc: "카테고리·마커·노출 여부 UI 자리" },
    { title: "변경 이력", desc: "승인 상태·감사 로그 연동 자리" },
  ] as const;

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="포털 · 콘텐츠"
        title="콘텐츠 관리"
        description="게시판·배너·지도 카테고리 등 포털 콘텐츠 자산을 모듈 단위로 다룹니다. (UI 자리)"
      />
      <ul className="grid gap-4 md:grid-cols-2">
        {blocks.map((b) => (
          <li
            key={b.title}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h2 className="text-sm font-semibold text-slate-900">{b.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{b.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
