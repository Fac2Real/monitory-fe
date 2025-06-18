import BasicModal from "./BasicModal";
import ModalPortal from "../ModalPortal";
import axiosInstance from "../../api/axiosInstance";
import { useEffect, useState } from "react";
import "../../styles/table.css";

export default function ZoneCallModal({ isOpen, onClose, zone }) {
  if (isOpen) {
    return (
      <ModalPortal>
        <BasicModal
          onClose={onClose}
          type="alert"
          modal_contents={{
            title: `[${zone.zoneName}] 위험 알림`,
            contents: (
              <ModalContents
                onClose={onClose}
                zoneId={zone.zoneId}
                level={zone.level}
              />
            ),
          }}
        />
      </ModalPortal>
    );
  } else {
    return null;
  }
}

function ModalContents({ onClose, zoneId, level }) {
  const [workerList, setWorkerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .post(`/api/fcm/zone`, { zoneId: zoneId, dangerLevel: level })
      .then((res) => {
        setWorkerList(res.data.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("알림 전송 중 오류 발생:", e);
        setWorkerList([]);
        if (e.status == 404) {
          setError("잘못된 접근입니다");
        } else {
          setError("알 수 없는 오류");
        }
        setLoading(false);
      });
  }, []);
  return (
    <>
      {!!error && <p>{error}</p>}
      {loading && (
        <>
          <p>알림 전송 중</p>
          <span>잠시만 기다려주세요.</span>
          <br></br>
          <br></br>
        </>
      )}
      {!error && !loading && (
        <>
          <p>
            <strong>전송 완료</strong> ({workerList.length}건 중{" "}
            {
              workerList?.filter((worker) => {
                if (worker.success) {
                  return worker;
                }
              }).length
            }
            건 성공)
          </p>
          <div style={{ margin: "1.5rem" }}>
            <WorkerTable workerList={workerList} />
          </div>
          <div className="button-flex">
            <button onClick={onClose}>닫기</button>
          </div>
        </>
      )}
    </>
  );
}

function WorkerTable({ workerList }) {
  return (
    <>
      <table className="worker-table">
        <thead>
          <tr className="table-header">
            <th>이름</th>
            <th>전송 상태</th>
          </tr>
        </thead>
        <tbody>
          {workerList?.length != 0 &&
            workerList?.map((worker, i) => {
              return (
                <tr key={i}>
                  <td>{worker.workerName}</td>
                  <td>
                    {worker.success ? (
                      <span style={{ fontWeight: "bold", color: "green" }}>
                        전송 성공
                      </span>
                    ) : (
                      <span style={{ fontWeight: "bold", color: "red" }}>
                        전송 실패
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          {workerList?.length == 0 && (
            <tr>
              <td colSpan={2} style={{ color: "gray" }}>
                해당 공간에 직원이 존재하지 않습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
