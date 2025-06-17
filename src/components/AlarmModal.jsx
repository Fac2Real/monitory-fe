import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/axiosInstance"; // Axios 인스턴스 가져오기
import XIcon from "../assets/x_icon.svg?react";
import { useNavigate } from "react-router-dom";
import "./modal/modal.css";

const AlarmModal = ({ isOpen, onClose }) => {
  const [alarms, setAlarms] = useState([]); // 알람 목록 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [page, setPage] = useState(0); // 현재 페이지
  const [size] = useState(5); // 페이지 크기
  const [hasMore, setHasMore] = useState(false); // 더 많은 데이터 여부
  const modalContentRef = useRef(null); // 스크롤 이벤트를 감지할 Ref
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 데이터 초기화 및 첫 페이지 로드
      setPage(0);
      setAlarms([]);
      setFilter("");
      setHasMore(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // 알람 목록 가져오기
      const fetchAlarms = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get("/api/abnormal/unread", {
            params: { page, size }, // 쿼리 파라미터로 페이지와 크기 전달
          });
          const newAlarms = response.data.data.content; // Page 객체의 content를 사용
          setAlarms((prev) => [...prev, ...newAlarms]); // 기존 알람에 새 알람 추가
          setHasMore(!response.data.data.last); // 마지막 페이지 여부 확인
        } catch (error) {
          console.error("Failed to fetch alarms:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAlarms();
    }
  }, [page, isOpen]);

  const handleScroll = () => {
    if (!modalContentRef.current || loading || (!hasMore && alarms.length > 0))
      return;

    const { scrollTop, scrollHeight, clientHeight } = modalContentRef.current;

    // 스크롤이 하단에 도달하거나 알림이 0개일 때 다음 페이지 로드
    if (scrollTop + clientHeight >= scrollHeight - 10 || alarms.length === 0) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const removeAlarm = (alarmId) => {
    setAlarms((prev) => prev?.filter((alarm) => alarm.id !== alarmId));
  };
  const handleAlarmClick = async (alarm) => {
    await axiosInstance(`/api/abnormal/${alarm.id}/read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // 알람 삭제
    removeAlarm(alarm.id);
    // 알람 상세 페이지로 이동
    navigate(`/zone/${alarm.zoneId}`, {
      state: {
        zoneName: alarm.zoneName,
      },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    onClose();
  };

  const handleCheckClick = async (alarm) => {
    await axiosInstance(`/api/abnormal/${alarm.id}/read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // 알람 삭제
    removeAlarm(alarm.id);
  };

  const [filter, setFilter] = useState("");

  const filteredAlarms = filter
    ? alarms?.filter((alarm) =>
        filter === "urgent"
          ? alarm.dangerLevel === 2
          : filter === "warning"
          ? alarm.dangerLevel === 1
          : filter === "normal"
          ? !alarm.dangerLevel === 2 &&
            !alarm.dangerLevel === 1
          : true
      )
    : alarms;

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="alarm-modal-box" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            borderBottom: "1px solid #ddd",
            backgroundColor: "#f6f6f6",
            borderRadius: "1rem 1rem 0 0",
          }}
        >
          <div className="modal-header">
            <h2>알림 목록</h2>
            <button className="modal-close" onClick={onClose}>
              <XIcon width="1.5rem" height="1.5rem" />
            </button>
          </div>
          <div className="button-container">
            <button
              className="no-flex-button"
              style={{
                backgroundColor: filter == "" ? "#608dff" : "gray",
              }}
              onClick={() => {
                setFilter("");
              }}
            >
              전체
            </button>
            <button
              className="no-flex-button"
              style={{
                backgroundColor: filter == "urgent" ? "#cb3701" : "gray",
              }}
              onClick={() => {
                setFilter("urgent");
              }}
            >
              위험
            </button>
            <button
              className="no-flex-button"
              style={{
                backgroundColor: filter == "warning" ? "#c58000" : "gray",
              }}
              onClick={() => {
                setFilter("warning");
              }}
            >
              주의
            </button>
          </div>
        </div>
        {/* 모달 내용 */}
        <div
          className="alarm-modal-contents"
          ref={modalContentRef}
          onScroll={handleScroll}
        >
          {filteredAlarms.length > 0 ? (
            <ul className="alarm-list">
              {filteredAlarms?.map((alarm) => (
                <li
                  key={alarm.id}
                  className="alarm-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAlarmClick(alarm);
                  }}
                >
                  <div>
                    <div>
                      <strong
                        className={
                          alarm.dangerLevel == 1
                            ? "warning"
                            : alarm.dangerLevel == 2
                            ? "urgent"
                            : "normal"
                        }
                      >
                        {alarm.abnormalType}
                      </strong>
                      <p style={{ margin: "0.25rem 0" }}>
                        위치: {alarm.zoneName}
                      </p>
                    </div>
                    <p className="alarm-timestamp">
                      감지 시간: {new Date(alarm.detectedAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckClick(alarm);
                    }}
                  >
                    ✔
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p className="no-alarms">
                {hasMore
                  ? `스크롤해서 새로운 알림을 더 확인하세요!`
                  : "새로운 알림이 없습니다."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlarmModal;
