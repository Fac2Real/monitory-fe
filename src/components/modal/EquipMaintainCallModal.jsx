import { useState } from "react";
import BasicModal from "./BasicModal";
import axiosInstance from "../../api/axiosInstance";

function ModalContents({ equip, workerList, onClose }) {
  const [message, setMessage] = useState("");
  const [worker, setWorker] = useState("");
  const handleSubmit = () => {
    if (worker == "") {
      alert("호출할 직원을 선택하세요");
      return;
    }
    axiosInstance
      .post(`/api/fcm/equip`, {
        workerId: worker?.workerId ?? "",
        equipId: equip?.equipId ?? "",
      })
      .then((res) => {
        onClose(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      {workerList?.length == 0 && (
        <>
          <p>현재 요청 가능한 직원이 없습니다</p>
          <br></br>
          <div className="button-flex">
            <button
              onClick={() => {
                onClose(true);
              }}
            >
              닫기
            </button>
          </div>
        </>
      )}
      {workerList?.length != 0 && (
        <>
          <p style={{ marginTop: 0, color: "gray" }}>
            선택한 설비: {equip.equipName}
          </p>
          <div className="modal-flex">
            <div className="select-flex">
              <select
                style={{ height: "1.75rem", fontSize: "1rem", width: "20rem" }}
                onChange={(e) => setWorker(e.target.value)}
                value={worker}
              >
                <option value="" disabled>
                  점검을 요청할 직원을 선택하세요
                </option>
                {workerList?.map((w) => (
                  <option key={w.workerId} value={w}>
                    {w.name} ({w.workerId})
                  </option>
                ))}
              </select>
            </div>
            {worker && (
              <>
                <div className="input-flex">
                  <input
                    style={{
                      flex: "auto",
                      width: "20rem",
                      height: "1.75rem",
                      textAlign: "center",
                      margin: "0.5rem",
                    }}
                    placeholder={`${worker?.name} 님에게 남길 추가 메시지를 입력하세요`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></input>
                </div>
              </>
            )}
          </div>
          <br></br>
          <div className="button-flex">
            <button onClick={handleSubmit}>전송</button>
          </div>
        </>
      )}
    </>
  );
}

export default function EquipMaintainCallModal({
  isOpen,
  onClose,
  selectedEquip,
  workerList,
}) {
  if (isOpen) {
    return (
      <BasicModal
        onClose={onClose}
        modal_contents={{
          title: "설비 점검 요청",
          contents: (
            <ModalContents
              equip={selectedEquip}
              workerList={workerList}
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
