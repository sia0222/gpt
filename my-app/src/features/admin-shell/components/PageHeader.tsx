import type { ReactNode } from "react";

export type PageHeaderAccent = "solid" | "gradient" | "none";

export type PageHeaderBadgeTone = "neutral" | "danger" | "warning" | "success" | "info";

export interface PageHeaderBadge {
  readonly key?: string;
  readonly label: string;
  readonly tone: PageHeaderBadgeTone;
}

export interface PageHeaderProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description?: ReactNode;
  readonly badges?: readonly PageHeaderBadge[];
  readonly titleSuffix?: ReactNode;
  readonly footer?: ReactNode;
  readonly aside?: ReactNode;
  readonly accent?: PageHeaderAccent;
  readonly className?: string;
  /** 헤더 카드 하단에 이어 붙는 영역(알림·타임라인 등) */
  readonly appendix?: ReactNode;
}

const BADGE_CLASS: Record<PageHeaderBadgeTone, string> = {
  neutral: "rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-800",
  danger:
    "rounded-full bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-900 ring-1 ring-rose-100",
  warning:
    "rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900 ring-1 ring-amber-100",
  success:
    "rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-900 ring-1 ring-emerald-100",
  info: "rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-900 ring-1 ring-blue-100",
};

/**
 * 관리 포털 공통 페이지 헤더 — 상단 강조바, 아이브로우(파란 경로/라벨), 제목·설명·요약 칩 정렬 통일.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  badges,
  titleSuffix,
  footer,
  aside,
  accent = "solid",
  className = "",
  appendix,
}: PageHeaderProps) {
  const accentBar =
    accent === "solid" ? (
      <div className="h-1 bg-blue-600" aria-hidden />
    ) : accent === "gradient" ? (
      <div
        className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500"
        aria-hidden
      />
    ) : null;

  return (
    <header
      className={[
        "overflow-hidden rounded-2xl border border-dash-border/90 bg-dash-surface shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {accentBar}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-blue-600">{eyebrow}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-dash-foreground">{title}</h1>
              {titleSuffix}
            </div>
            {description ? (
              <div className="mt-3 max-w-3xl text-base leading-relaxed text-dash-muted [&_strong]:font-semibold [&_strong]:text-slate-800">
                {description}
              </div>
            ) : null}
            {badges && badges.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {badges.map((b, i) => (
                  <span key={b.key ?? `${b.label}-${i}`} className={BADGE_CLASS[b.tone]}>
                    {b.label}
                  </span>
                ))}
              </div>
            ) : null}
            {footer ? <div className="mt-5 w-full">{footer}</div> : null}
          </div>
          {aside ? (
            <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
              {aside}
            </div>
          ) : null}
        </div>
      </div>
      {appendix ? (
        <div className="border-t border-dash-border/80 px-5 pb-5 pt-4 sm:px-6">{appendix}</div>
      ) : null}
    </header>
  );
}
