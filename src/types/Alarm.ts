// backend에서 전달되는 AlarmEvent의 타입
export type RiskLevel = "INFO" | "WARNING" | "CRITICAL";

export interface AlarmEvent {
  eventId: string;
  zoneId: string;
  equipId: string;
  sensorType: string;
  sensorValue: number;
  riskLevel: RiskLevel;
  timestamp: string;
  messageBody: string;
  source: string;
}

export interface AbnormalLogDto {
  id: number;
  targetType: 'Sensor' | 'Worker' | 'Equip'; // LogType enum에 따라 수정 필요
  targetId: string;
  abnormalType: string;
  abnVal: number;
  detectedAt: string; // ISO 문자열 (e.g., "2025-05-10T12:00:00Z")
  zoneId: string;
  zoneName: string;
}
