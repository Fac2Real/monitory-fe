import { Link, useLocation } from "react-router-dom";
import MenuIcon from "./assets/menu_icon.svg?react";
import HomeIcon from "./assets/home_icon.svg?react";
import MonitorIcon from "./assets/monitor_icon.svg?react";
import ToolIcon from "./assets/tool_icon.svg?react";
import AwardIcon from "./assets/award_icon.svg?react";
import BellIcon from "./assets/bell_icon.svg?react";
import CloseIcon from "./assets/close_icon.svg?react";
import Logo from "./assets/temp_logo.svg?react";
import { useEffect, useCallback, useState } from "react";

import AlarmModal from "./components/AlarmModal";
import axiosInstance from "./api/axiosInstance";
import useWebSocket2 from "./websocket/useWebSocket";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [alram_count, setAlramCount] = useState(0); // 알림 개수
  const [isModalOpen, setIsModalOpen] = useState(false); // 알림 모달 상태
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState("Home");

  const handleWebSocketMessage = useCallback((count) => {
    console.log("WebSocket message received:", count);
    // 알림 개수 업데이트
    setAlramCount(count);
  }, []);
  // 웹소켓 연결
  useWebSocket2("/topic/unread-count",handleWebSocketMessage);
  // 첫 렌더링 시 알람 개수 초기화
  useEffect(() => {
    axiosInstance.get("/api/abnormal/unread-count");
  }, []);


  useEffect(() => {
    if (location.pathname === "/") setCurrentPage("Home");
    else if (location.pathname.startsWith("/monitoring"))
      setCurrentPage("Monitor");
    else if (location.pathname.startsWith("/safety")) setCurrentPage("Safety");
    else if (location.pathname.startsWith("/facility"))
      setCurrentPage("Facility");
    else if (location.pathname.startsWith("/settings"))
      setCurrentPage("Sensor");
    else if (location.pathname.startsWith("/certification"))
      setCurrentPage("Certification");
  }, [location.pathname]);

  return (
    <aside className={isOpen ? "sidebar-open" : "sidebar-close"}>
      {!isOpen && (
        <div>
          <span className="icon side-opt">
            <Link
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
            <Link to="/">
              <Logo fill="#FFF" width="1.5rem" />
            </Link>
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
                  대시보드
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
                fill={
                  ["Monitor", "Facility", "Safety"].includes(currentPage)
                    ? "#608DFF"
                    : "#FFF"
                }
                width="1.5rem"
              />
              {isOpen && (
                <p
                  className={`${
                    ["Monitor", "Facility", "Safety"].includes(currentPage)
                      ? "current-page"
                      : ""
                  } sidebar-open`}
                >
                  모니터링
                </p>
              )}
            </Link>
          </span>
          {isOpen &&
            ["Monitor", "Facility", "Safety"].includes(currentPage) && (
              <>
                <div className="mini-menu">
                  <div className="side-opt">
                    <Link to="/monitoring">
                      <p
                        className={`${
                          currentPage === "Monitor" ? "current-page" : ""
                        }`}
                      >
                        실시간 모니터링
                      </p>
                    </Link>
                  </div>
                  <div className="side-opt">
                    <Link to="/safety">
                      <p
                        className={`${
                          currentPage === "Safety" ? "current-page" : ""
                        }`}
                      >
                        작업자 안전관리
                      </p>
                    </Link>
                  </div>
                  <div className="side-opt">
                    <Link to="/facility">
                      <p
                        className={`${
                          currentPage === "Facility" ? "current-page" : ""
                        }`}
                      >
                        설비 관리
                      </p>
                    </Link>
                  </div>
                </div>
              </>
            )}
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
                  센서 관리
                </p>
              )}
            </Link>
          </span>
        </div>
        <div>
          <span
            className="icon side-opt"
            onClick={() => setCurrentPage("Certification")}
          >
            <Link to="/certification">
              <AwardIcon
                stroke={currentPage === "Certification" ? "#608DFF" : "#FFF"}
                width="1.5rem"
              />
              {isOpen && (
                <p
                  className={`${
                    currentPage === "Certification" ? "current-page" : ""
                  } sidebar-open`}
                >
                  인증서 관리
                </p>
              )}
            </Link>
          </span>
        </div>
      </div>
      {
        <div className={isOpen ? "alram-box" : "alram-box sidebar-close"}>
          <span className="icon"onClick={() => {
              setIsModalOpen(true)
              console.log("알람 모달 열기");
              }}>
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
                {alram_count}건의 새로운 알림이 도착했습니다
              </p>
            )}
          </span>
        </div>
      }
      {/* 알람 모달 */}
      <AlarmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </aside>
  );
}
