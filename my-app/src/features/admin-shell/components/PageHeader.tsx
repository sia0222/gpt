import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

/** 헤더 우측 등록/액션 버튼 — 모든 페이지에서 동일한 디자인 사용 */
export function PageHeaderAction({
  children,
  variant = "primary",
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "h-10 rounded-xl px-5 text-[12px] font-extrabold transition-all flex items-center gap-2 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1";
  const variants = {
    primary:
      "text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 shadow-sm focus:ring-zinc-500",
    secondary:
      "text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 shadow-sm focus:ring-zinc-300",
  };
  return (
    <button
      type="button"
      className={[base, variants[variant], className].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

/** 헤더 액션 버튼에 쓰는 + 아이콘 */
export function PlusIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

export type PageHeaderAccent = "solid" | "gradient" | "none";
export type PageHeaderBadgeTone = "neutral" | "danger" | "warning" | "success" | "info";

export interface PageHeaderBadge {
  readonly key?: string;
  readonly label: string;
  readonly tone: PageHeaderBadgeTone;
}

/** 페이지 경로(브레드크럼) · 페이지 타이틀(h1) 타이포는 전역 고정 */
const PATH_CLASS = "text-[12px] font-semibold uppercase tracking-widest text-zinc-400";
const TITLE_CLASS = "text-[22px] font-extrabold tracking-tight text-zinc-900 leading-tight";

export interface PageHeaderProps {
  /** 경로 표기 — 반드시 `OVERVIEW · {한글 페이지명}` (중간 구분은 ` · ` 공백 포함) */
  readonly eyebrow: string;
  /** 페이지 타이틀 */
  readonly title: string;
  readonly backPath?: string;
  readonly badges?: readonly PageHeaderBadge[];
  readonly titleSuffix?: ReactNode;
  /** h1 바로 아래, 타이틀이 아닌 보조 메타(대상자 성별·나이·주소 등) */
  readonly postTitle?: ReactNode;
  readonly footer?: ReactNode;
  readonly aside?: ReactNode;
  readonly className?: string;
  readonly appendix?: ReactNode;
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
 * 전역 페이지 헤더 — 경로(eyebrow)와 타이틀(h1) 타이포를 모든 페이지에서 동일하게 유지
 */
export function PageHeader({
  eyebrow,
  title,
  backPath,
  badges,
  titleSuffix,
  postTitle,
  footer,
  aside,
  className = "",
  appendix,
}: PageHeaderProps) {
  return (
    <header className={["flex flex-col gap-4", className].filter(Boolean).join(" ")}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex min-w-[280px] flex-1 items-start gap-4">
          {backPath ? (
            <Link
              to={backPath}
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              aria-label="뒤로 가기"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          ) : null}
          <div className="min-w-0 flex-1">
            <p className={PATH_CLASS}>{eyebrow}</p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className={TITLE_CLASS}>{title}</h1>
              {titleSuffix}
              {badges && badges.length > 0 ? (
                <div className="ml-2 flex flex-wrap gap-1.5 align-middle">
                  {badges.map((b, i) => (
                    <span
                      key={b.key ?? `${b.label}-${i}`}
                      className={[
                        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[12px] font-semibold uppercase tracking-wide",
                        BADGE_CLASS[b.tone],
                      ].join(" ")}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            {postTitle ? <div className="mt-2 max-w-3xl">{postTitle}</div> : null}
            {footer ? <div className="mt-4 w-full">{footer}</div> : null}
          </div>
        </div>
        {aside ? (
          <div className="flex shrink-0 items-center justify-end gap-3 sm:items-end">{aside}</div>
        ) : null}
      </div>
      {appendix ? <div className="pt-2">{appendix}</div> : null}
    </header>
  );
}
