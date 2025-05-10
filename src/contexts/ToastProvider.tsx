import React, { createContext, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { AlarmEvent, RiskLevel } from "../types/Alarm";
import useWebSocket3 from "../websocket/useWebSocket";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

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
    setToasts((prev) => [...prev, alarm]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.eventId !== alarm.eventId));
    }, 10000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.eventId !== id));
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
    navigate(`/zone/${toast.zoneId}`);
  }

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
    console.log("Received message:", message);

    showToast(message);
  }
  useWebSocket3("/topic/alarm",handleWebSocketMessage);

  // useEffect(() => {
  //   const handleWebSocketMessage = (event: MessageEvent) => {
  //     const data = JSON.parse(event.data) as AlarmEvent;
  //     console.log("WebSocket message received:", data);
  //     showToast(data);
  //   }
  // }, []);
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {ReactDOM.createPortal(
        <div className="fixed top-4 right-4 space-y-2 z-50">
          {toasts.map((toast) => (
            <div
              key={toast.eventId}
              onClick={() => handleToastClick(toast)}
              className={`px-4 py-3 rounded shadow-md cursor-pointer transition-all animate-fade-in ${getColor(toast.riskLevel)}`}
            >
              <h3>
                {toast.riskLevel} - {toast.sensorType}
              </h3>
              <div>
                <p>{toast.messageBody}</p>
                <p>{new Date(toast.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>,
        document.getElementById("toast-root") as HTMLElement
      )}
    </ToastContext.Provider>
  );
};
