export interface HourlyMetric {
  readonly hour: string;
  readonly value: number;
}

export const CO2_TREND_PPM: readonly HourlyMetric[] = [
  { hour: "00", value: 612 },
  { hour: "04", value: 705 },
  { hour: "08", value: 848 },
  { hour: "12", value: 932 },
  { hour: "16", value: 821 },
  { hour: "20", value: 742 },
] as const;

export const TEMPERATURE_TREND: readonly HourlyMetric[] = [
  { hour: "00", value: 22 },
  { hour: "04", value: 21 },
  { hour: "08", value: 23 },
  { hour: "12", value: 25 },
  { hour: "16", value: 24 },
  { hour: "20", value: 23 },
] as const;

export const SERVICE_COMPLETION_RATE: readonly HourlyMetric[] = [
  { hour: "1주", value: 86 },
  { hour: "2주", value: 91 },
  { hour: "3주", value: 88 },
  { hour: "4주", value: 94 },
] as const;

export const FACILITY_OCCUPANCY = [
  { name: "행복요양센터", occupancy: 92, co2: 901 },
  { name: "늘봄주간보호", occupancy: 78, co2: 746 },
  { name: "우리동네돌봄", occupancy: 84, co2: 812 },
] as const;

export const CRISIS_HOUSEHOLDS = [
  { district: "중구", count: 18, highRisk: 6 },
  { district: "남구", count: 24, highRisk: 8 },
  { district: "북구", count: 13, highRisk: 4 },
  { district: "동구", count: 20, highRisk: 7 },
] as const;
