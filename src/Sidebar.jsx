import { Link, useLocation } from "react-router-dom";
import MenuIcon from "./assets/menu_icon.svg?react";
import HomeIcon from "./assets/home_icon.svg?react";
import MonitorIcon from "./assets/monitor_icon.svg?react";
import ToolIcon from "./assets/tool_icon.svg?react";
import ReportIcon from "./assets/report_icon.svg?react";
import BellIcon from "./assets/bell_icon.svg?react";
import CloseIcon from "./assets/close_icon.svg?react";
import Logo from "./assets/logo.svg?react";
import WorkerIcon from "./assets/worker_icon.svg?react";
import { useEffect, useCallback, useState } from "react";

import AlarmModal from "./components/AlarmModal";
import axiosInstance, { resetAlertFlag } from "./api/axiosInstance";
import { useWebSocket2 } from "./websocket/useWebSocket";

export default function Sidebar({ isOpen, setIsOpen }) {
  const [alram_count, setAlramCount] = useState(0); // 알림 개수
  const [isModalOpen, setIsModalOpen] = useState(false); // 알림 모달 상태
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState("Home");

  const handleWebSocketMessage = useCallback((count) => {
    setAlramCount(count);
  }, []);
  // 웹소켓 연결
  useWebSocket2(
    "/topic/unread-count",
    handleWebSocketMessage,
    localStorage.getItem("isLoggedIn") === "true"
  );

  // 첫 렌더링 시 알람 개수 초기화
  useEffect(() => {
    axiosInstance
      .get("/api/abnormal/unread-count")
      .then((res) => {
        setAlramCount(res.data.data);
      })
      .catch((e) => {
        console.error("알림 개수를 불러오는 데 실패했습니다:", e);
        setAlramCount(0);
      });
    resetAlertFlag();
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/") setCurrentPage("Home");
    else if (
      location.pathname.startsWith("/monitoring") ||
      location.pathname.startsWith("/zone")
    )
      setCurrentPage("Monitor");
    else if (location.pathname.startsWith("/safety")) setCurrentPage("Safety");
    else if (location.pathname.startsWith("/facility"))
      setCurrentPage("Facility");
    else if (location.pathname.startsWith("/settings"))
      setCurrentPage("Sensor");
    else if (location.pathname.startsWith("/report")) setCurrentPage("Report");
  }, [location.pathname]);

  return (
    <aside className={isOpen ? "sidebar-open" : "sidebar-close"}>
      {!isOpen && (
        <div>
          <span className="icon side-opt">
            <Link
              style={{ marginTop: "0.5rem" }}
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              <MenuIcon fill="#FFF" width="1.5rem" />
            </Link>
          </span>
        </div>
      )}
      {isOpen && (
        <div className="sidebar-open">
          <span className="icon side-opt">
            <Logo color="#fff" width="2.25rem" />
          </span>
          <span className="icon side-opt">
            <Link
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              <CloseIcon fill="#FFF" width="1.5rem" />
            </Link>
          </span>
        </div>
      )}
      <div className="sidebar-menu">
        <div>
          <span
            className="icon side-opt"
            onClick={() => setCurrentPage("Home")}
          >
            <Link to="/">
              <HomeIcon
                fill={currentPage === "Home" ? "#608DFF" : "#FFF"}
                width="1.5rem"
              />
              {isOpen && (
                <p
                  className={`${
                    currentPage === "Home" ? "current-page" : ""
                  } sidebar-open`}
                >
                  HOME
                </p>
              )}
            </Link>
          </span>
        </div>
        <div>
          <span
            className="icon side-opt"
            onClick={() => setCurrentPage("Monitor")}
          >
            <Link to="/monitoring">
              <MonitorIcon
                fill={currentPage == "Monitor" ? "#608DFF" : "#FFF"}
                width="1.5rem"
              />
              {isOpen && (
                <p
                  className={`${
                    currentPage == "Monitor" ? "current-page" : ""
                  } sidebar-open`}
                >
                  모니터링
                </p>
              )}
            </Link>
          </span>
        </div>
        <div>
          <span
            className="icon side-opt"
            onClick={() => setCurrentPage("Safety")}
          >
            <Link to="/safety">
              <WorkerIcon
                fill={currentPage === "Safety" ? "#608DFF" : "#FFF"}
                width="1.5rem"
              />
              {isOpen && (
                <p
                  className={`${
                    currentPage === "Safety" ? "current-page" : ""
                  } sidebar-open`}
                >
                  작업자 관리
                </p>
              )}
            </Link>
          </span>
        </div>
        <div>
          <span
            className="icon side-opt"
            onClick={() => setCurrentPage("Sensor")}
          >
            <Link to="/settings">
              <ToolIcon
                stroke={currentPage === "Sensor" ? "#608DFF" : "#FFF"}
                width="1.5rem"
              />
              {isOpen && (
                <p
                  className={`${
                    currentPage === "Sensor" ? "current-page" : ""
                  } sidebar-open`}
                >
                  설비/센서 관리
                </p>
              )}
            </Link>
          </span>
        </div>
        <div>
          <span
            className="icon side-opt"
            onClick={() => setCurrentPage("Report")}
          >
            <Link to="/report">
              <ReportIcon
                // stroke={currentPage === "Certification" ? "#608DFF" : "#FFF"}
                fill={currentPage === "Report" ? "#608DFF" : "#FFF"}
                width="1.5rem"
              />
              {isOpen && (
                <p
                  className={`${
                    currentPage === "Report" ? "current-page" : ""
                  } sidebar-open`}
                >
                  월간 리포트
                </p>
              )}
            </Link>
          </span>
        </div>
      </div>
      <div style={{ marginBottom: "1.2rem" }}>
        <div className={isOpen ? "alram-box" : "alram-box sidebar-close"}>
          <span
            className="icon"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <span className="icon">
              <BellIcon
                fill={
                  alram_count > 0 ? (isOpen ? "#FFF" : "orangered") : "#FFF"
                }
                width="1.5rem"
              />
            </span>
            {isOpen && (
              <p className="alram-text">
                읽지 않은 알림이 <br></br>
                {alram_count}건 있습니다
              </p>
            )}
          </span>
        </div>
        {/* 로그아웃 버튼 */}
        {/* <div className="logout-button">
          <span className="icon side-opt" onClick={handleButtonClick}>
            <a>
              <LogoutIcon
                stroke="red"
                fill="red"
                width="0.9rem"
                style={{ transform: "translateY(-2px)" }}
              />
              {isOpen && (
                <p
                  className={`sidebar-open`}
                  style={{
                    color: "red",
                    fontWeight: "550",
                    fontSize: "1rem",
                    marginLeft: "0.5rem",
                  }}
                >
                  로그아웃
                </p>
              )}
            </a>
          </span>
        </div> */}
      </div>
      {/* 알람 모달 */}
      <AlarmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </aside>
  );
}
