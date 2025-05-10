import React from "react";
import { RiskLevel } from "../types/Alarm";

type ToastProps = {
  message: string;
  riskLevel: RiskLevel;
  sensorType: string;
  timestamp: string;
  onClick?: () => void;
};

const getColor = (riskLevel: RiskLevel) => {
  switch (riskLevel) {
    case "CRITICAL":
      return "red alert-box";
    case "WARNING":
      return "yellow alert-box";
    case "INFO":
    default:
      return "blue alert-box";
  }
};

const Toast: React.FC<ToastProps> = ({
  message,
  riskLevel,
  sensorType,
  timestamp,
  onClick,
}) => {
  const color = getColor(riskLevel);
  const formattedTime = new Date(timestamp).toLocaleTimeString();

  return (
    <div onClick={onClick} className={color}>
      <h3>
        {riskLevel} - {sensorType}
      </h3>
      <div>
        <p>{message}</p>
        <p>{formattedTime}</p>
      </div>
    </div>
  );
};

export default Toast;
