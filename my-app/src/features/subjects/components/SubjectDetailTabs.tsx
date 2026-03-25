import { useId, useState } from "react";
import type { SubjectDetailView } from "@/features/subjects/services/subjectWorkspaceMock";

const TAB_DEFS = [
  { id: "basic", label: "기본정보" },
  { id: "devices", label: "연결 기기" },
  { id: "realtime", label: "실시간 수집" },
  { id: "health", label: "헬스케어 이력" },
  { id: "service", label: "서비스·상담" },
  { id: "docs", label: "메모·첨부" },
] as const;

type TabId = (typeof TAB_DEFS)[number]["id"];

interface SubjectDetailTabsProps {
  readonly subject: SubjectDetailView;
}

export function SubjectDetailTabs({ subject }: SubjectDetailTabsProps) {
  const baseId = useId();
  const [active, setActive] = useState<TabId>("basic");

  function tabId(tab: TabId) {
    return `${baseId}-tab-${tab}`;
  }

  function panelId(tab: TabId) {
    return `${baseId}-panel-${tab}`;
  }

  const deviceLabel =
    subject.devices.length > 0
      ? `연결 기기 (${subject.devices.length})`
      : "연결 기기";

  const tabsWithLabel = TAB_DEFS.map((t) =>
    t.id === "devices" ? { ...t, label: deviceLabel } : t,
  );

  return (
    <div>
      <div
        className="flex flex-wrap gap-1 border-b border-slate-200"
        role="tablist"
        aria-label="대상자 상세 탭"
      >
        {tabsWithLabel.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              id={tabId(tab.id)}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId(tab.id)}
              tabIndex={isActive ? 0 : -1}
              className={[
                "rounded-t-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white text-slate-900 ring-1 ring-slate-200 ring-b-white"
                  : "text-slate-600 hover:bg-slate-50",
              ].join(" ")}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id={panelId("basic")}
        role="tabpanel"
        aria-labelledby={tabId("basic")}
        hidden={active !== "basic"}
        className="rounded-b-xl rounded-tr-xl border border-t-0 border-slate-200 bg-white p-4 text-sm text-slate-600 sm:p-5"
      >
        <h2 className="sr-only">기본정보</h2>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2">
            <dt className="text-xs text-slate-500">돌봄·요양 구분</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{subject.careGrade}</dd>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2">
            <dt className="text-xs text-slate-500">서비스 시작일</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{subject.serviceStartDate}</dd>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2">
            <dt className="text-xs text-slate-500">주요 서비스</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{subject.primaryService}</dd>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2">
            <dt className="text-xs text-slate-500">담당</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{subject.caseManager}</dd>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2">
            <dt className="text-xs text-slate-500">연락처</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{subject.phone}</dd>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2 sm:col-span-2 lg:col-span-3">
            <dt className="text-xs text-slate-500">주소</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{subject.address}</dd>
          </div>
        </dl>

        {subject.alertTimeline.length > 0 ? (
          <section className="mt-4 border-t border-slate-100 pt-4" aria-label="알림·조치 타임라인 전체">
            <h3 className="text-xs font-semibold text-slate-800">알림·조치 타임라인</h3>
            <ul className="mt-2 space-y-2">
              {subject.alertTimeline.map((ev) => (
                <li
                  key={`${ev.time}-${ev.message}`}
                  className="flex gap-3 rounded-lg border border-slate-100 px-3 py-2 text-xs"
                >
                  <span className="w-14 shrink-0 font-mono text-slate-500">{ev.time}</span>
                  <span
                    className={[
                      "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                      ev.level === "critical"
                        ? "bg-rose-100 text-rose-900"
                        : ev.level === "warn"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-slate-100 text-slate-600",
                    ].join(" ")}
                  >
                    {ev.level}
                  </span>
                  <span className="text-slate-800">{ev.message}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <div
        id={panelId("devices")}
        role="tabpanel"
        aria-labelledby={tabId("devices")}
        hidden={active !== "devices"}
        className="rounded-b-xl rounded-tr-xl border border-t-0 border-slate-200 bg-white p-4 text-sm text-slate-600 sm:p-5"
      >
        <h2 className="sr-only">연결 기기</h2>
        {subject.devices.length === 0 ? (
          <p className="text-sm text-slate-500">등록된 기기가 없습니다. (목업)</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <caption className="sr-only">연결 기기 목록</caption>
              <thead className="border-b border-slate-100 text-xs text-slate-500">
                <tr>
                  <th className="py-2 pr-3 font-medium">기기</th>
                  <th className="py-2 pr-3 font-medium">상태</th>
                  <th className="py-2 font-medium">배터리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subject.devices.map((device) => (
                  <tr key={device.name}>
                    <td className="py-3 font-medium text-slate-900">{device.name}</td>
                    <td className="py-3 text-slate-700">{device.status}</td>
                    <td className="py-3 font-mono text-xs text-slate-600">{device.battery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div
        id={panelId("realtime")}
        role="tabpanel"
        aria-labelledby={tabId("realtime")}
        hidden={active !== "realtime"}
        className="rounded-b-xl rounded-tr-xl border border-t-0 border-slate-200 bg-white p-4 text-sm text-slate-600 sm:p-5"
      >
        <h2 className="sr-only">실시간 수집</h2>
        {subject.realtime.length === 0 ? (
          <p className="text-sm text-slate-500">수신 중인 실시간 값이 없습니다. 단말 연결을 확인하세요. (목업)</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subject.realtime.map((row) => (
              <li key={row.label} className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs text-slate-500">{row.label}</p>
                <p
                  className={
                    row.level === "warn"
                      ? "mt-1 text-lg font-semibold text-rose-700"
                      : "mt-1 text-lg font-semibold text-slate-900"
                  }
                >
                  {row.value}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        id={panelId("health")}
        role="tabpanel"
        aria-labelledby={tabId("health")}
        hidden={active !== "health"}
        className="rounded-b-xl rounded-tr-xl border border-t-0 border-slate-200 bg-white p-4 text-sm text-slate-600 sm:p-5"
      >
        <h2 className="sr-only">헬스케어 이력</h2>
        {subject.healthcareLogs.length === 0 ? (
          <p className="text-sm text-slate-500">기록이 없습니다.</p>
        ) : (
          <ol className="space-y-2 border-l-2 border-blue-100 pl-4">
            {subject.healthcareLogs.map((log) => (
              <li key={`${log.date}-${log.note}`} className="text-sm">
                <time className="font-mono text-xs text-slate-500">{log.date}</time>
                <p className="mt-0.5 text-slate-800">{log.note}</p>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div
        id={panelId("service")}
        role="tabpanel"
        aria-labelledby={tabId("service")}
        hidden={active !== "service"}
        className="rounded-b-xl rounded-tr-xl border border-t-0 border-slate-200 bg-white p-4 text-sm text-slate-600 sm:p-5"
      >
        <h2 className="sr-only">서비스·상담</h2>
        {subject.services.length === 0 ? (
          <p className="text-sm text-slate-500">진행 중인 서비스가 없습니다.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {subject.services.map((service) => (
              <li key={`${service.type}-${service.nextVisit}`} className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">{service.type}</p>
                <p className="mt-1 text-xs text-slate-500">
                  담당 <span className="font-medium text-slate-700">{service.manager}</span>
                </p>
                <p className="mt-2 text-sm text-slate-600">다음 일정: {service.nextVisit}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        id={panelId("docs")}
        role="tabpanel"
        aria-labelledby={tabId("docs")}
        hidden={active !== "docs"}
        className="rounded-b-xl rounded-tr-xl border border-t-0 border-slate-200 bg-white p-4 text-sm text-slate-600 sm:p-5"
      >
        <h2 className="sr-only">메모·첨부</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <h3 className="text-xs font-semibold text-slate-800">운영 메모</h3>
            {subject.memos.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">메모 없음</p>
            ) : (
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
                {subject.memos.map((memo) => (
                  <li key={memo}>{memo}</li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h3 className="text-xs font-semibold text-slate-800">첨부·문서</h3>
            {subject.attachments.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">첨부 파일 없음</p>
            ) : (
              <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200">
                {subject.attachments.map((f) => (
                  <li key={f.fileName} className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
                    <span className="min-w-0 truncate font-medium text-slate-900">{f.fileName}</span>
                    <span className="shrink-0 text-slate-500">
                      {f.kind} · {f.uploadedAt}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
