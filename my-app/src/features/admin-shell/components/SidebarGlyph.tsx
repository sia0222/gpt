import type { SVGProps } from "react";

type G = SVGProps<SVGSVGElement>;
const NAV_ICON_STROKE_WIDTH = 2;

export function GlyphLayout({ className, ...p }: G) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
      <rect x="3.5" y="4" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth={NAV_ICON_STROKE_WIDTH} />
      <rect x="13" y="4" width="7.5" height="16" rx="2" stroke="currentColor" strokeWidth={NAV_ICON_STROKE_WIDTH} />
      <rect x="3.5" y="14" width="7.5" height="6" rx="2" stroke="currentColor" strokeWidth={NAV_ICON_STROKE_WIDTH} />
    </svg>
  );
}

export function GlyphPeople({ className, ...p }: G) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth={NAV_ICON_STROKE_WIDTH} />
      <path
        d="M3.5 19v-0.8A4.8 4.8 0 018.3 13.4h1.4a4.8 4.8 0 014.8 4.8v0.8M16.5 10.8h4.5M18.75 8.5v4.6"
        stroke="currentColor"
        strokeWidth={NAV_ICON_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GlyphRadar({ className, ...p }: G) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
      <path
        d="M12 4a8 8 0 108 8M12 4v3.4M20 12h-3.4"
        stroke="currentColor"
        strokeWidth={NAV_ICON_STROKE_WIDTH}
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth={NAV_ICON_STROKE_WIDTH} />
    </svg>
  );
}

export function GlyphArticle({ className, ...p }: G) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
      <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth={NAV_ICON_STROKE_WIDTH} />
      <path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth={NAV_ICON_STROKE_WIDTH} strokeLinecap="round" />
    </svg>
  );
}

export function GlyphChart({ className, ...p }: G) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
      <path d="M5 19V7M10 19v-5M15 19V9M20 19v-8" stroke="currentColor" strokeWidth={NAV_ICON_STROKE_WIDTH} strokeLinecap="round" />
    </svg>
  );
}

export function GlyphBell({ className, ...p }: G) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
      <path
        d="M15.2 17H20l-1.25-1.25A1.9 1.9 0 0118.2 14.4v-2.7a6.2 6.2 0 10-12.4 0v2.7c0 .5-.2 1-.55 1.35L4 17h4.8m6.4 0v.8a3.2 3.2 0 01-6.4 0V17m6.4 0H8.8"
        stroke="currentColor"
        strokeWidth={NAV_ICON_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GlyphGear({ className, ...p }: G) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth={NAV_ICON_STROKE_WIDTH} />
      <path
        d="M19.4 12a1.6 1.6 0 011 .3l.05.03a1.9 1.9 0 010 3.3l-.05.03a1.6 1.6 0 01-1 .3 1.6 1.6 0 00-1.45.94l-.03.07a1.6 1.6 0 00.2 1.7l.04.05a1.9 1.9 0 01-2.33 2.33l-.05-.04a1.6 1.6 0 00-1.7-.2l-.07.03a1.6 1.6 0 00-.94 1.45 1.6 1.6 0 01-.3 1l-.03.05a1.9 1.9 0 01-3.3 0l-.03-.05a1.6 1.6 0 01-.3-1 1.6 1.6 0 00-.94-1.45l-.07-.03a1.6 1.6 0 00-1.7.2l-.05.04a1.9 1.9 0 01-2.33-2.33l.04-.05a1.6 1.6 0 00.2-1.7l-.03-.07A1.6 1.6 0 004.6 16a1.6 1.6 0 01-1-.3l-.05-.03a1.9 1.9 0 010-3.3l.05-.03a1.6 1.6 0 011-.3 1.6 1.6 0 001.45-.94l.03-.07a1.6 1.6 0 00-.2-1.7l-.04-.05a1.9 1.9 0 012.33-2.33l.05.04a1.6 1.6 0 001.7.2l.07-.03A1.6 1.6 0 009.6 5.6a1.6 1.6 0 01.3-1l.03-.05a1.9 1.9 0 013.3 0l.03.05a1.6 1.6 0 01.3 1 1.6 1.6 0 00.94 1.45l.07.03a1.6 1.6 0 001.7-.2l.05-.04a1.9 1.9 0 012.33 2.33l-.04.05a1.6 1.6 0 00-.2 1.7l.03.07A1.6 1.6 0 0019.4 12z"
        stroke="currentColor"
        strokeWidth={NAV_ICON_STROKE_WIDTH}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GlyphPanelLeft({ className, ...p }: G) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth={NAV_ICON_STROKE_WIDTH} />
      <path d="M9 4v16" stroke="currentColor" strokeWidth={NAV_ICON_STROKE_WIDTH} />
    </svg>
  );
}
