import { useId, useState } from "react";
import type { SubjectDetailView } from "@/features/subjects/services/subjectWorkspaceMock";

// ──── MOCK DATA DEFINITIONS ────

// 1. 케어로(Care-ro) MOCK
const CARERO_LATEST_MOCK = {
  sSensor: { temp: 24.5, humid: 42, aqi: "좋음", motion: true, voltage: "3.2V" },
  aSensor: { temp: 23.8, humid: 45, aqi: "보통", motion: false, voltage: "3.1V" },
  tSensor: { motion: true, voltage: "3.0V", countToday: 12 },
  dSensor: { door: "닫힘", voltage: "3.2V", lastOpen: "08:14" },
  rSensor: { voltage: "5.0V", syncTime: "2026-04-01 13:20:05", status: "ONLINE" },
  medication: {
    enabled: true,
    times: { morning: "08:30", lunch: "13:00", dinner: "18:30" },
    todayDone: { morning: true, lunch: true, dinner: false },
  },
  person: { birthdayType: "양력", birthday: "1948-05-12", residenceType: "독거" },
  guard: { name: "김보호", relation: "아들", phone: "010-9988-7766", careType: "방문돌봄" }
};
const CARERO_CHART_DATA = [
  { time: "06", temp: 22.1, humid: 40 }, { time: "07", temp: 22.4, humid: 40 }, { time: "08", temp: 23.0, humid: 41 },
  { time: "09", temp: 23.5, humid: 41 }, { time: "10", temp: 24.1, humid: 42 }, { time: "11", temp: 24.3, humid: 42 },
  { time: "12", temp: 24.5, humid: 42 }, { time: "13", temp: 24.5, humid: 42 },
];

// 2. 스마트밴드 MOCK
const BAND_MOCK = {
  heartRate: { current: 72, min: 61, max: 110, status: "안정" },
  spo2: { current: 98, status: "정상" },
  steps: { current: 3200, goal: 5000 },
  sleep: { total: "6h 20m", deep: "1h 40m", light: "4h 40m", score: 78 },
  battery: "82%",
  syncTime: "2026-04-01 13:15"
};

// 3. IoT 센서 MOCK
const IOT_MOCK = {
  fire: { status: "안전", battery: "90%" },
  gas: { status: "안전", battery: "85%" },
  motion: { status: "움직임 감지 (거실)", lastActive: "10분 전", battery: "70%" },
  sos: { status: "대기중", battery: "100%" },
  syncTime: "2026-04-01 13:20"
};

// 4. AI 스피커 MOCK
const AI_SPEAKER_MOCK = {
  talkCount: 14,
  emotion: { positive: 25, neutral: 65, negative: 10 },
  topWords: ["트로트", "병원", "날씨", "아들"],
  quiz: { playedToday: true, score: 80, comment: "인지 능력 양호" },
  battery: "전원결선 (100%)",
  syncTime: "2026-04-01 12:40"
};

const TAB_DEFS = [
  { id: "devices", label: "스마트 디바이스 관제" },
  { id: "timeline", label: "알림 타임라인·메모" },
  { id: "service", label: "행정 서비스 및 문서" },
] as const;
type TabId = (typeof TAB_DEFS)[number]["id"];

const DEVICE_TABS = [
  { id: "band", name: "스마트밴드", icon: "⌚" },
  { id: "iot", name: "단독 IoT 센서", icon: "🏠" },
  { id: "speaker", name: "AI 스피커", icon: "🎙️" },
  { id: "carero", name: "케어로 통합돌봄", icon: "🤖" },
] as const;

export function SubjectDetailTabs({ subject }: { readonly subject: SubjectDetailView }) {
  const baseId = useId();
  const [active, setActive] = useState<TabId>("devices");
  const [deviceTab, setDeviceTab] = useState<string>("carero");

  function tabId(tab: TabId) { return `${baseId}-tab-${tab}`; }
  function panelId(tab: TabId) { return `${baseId}-panel-${tab}`; }

  return (
    <div className="flex flex-col h-full min-h-[500px] bg-zinc-50/30">
      <div className="flex gap-2 border-b border-zinc-200 bg-white px-6 pt-4" role="tablist">
        {TAB_DEFS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id} role="tab" aria-selected={isActive} tabIndex={isActive ? 0 : -1} onClick={() => setActive(tab.id)}
              className={["rounded-t-xl px-5 py-3 text-[13px] font-extrabold transition-all relative border border-transparent tracking-wide", isActive ? "bg-zinc-50 text-blue-700 border-x-zinc-200 border-t-zinc-200 translate-y-[1px] shadow-[0_-3px_10px_rgba(0,0,0,0.03)]" : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/50"].join(" ")}
            >
              {tab.label}
              {isActive && <div className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-blue-600 rounded-t-sm" />}
            </button>
          );
        })}
      </div>

      <div className="flex-1 bg-zinc-50 p-6 relative">
        {/* === 1. 기기 및 센서: 4대 스마트 디바이스 관제 === */}
        <div hidden={active !== "devices"} className="animate-in fade-in duration-300">
          
          <div className="flex bg-zinc-200/50 p-1.5 rounded-2xl w-fit mb-6 shadow-inner border border-zinc-200/50">
            {DEVICE_TABS.map(dt => (
              <button
                key={dt.id} onClick={() => setDeviceTab(dt.id)}
                className={["flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-extrabold transition-all", deviceTab === dt.id ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/60" : "text-zinc-500 hover:text-zinc-800"].join(" ")}
              >
                <span className="text-[14px] grayscale-[0.3]">{dt.icon}</span> {dt.name}
              </button>
            ))}
          </div>

          {/* Device Tab Contexts */}
          <div className="bg-white rounded-3xl border border-zinc-200/70 p-6 shadow-sm overflow-hidden min-h-[400px]">
            {/* 1. 스마트밴드 뷰 */}
            {deviceTab === "band" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex justify-between items-end mb-6 border-b border-zinc-100 pb-4">
                  <div>
                    <h3 className="text-[17px] font-extrabold text-zinc-900">손목형 스마트밴드 (바이탈/활동)</h3>
                    <p className="text-[12px] font-medium text-zinc-500 mt-1">실시간 생체 및 활동량 데이터 스트리밍</p>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-bold text-zinc-600">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 rounded-lg border border-zinc-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 배터리 {BAND_MOCK.battery}</span>
                    <span className="text-zinc-400">동기화: {BAND_MOCK.syncTime}</span>
                  </div>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="rounded-2xl bg-zinc-50 p-5 border border-zinc-100 flex flex-col justify-center">
                    <p className="text-[12px] font-extrabold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2"><span className="text-rose-500">❤</span> 심박수 (HR)</p>
                    <div className="flex items-end gap-2">
                       <span className="text-[40px] font-black leading-none text-zinc-900 tabnum">{BAND_MOCK.heartRate.current}</span>
                       <span className="text-[13px] font-bold text-zinc-400 pb-1.5">bpm</span>
                    </div>
                    <div className="mt-4 flex gap-3 text-[12px] font-bold text-zinc-600">
                      <span className="bg-white px-2.5 py-1 rounded border border-zinc-200 shadow-sm">최저 {BAND_MOCK.heartRate.min}</span>
                      <span className="bg-white px-2.5 py-1 rounded border border-zinc-200 shadow-sm">최고 {BAND_MOCK.heartRate.max}</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-zinc-50 p-5 border border-zinc-100">
                     <p className="text-[12px] font-extrabold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">👣 활동량 (걸음)</p>
                     <div className="flex items-end justify-between mt-3">
                        <span className="text-[28px] font-black leading-none text-zinc-900 tabnum">{BAND_MOCK.steps.current.toLocaleString()}</span>
                        <span className="text-[12px] font-bold text-zinc-500 tracking-wide">/ {BAND_MOCK.steps.goal.toLocaleString()} 걸음</span>
                     </div>
                     <div className="w-full h-2.5 bg-zinc-200 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(BAND_MOCK.steps.current/BAND_MOCK.steps.goal)*100}%` }}></div>
                     </div>
                  </div>
                  <div className="rounded-2xl bg-zinc-50 p-5 border border-zinc-100">
                     <p className="text-[12px] font-extrabold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">💤 야간 수면 패턴</p>
                     <div className="flex items-center gap-4 mt-3">
                       <div className="w-16 h-16 rounded-full border-4 border-indigo-100 flex items-center justify-center text-[16px] font-black text-indigo-900">{BAND_MOCK.sleep.score}점</div>
                       <div className="flex flex-col gap-1.5 text-[12px] font-bold text-zinc-600 flex-1">
                          <div className="flex justify-between bg-white px-2.5 py-1.5 rounded-lg shadow-sm border border-zinc-100"><span>총 수면</span> <span className="text-zinc-900">{BAND_MOCK.sleep.total}</span></div>
                          <div className="flex justify-between bg-white px-2.5 py-1.5 rounded-lg shadow-sm border border-zinc-100"><span>깊은 수면</span> <span className="text-indigo-700">{BAND_MOCK.sleep.deep}</span></div>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. 단독 IoT 뷰 */}
            {deviceTab === "iot" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex justify-between items-end mb-6 border-b border-zinc-100 pb-4">
                  <div>
                    <h3 className="text-[17px] font-extrabold text-zinc-900">단독 IoT 무선 센서 (환경/안전)</h3>
                    <p className="text-[12px] font-medium text-zinc-500 mt-1">댁내 화재, 가스, 활동 모니터링 노드</p>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-bold text-zinc-600">
                    <span className="text-zinc-400">네트워크 동기화: {IOT_MOCK.syncTime}</span>
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: "화재 감지기", status: IOT_MOCK.fire.status, safe: true, icon: "🔥", battery: IOT_MOCK.fire.battery },
                    { label: "가스 누출 감지기", status: IOT_MOCK.gas.status, safe: true, icon: "💨", battery: IOT_MOCK.gas.battery },
                    { label: "활동 모션 센서", status: IOT_MOCK.motion.status, safe: true, icon: "🚶", battery: IOT_MOCK.motion.battery },
                    { label: "응급 호출기 (SOS)", status: IOT_MOCK.sos.status, safe: true, icon: "🚨", battery: IOT_MOCK.sos.battery },
                  ].map(s => (
                     <div key={s.label} className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm h-32 hover:border-emerald-300 transition-colors">
                       <div className="flex justify-between items-start">
                         <span className="text-[20px] bg-zinc-50 p-1.5 rounded-xl border border-zinc-100">{s.icon}</span>
                         <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded font-bold text-zinc-400">Bat: {s.battery}</span>
                       </div>
                       <div>
                         <p className="text-[11px] font-extrabold text-zinc-500 tracking-widest">{s.label}</p>
                         <p className={["text-[14px] font-bold mt-1", s.safe ? "text-emerald-700" : "text-rose-600"].join(" ")}>{s.status}</p>
                       </div>
                     </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. AI 스피커 뷰 */}
            {deviceTab === "speaker" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                 <div className="flex justify-between items-end mb-6 border-b border-zinc-100 pb-4">
                  <div>
                    <h3 className="text-[17px] font-extrabold text-zinc-900">거실형 AI 스피커 (발화/정서)</h3>
                    <p className="text-[12px] font-medium text-zinc-500 mt-1">NLP 텍스트 마이닝 및 감정 아키텍처 분석 기반</p>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-bold text-zinc-600">
                    <span className="text-zinc-500 bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200">배터리: {AI_SPEAKER_MOCK.battery}</span>
                  </div>
                </div>
                <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                    <h4 className="text-[12px] font-extrabold text-zinc-500 tracking-widest mb-4">음성 감정 분석 (금일 누적)</h4>
                    <div className="w-full h-8 flex rounded-xl overflow-hidden shadow-inner border border-zinc-200/50">
                       <div className="h-full bg-emerald-400 flex items-center justify-center text-[10px] font-bold text-emerald-900" style={{ width: `${AI_SPEAKER_MOCK.emotion.positive}%` }}>긍정 {AI_SPEAKER_MOCK.emotion.positive}%</div>
                       <div className="h-full bg-zinc-300 flex items-center justify-center text-[10px] font-bold text-zinc-700" style={{ width: `${AI_SPEAKER_MOCK.emotion.neutral}%` }}>중립</div>
                       <div className="h-full bg-rose-400 flex items-center justify-center text-[10px] font-bold text-rose-900" style={{ width: `${AI_SPEAKER_MOCK.emotion.negative}%` }}></div>
                    </div>
                    <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
                      <span className="text-[13px] font-bold text-zinc-800">금일 총 대화 스레드</span>
                      <span className="text-[22px] font-black text-blue-600 tabnum">{AI_SPEAKER_MOCK.talkCount}건</span>
                    </div>
                  </div>
                  <div className="grid grid-rows-2 gap-4">
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 flex flex-col justify-center">
                       <h4 className="text-[11px] font-extrabold text-zinc-400 tracking-widest mb-2">빈출 발화 핵심 키워드</h4>
                       <div className="flex flex-wrap gap-2">
                         {AI_SPEAKER_MOCK.topWords.map(w => <span key={w} className="px-3 py-1.5 bg-white border border-zinc-200 text-[13px] font-extrabold text-zinc-700 rounded-lg shadow-sm"># {w}</span>)}
                       </div>
                    </div>
                    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 flex items-center justify-between">
                       <div>
                         <h4 className="text-[13px] font-extrabold text-indigo-900">치매 예방 액티비티 퀴즈</h4>
                         <p className="text-[12px] font-medium text-indigo-700/80 mt-1">{AI_SPEAKER_MOCK.quiz.comment}</p>
                       </div>
                       <div className="bg-white border border-indigo-100 rounded-xl px-4 py-2 text-center shadow-sm">
                         <span className="block text-[10px] font-bold text-indigo-400 mb-0.5">정답률</span>
                         <span className="text-[20px] font-black text-indigo-700 tabnum">{AI_SPEAKER_MOCK.quiz.score}점</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. 케어로 뷰 (이전 구현물 이식) */}
            {deviceTab === "carero" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                 <div className="flex justify-between items-end mb-6 border-b border-zinc-100 pb-4">
                  <div>
                    <h3 className="text-[17px] font-extrabold text-zinc-900">로봇형 케어로 (Sensors & Care)</h3>
                    <p className="text-[12px] font-medium text-zinc-500 mt-1">carero_person, carero_data_YYMM 테이블 기반 분석</p>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-bold text-zinc-600">
                    <span className="text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200">시스템 {CARERO_LATEST_MOCK.rSensor.status}</span>
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-[1fr_1.5fr_300px]">
                  {/* 1열: 환경 센서 라이브 박스 */}
                  <div className="flex flex-col gap-4">
                    <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-5">
                      <div className="flex justify-between items-end mb-4 border-b border-zinc-200/80 pb-2">
                        <h4 className="text-[13px] font-extrabold text-zinc-800">S-센서 (메인)</h4>
                        <span className="text-[10px] bg-white border border-zinc-200 px-1.5 py-0.5 rounded text-zinc-500 font-mono">{CARERO_LATEST_MOCK.sSensor.voltage}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-3">
                        <div>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">온도 / 습도</span>
                          <span className="text-[16px] font-extrabold text-zinc-900 tabnum">{CARERO_LATEST_MOCK.sSensor.temp}℃<span className="text-[12px] font-bold text-zinc-400 ml-1">/ {CARERO_LATEST_MOCK.sSensor.humid}%</span></span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">공기질 (AQI)</span>
                          <span className="text-[14px] font-bold text-emerald-600">{CARERO_LATEST_MOCK.sSensor.aqi}</span>
                        </div>
                        <div className="col-span-2 rounded-xl bg-white p-2.5 flex items-center justify-between border border-zinc-200 shadow-sm mt-1">
                          <span className="text-[11px] font-bold text-zinc-600">움직임 감지</span>
                          {CARERO_LATEST_MOCK.sSensor.motion ? <span className="text-[10px] font-extrabold bg-blue-100 text-blue-700 px-2 py-0.5 rounded shadow-sm">활성 (Active)</span> : <span className="text-[10px] font-bold text-zinc-400">미감지</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2열: 트렌드 및 보조 센서 */}
                  <div className="flex flex-col gap-4">
                    <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-5 flex-1 flex flex-col">
                      <h4 className="text-[13px] font-extrabold text-zinc-800 mb-4 flex items-center gap-2">실시간 환경 변화 추이 (8H)</h4>
                      <div className="flex-1 relative border-l border-b border-zinc-300 min-h-[140px] pl-2 pb-5 pt-4 pr-4">
                        <div className="w-full h-full flex items-end justify-between px-2">
                          {CARERO_CHART_DATA.map((d, i) => (
                            <div key={i} className="flex flex-col items-center justify-end h-full w-[10%] relative group">
                              <div className="flex items-end gap-1 h-full w-full justify-center">
                                <div className="w-2.5 rounded-t-sm bg-rose-400" style={{ height: `${((d.temp-20)/10)*100}%` }}></div>
                                <div className="w-2.5 rounded-t-sm bg-blue-300" style={{ height: `${((d.humid-20)/40)*100}%` }}></div>
                              </div>
                              <span className="absolute -bottom-5 text-[9px] font-mono text-zinc-400">{d.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-4 shadow-sm">
                        <p className="text-[10px] font-bold uppercase text-zinc-400">T-센서 (화장실)</p>
                        <p className="text-[14px] font-bold text-zinc-800 mt-0.5"><span className="text-blue-600">{CARERO_LATEST_MOCK.tSensor.countToday}회</span> 누적</p>
                      </div>
                      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-4 shadow-sm">
                        <p className="text-[10px] font-bold uppercase text-zinc-400">D-도어값</p>
                        <p className="text-[14px] font-extrabold text-zinc-900 mt-0.5">{CARERO_LATEST_MOCK.dSensor.door}</p>
                      </div>
                    </div>
                  </div>

                  {/* 3열: 복약 상태 */}
                  <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/50 to-white p-5 shadow-sm">
                    <h4 className="text-[13px] font-extrabold text-amber-900 mb-2">금일 복약 모니터링</h4>
                    <p className="text-[10px] text-amber-700 mb-4 font-bold">시간별 설정 (M, L, D)</p>
                    <div className="space-y-3">
                      {[{ label: "아침", time: CARERO_LATEST_MOCK.medication.times.morning, done: CARERO_LATEST_MOCK.medication.todayDone.morning },
                        { label: "점심", time: CARERO_LATEST_MOCK.medication.times.lunch, done: CARERO_LATEST_MOCK.medication.todayDone.lunch },
                        { label: "저녁", time: CARERO_LATEST_MOCK.medication.times.dinner, done: CARERO_LATEST_MOCK.medication.todayDone.dinner }
                      ].map(m => (
                        <div key={m.label} className={["flex justify-between items-center p-3 rounded-xl border", m.done ? "bg-emerald-50 border-emerald-100" : "bg-white border-zinc-200"].join(" ")}>
                          <div><p className="text-[11px] font-bold text-zinc-800">{m.label}</p><p className="text-[10px] font-mono text-zinc-500 mt-0.5">{m.time}</p></div>
                          {m.done ? <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded">완료✓</span> : <span className="text-[10px] bg-zinc-100 text-zinc-500 border border-zinc-200 font-bold px-2 py-0.5 rounded">대기</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* === 2. 타임라인 및 메모 === */}
        <div hidden={active !== "timeline"} className="animate-in fade-in duration-300 grid gap-8 lg:grid-cols-2">
           <section>
             <h3 className="text-[13px] font-bold text-zinc-900 mb-4 border-l-2 border-zinc-300 pl-2">과거 알림 타임라인</h3>
              <ul className="space-y-4 border-l-2 border-zinc-100 pl-4 relative">
                {subject.alertTimeline.map((ev) => (
                  <li key={`${ev.time}-${ev.message}`} className="relative">
                    <span className={["absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white shadow-sm ring-2 ring-transparent", ev.level === "critical" ? "bg-rose-500 ring-rose-100" : ev.level === "warn" ? "bg-amber-500 ring-amber-100" : "bg-zinc-400"].join(" ")} aria-hidden />
                    <time className="font-mono text-[10px] text-zinc-400 block pb-1">{ev.time}</time>
                    <p className="font-bold text-[13px] text-zinc-800 leading-snug">{ev.message}</p>
                  </li>
                ))}
            </ul>
           </section>
           <section>
             <h3 className="text-[13px] font-bold text-zinc-900 mb-4 border-l-2 border-zinc-300 pl-2">운영자 메모</h3>
             <ul className="space-y-3">
               {subject.memos.map((memo) => (
                 <li key={memo} className="bg-[#fff9c4]/30 border border-[#fff59d] p-4 rounded-xl shadow-[0_1px_3px_rgba(255,235,59,0.1)] relative">
                   <p className="text-[12px] font-medium text-[#827717]">{memo}</p>
                 </li>
               ))}
             </ul>
           </section>
        </div>

        {/* === 3. 서비스 및 행정 =================== */}
        <div hidden={active !== "service"} className="animate-in fade-in duration-300">
          <p className="text-[13px] text-zinc-500">진행 중인 행정 서비스 내역이 표시됩니다.</p>
        </div>
      </div>
    </div>
  );
}
