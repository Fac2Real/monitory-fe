import { useEffect, useState, useCallback } from "react";
import MonitorBox from "../components/MonitorBox";
import useWebSocket from "../websocket/useWebSocket";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function Monitoring() {
  const [zoneList, setZoneList] = useState([]);

  // 렌더링 될때마다 불필요한 websocket 연결을 피하기 위해 useCallback 사용
  const handleWebSocketMessage = useCallback((data) => {
    setZoneList((prev) =>
      prev?.map((zone) =>
        zone.zoneId === data.zoneId
          ? {
              ...zone,
              level: data.level,
              abnormal_sensor: data.sensorType,
            }
          : zone
      )
    );
  }, []);
  // 메시지 예: {"zoneId":"PID-790","sensorType":"humid","level":2}

  useWebSocket(
    "/topic/zone",
    handleWebSocketMessage,
    localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    Promise.all([
      axiosInstance.get("/api/zones"),
      axiosInstance.get("/api/state/zones"), // 상태가 있는 zone 정보 가져오기
    ])
      .then(([zonesRes, statesRes]) => {
        const updated = zonesRes.data.data; // 예: [{ zoneId, zoneName, level }, ...]
        const stateMap = Object.fromEntries(
          // 예: { "PID-790": {level:2, sensorType:"humid"}, ... }
          statesRes.data.data?.map((s) => [s.zoneId, s])
        );
        const merged = updated?.map((z) => {
          const nowState = stateMap[z.zoneId];
          if (!nowState) return z; // 상태가 없는 zone은 그대로 반환
          const { sensorType, ...restState } = nowState;
          return {
            ...z,
            ...restState,
            abnormal_sensor: sensorType, // sensorType을 abnormal_sensor로 변경
          };
        });

        setZoneList(merged);
      })
      .catch((e) => {
        console.error("공간 목록을 불러오는 데 실패했습니다:", e);
        setZoneList([]);
      });
  }, []);

  return (
    <>
      <h1>실시간 모니터링</h1>
      <div className="monitor-body">
        <div>
          {zoneList?.length !== 0 &&
            zoneList?.map((z, i) => (
              <Link
                key={i}
                to={`/zone/${z.zoneId}`}
                state={{ zoneName: z.zoneName }}
                className="link-as-contents"
              >
                <MonitorBox zone={z} />
              </Link>
            ))}
          {zoneList.length === 0 && (
            <Link to="/settings">
              센서 관리 페이지에서 새 공간을 등록하세요(click)
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
