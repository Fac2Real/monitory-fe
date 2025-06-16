import React, { createContext, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { AlarmEvent, RiskLevel } from "../types/Alarm";
import { useWebSocket3 } from "../websocket/useWebSocket";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import MonitorIcon from "../components/MonitorIcon";

type ToastContextType = {
  showToast: (alarm: AlarmEvent) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<AlarmEvent[]>([]);
  const navigate = useNavigate();

  const showToast = (alarm: AlarmEvent) => {
    if (alarm.riskLevel == "CRITICAL" || alarm.riskLevel == "WARNING") {
      setToasts((prev) => [alarm, ...prev]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.eventId !== alarm.eventId));
      }, 10000);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev?.filter((t) => t.eventId !== id));
  };

  const handleToastClick = async (toast: AlarmEvent) => {
    // 알람 읽음 상태를 서버에 전달
    await axiosInstance(`/api/abnormal/${toast.eventId}/read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // 알람 삭제
    removeToast(toast.eventId);

    // 알람 상세 페이지로 이동
    navigate(`/monitoring`, {
      state: {
        zoneName: toast.zoneName,
      },
    });
  };

  const getColor = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case "CRITICAL":
        return "alert-box red";
      case "WARNING":
        return "alert-box yellow";
      case "INFO":
      default:
        return "alert-box blue";
    }
  };
  const handleWebSocketMessage = (message: AlarmEvent) => {
    showToast(message);
  };
  useWebSocket3(
    "/topic/alarm",
    handleWebSocketMessage,
    localStorage.getItem("isLoggedIn") === "true"
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {ReactDOM.createPortal(
        <div className="fixed top-4 right-4 space-y-2 z-50 pointer-events-none">
          <div className="absolute top-4 right-4 space-y-2 pointer-events-auto">
            {toasts
              .reduce<AlarmEvent[]>((uniqueToasts, toast) => {
                const isDuplicate = uniqueToasts.some(
                  (t: AlarmEvent) =>
                    t.zoneId === toast.zoneId && t.equipId === toast.equipId
                );
                if (!isDuplicate) {
                  uniqueToasts.push(toast);
                }
                return uniqueToasts;
              }, [])
              ?.map((toast) => {
                return (
                  <div
                    key={toast.eventId}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToastClick(toast);
                    }}
                    className={`px-4 py-3 rounded shadow-md cursor-pointer transition-all animate-fade-in ${getColor(
                      toast.riskLevel
                    )}`}
                  >
                    <MonitorIcon
                      abnormal_sensor={toast.sensorType}
                      level={toast.riskLevel}
                      color={"white"}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                      }}
                    >
                      <h3>
                        {toast.riskLevel} - {toast.zoneName}
                      </h3>
                      <div>
                        <p>{toast.messageBody}</p>
                        <p>{toast.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>,
        document.getElementById("toast-root") as HTMLElement
      )}
    </ToastContext.Provider>
  );
};
