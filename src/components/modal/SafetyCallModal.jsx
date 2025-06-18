import { useEffect, useState } from "react";
import BasicModal from "./BasicModal";
import axiosInstance from "../../api/axiosInstance";

function ModalContents({ worker, workerList, onClose }) {
  const [helpWorkerId, setHelpWorkerId] = useState("");
  const [mode, setMode] = useState("");
  const [message, setMessage] = useState("");
  const [equips, setEquips] = useState([]);
  const [equipId, setEquipId] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/api/equips")
      .then((res) => {
        setEquips(res.data.data);
      })
      .catch((e) => {
        console.error("설비 정보를 불러오는 데 실패했습니다:", e);
        setEquips([]);
      });
  }, []);

  const handleSafetySubmit = () => {
    if (!helpWorkerId) {
      alert("도움이 필요한 작업자를 선택하세요.");
      return;
    }
    axiosInstance
      .post("/api/fcm/safety", {
        workerId: worker.workerId,
        careNeedWorkerId: helpWorkerId,
        message: message,
      })
      .then((res) => {
        alert("작업자 도움 요청이 전송되었습니다.");
        onClose(true);
      })
      .catch((e) => {
        console.error("작업자 도움 요청에 실패했습니다:", e);
        alert("작업자 도움 요청에 실패했습니다. 다시 시도해주세요.");
        onClose(true);
      });
  };

  const handleEquipSubmit = () => {
    if (!equipId) {
      alert("점검이 필요한 설비를 선택하세요.");
      return;
    }
    axiosInstance
      .post("/api/fcm/equip", {
        workerId: worker.workerId,
        equipId: equipId,
        message: message,
      })
      .then((res) => {
        alert("설비 점검 요청이 전송되었습니다.");
        onClose(true);
      })
      .catch((e) => {
        console.error("설비 점검 요청에 실패했습니다:", e);
        alert("설비 점검 요청에 실패했습니다. 다시 시도해주세요.");
        onClose(true);
      });
  };
  const handleCustomSubmit = () => {
    if (!message) {
      alert("전송할 메시지를 입력하세요.");
      return;
    }
    axiosInstance
      .post("/api/fcm/custom", {
        workerId: worker.workerId,
        message: message,
      })
      .then((res) => {
        alert("기타 요청이 전송되었습니다.");
        onClose(true);
      })
      .catch((e) => {
        console.error("기타 요청에 실패했습니다:", e);
        alert("기타 요청에 실패했습니다. 다시 시도해주세요.");
        onClose(true);
      });
  };
  return (
    <>
      <p style={{ marginTop: 0, color: "gray" }}>
        호출할 작업자: {worker.name}
      </p>
      <div className="modal-flex">
        <div className="select-flex">
          <select
            style={{ height: "1.75rem", fontSize: "1rem", width: "20rem" }}
            onChange={(e) => setMode(e.target.value)}
            value={mode}
          >
            <option value="" disabled>
              호출 목적을 선택하세요
            </option>
            <option value="mode_safety">[호출 목적] 작업자 도움 요청</option>
            <option value="mode_equip">[호출 목적] 설비 점검 요청</option>
            <option value="mode_etc">[호출 목적] 기타 목적</option>
          </select>
        </div>
        {mode == "mode_safety" && (
          <div className="select-flex">
            <select
              style={{ height: "1.75rem", fontSize: "1rem", width: "20rem" }}
              onChange={(e) => setHelpWorkerId(e.target.value)}
              value={helpWorkerId}
            >
              <option value="" disabled>
                도움이 필요한 작업자를 선택하세요
              </option>
              {workerList?.map((w) => (
                <option
                  key={w.workerId}
                  value={w.workerId}
                  disabled={w.workerId == worker.workerId}
                >
                  {w.name} ({w.workerId})
                </option>
              ))}
            </select>
          </div>
        )}
        {mode == "mode_equip" && (
          <div className="select-flex">
            <select
              style={{ height: "1.75rem", fontSize: "1rem", width: "20rem" }}
              onChange={(e) => setEquipId(e.target.value)}
              value={equipId}
            >
              <option value="" disabled>
                점검이 필요한 설비를 선택하세요
              </option>
              {equips?.map((equip) => {
                if (equip.equipName == "empty") {
                  return;
                }
                return (
                  <option key={equip.equipId} value={equip.equipId}>
                    {equip.zoneName} - {equip.equipName}
                  </option>
                );
              })}
            </select>
          </div>
        )}
        <div className="input-flex">
          <input
            style={{
              flex: "auto",
              width: "20rem",
              height: "1.75rem",
              textAlign: "center",
              margin: "0.5rem",
            }}
            placeholder={`${worker.name} 님에게 남길 추가 메시지를 입력하세요`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></input>
        </div>
      </div>
      <div className="button-flex">
        <button
          onClick={
            mode == "mode_equip"
              ? handleEquipSubmit
              : mode == "mode_safety"
              ? handleSafetySubmit
              : handleCustomSubmit
          }
        >
          전송
        </button>
      </div>
    </>
  );
}

export default function SafetyCallModal({
  isOpen,
  onClose,
  selectWorker,
  workerList,
}) {
  if (isOpen) {
    return (
      <BasicModal
        onClose={onClose}
        modal_contents={{
          title: "작업자 호출",
          contents: (
            <ModalContents
              worker={selectWorker}
              workerList={workerList}
              // onSubmit={handleSubmit}
              onClose={onClose}
            />
          ),
        }}
      />
    );
  } else {
    return null;
  }
}
