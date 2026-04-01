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
  readonly className?: string;
  readonly appendix?: ReactNode;
  // accent prop is deprecated but kept for backwards compatibility
  readonly accent?: PageHeaderAccent;
}

const BADGE_CLASS: Record<PageHeaderBadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
  danger: "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200",
  warning: "bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-200",
  success: "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200",
  info: "bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-200",
};

/**
 * 전역 페이지 헤더 (경량) — 카드 박스를 제거하고 화면 상단에 스며드는 타이포그래피 구조
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  badges,
  titleSuffix,
  footer,
  aside,
  className = "",
  appendix,
}: PageHeaderProps) {
  return (
    <header className={["flex flex-col gap-4", className].filter(Boolean).join(" ")}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex-1 min-w-[280px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
            {eyebrow}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="text-[24px] font-extrabold tracking-tight text-zinc-900">
              {title}
            </h1>
            {titleSuffix}
            {badges && badges.length > 0 && (
              <div className="ml-2 flex flex-wrap gap-1.5 align-middle">
                {badges.map((b, i) => (
                  <span
                    key={b.key ?? `${b.label}-${i}`}
                    className={[
                      "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      BADGE_CLASS[b.tone],
                    ].join(" ")}
                  >
                    {b.label}
                  </span>
                ))}
              </div>
            )}
          </div>
          {description && (
            <div className="mt-2 max-w-3xl text-[13px] leading-relaxed text-zinc-500">
              {description}
            </div>
          )}
          {footer && <div className="mt-4 w-full">{footer}</div>}
        </div>
        {aside && (
          <div className="flex shrink-0 items-center justify-end gap-3 sm:items-end">
            {aside}
          </div>
        )}
      </div>
      {appendix && (
        <div className="pt-2">
          {appendix}
        </div>
      )}
    </header>
  );
}
