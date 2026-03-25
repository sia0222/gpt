import { useMemo } from "react";

/** 화면 데모용 최종 갱신 시각 (백엔드 없음) */
export function useAdminLastUpdated() {
  return useMemo(() => {
    const d = new Date();
      const p = (n: number) => n.toString().padStart(2, "0");
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }, []);
}
