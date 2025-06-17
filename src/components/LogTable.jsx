import { useRef } from "react";
import "../styles/table.css";

export default function LogTable({ logs, onScrollEnd, scrollBoxRef }) {
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      onScrollEnd();
    }
  };
  return (
    <div
      ref={scrollBoxRef}
      style={{ maxHeight: "40vh", overflowY: "scroll" }}
      onScroll={handleScroll}
    >
      <div className="table-container">
        <table className="logs-table">
          <thead>
            <tr className="table-header">
              <th style={{ width: "2%" }}>발생 시각</th>
              <th style={{ width: "1%" }}>분류</th>
              <th style={{ width: "2%" }}>상태</th>
              {/* <th style={{ width: "2%" }}>위험도</th> */}
              <th style={{ width: "4%" }}>대상</th>
              <th style={{ width: "2%" }}>비고</th>
            </tr>
          </thead>
          <tbody>
            {!logs?.length && (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "0.5rem" }}
                >
                  로그가 없습니다
                </td>
              </tr>
            )}
            {logs?.map((l, i) => {
              return (
                <tr
                  key={i}
                  className={
                    l.dangerLevel == 2
                      ? "critical"
                      : l.dangerLevel == 1
                      ? "warning"
                      : ""
                  }
                >
                  <td>{new Date(l.timestamp).toLocaleString()}</td>
                  <td>{l.targetType}</td>
                  <td>{l.abnormalType}</td>
                  <td>{l.sensorType}</td>
                  {/* <td>{l.dangerLevel}</td> */}
                  <td>{l.dangerLevel == 2?"위험":l.dangerLevel == 1 ? "경고" : "정상"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
