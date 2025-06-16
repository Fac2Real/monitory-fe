import { useEffect, useState } from "react";
import ToolIcon from "../assets/tool_icon.svg?react";
import AlarmIcon from "../assets/alarm_icon.svg?react";
import axiosInstance from "../api/axiosInstance";
import EquipMaintainCallModal from "./modal/EquipMaintainCallModal";
import EquipDateModal from "./modal/EquipDateModal";

function GaugeBar({ percent }) {
  const bgColor =
    percent >= 70 ? "#FF4D4F" : percent >= 40 ? "#FAAD14" : "#52C41A";
  return (
    <div className="gauge-bar">
      <div
        className="gauge-fill"
        style={{
          width: `${percent == 0 ? 0 : Math.max(5, percent)}%`,
          backgroundColor: bgColor,
          borderRadius: percent >= 80 ? "999px" : "999px 0 0 999px",
          position: "relative",
        }}
      ></div>
    </div>
  );
}

function EquipItem({ equip, workerList, fetchEquips }) {
  const [info, setInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const test_date = "2025-06-30"; // 예상교체일자 (하드코딩!!!!)

  /* --------- 최신 정보 가져오기 --------- */
  useEffect(() => {
    if (!equip?.equipId) return;

    const controller = new AbortController();

    (async () => {
      try {
        const res = await axiosInstance.get(
          `/api/equip-maintenance/latest/${equip.equipId}`,
          {
            params: { zoneId: equip.zoneId },
            signal: controller.signal,
          }
        );
        setInfo(res.data.data);
      } catch (err) {
        setInfo({});
      }
    })();

    return () => controller.abort();
  }, [equip.equipId, equip.zoneId, equip.lastCheckDate]);

  // 날짜 계산 상수
  const tmp = 1000 * 60 * 60 * 24;
  const today = new Date();

  // 최근 점검 일자 (서버 → equip → 에러 메시지)
  const lastCheckDate =
    info?.lastCheckDate ||
    equip.lastCheckDate ||
    "최근 점검한 일자를 입력해주세요"; // "입력 오류" 대신 수정했습니다.

  // 예상 점검 일자 (서버 → equip.pred → 하드코딩)
  const predictedDateStr = info?.maintenanceStatus
    ? "최근 점검 완료✅"
    : info?.expectedMaintenanceDate || equip.pred || "9999-12-31";
  const predictedDate = new Date(predictedDateStr);

  // D-Day (서버 → 계산)
  let dDay =
    info?.daysUntilMaintenance ?? Math.ceil((predictedDate - today) / tmp);
  if (dDay == 0) {
    dDay = "-DAY";
  } else if (dDay > 0) {
    dDay = `-${dDay}`;
  } else {
    dDay = `+${Math.abs(dDay)}`;
  }

  // 퍼센트 계산
  const lastDateObj = new Date(lastCheckDate);
  let percent = 0;
  if (lastDateObj < predictedDate && lastDateObj <= today) {
    percent = Math.ceil(
      ((today - lastDateObj) / (predictedDate - lastDateObj)) * 100
    );
    percent = Math.max(0, Math.min(100, percent));
  }

  const onClose = () => {
    setIsOpen(false);
  };

  const [isEquipOpen, setIsEquipOpen] = useState(false);
  const handleEquipModalOpen = () => {
    if (
      predictedDateStr == "9999-12-31" ||
      predictedDateStr == "최근 점검 완료✅"
    ) {
      alert(
        "최근 점검일은 예상 점검일을 기준으로 업데이트됩니다.\n예상 점검일이 없으면 수정할 수 없습니다."
      );
      return;
    }
    setIsEquipOpen(true);
  };
  const onCloseEquip = () => {
    setIsEquipOpen(false);
  };
  const handleUpdateDate = (newDate, equip) => {
    axiosInstance
      .post(`/api/equips/${equip.equipId}/check-date`, {
        checkDate: newDate,
      })
      .then(() => {
        fetchEquips();
      });
  };
  return (
    <>
      <EquipDateModal
        isOpen={isEquipOpen}
        onClose={onCloseEquip}
        equipInfo={equip}
        onUpdate={handleUpdateDate}
      />
      <div className="sensorlist">
        <div className="sensorlist-underbar">
          <strong>{equip.equipName}</strong>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <AlarmIcon width="1.5rem" color="#000" />
          </span>
        </div>
        <div className="list-text">
          <div>예상 점검 일자</div>
          <span className="dash-line"></span>
          <span>
            (
            {predictedDateStr == "9999-12-31"
              ? "예상 점검일자 정보가 없습니다"
              : predictedDateStr}
            )
          </span>
        </div>
        <div className="list-text">
          {predictedDateStr !== "9999-12-31" && (
            <>
              <div>
                {info?.maintenanceStatus
                  ? "예상 점검일까지 D-0"
                  : `예상 점검일까지 D${dDay}`}
              </div>
              <GaugeBar percent={percent} />
            </>
          )}{" "}
        </div>
        <div className="list-text">
          <div>최근 점검 일자</div>
          <span className="dash-line"></span>
          <span>
            ({lastCheckDate})
            <ToolIcon
              className="thres-setting"
              width="1.3rem"
              fill="gray"
              stroke="gray"
              style={{ transform: "translateY(4px)" }}
              onClick={() => {
                handleEquipModalOpen();
              }}
            />
          </span>
        </div>
      </div>
      <EquipMaintainCallModal
        isOpen={isOpen}
        onClose={onClose}
        selectedEquip={equip}
        workerList={workerList}
      />
    </>
  );
}

export default function Equip({ equips, modalParam, workerList }) {
  return (
    <>
      {/* length가 1인 이유 : empty 설비 때문에... */}
      {equips?.length <= 1 && <p>등록된 설비가 없습니다</p>}
      {!(equips?.length === 0) &&
        equips?.map((e, i) => {
          if (e.equipName == "empty") {
            return;
          }
          return (
            <EquipItem
              key={i}
              equip={e}
              fetchEquips={modalParam.fetchEquips}
              workerList={workerList}
            />
          );
        })}
    </>
  );
}
