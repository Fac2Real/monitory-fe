import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import WorkerTable from "./WorkerTable";
import SafetyCallModal from "./modal/SafetyCallModal";
export default function ManagerSetting({ workerList, modalParam, zoneId }) {
  const [mode, setMode] = useState("");
  const [cand, setCand] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [manager, setManager] = useState();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  // 매니저 정보 받아오기
  useEffect(() => {
    axiosInstance
      .get(`/api/workers/zone/${zoneId}/manager`)
      .then((res) => {
        setManager(res.data.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setManager(null); // 혹은 빈 상태 처리
        } else {
          setManager(null);
        }
      });
  }, [refreshTrigger]);

  // 매니저 후보자 목록을 불러오고, 첫 번째 후보자를 선택
  useEffect(() => {
    if (cand.length > 0) {
      setSelectedWorkerId(cand[0].workerId); // cand 배열의 첫 번째 workerId를 초기값으로 설정
    }
  }, [cand]);

  const fetchCand = () => {
    axiosInstance
      .get(`/api/zone-managers/candidates/${zoneId}`)
      .then((res) => {
        setCand(res.data.data);
      })
      .catch((e) => {
        setCand([]);
      });
  };

  const handleSubmit = () => {
    if (selectedWorkerId) {
      axiosInstance
        .post(`/api/zone-managers/${zoneId}/assign/${selectedWorkerId}`)
        .then((res) => {
          setMode("");
          setRefreshTrigger((prev) => prev + 1);
        })
        .catch((e) => setMode(""));
    } else {
      return;
    }
  };

  return (
    <>
      {/* 매니저 존재 여부에 따라 매니저 정보 표 보여줌 */}
      {manager && (
        <>
          <div className="button-flex manager-button">
            <button
              onClick={() => {
                setMode("edit");
                fetchCand();
              }}
            >
              수정
            </button>
          </div>
          <WorkerTable
            worker_list={[manager]}
            selectWorker={modalParam.selectedWorker}
            openModal={modalParam.openModal}
            isManager={true}
            callbackModal={(worker) => {
              // setSelectedWorker(worker);
              setIsCallModalOpen(true);
            }}
          />
          <SafetyCallModal
            isOpen={isCallModalOpen}
            onClose={() => setIsCallModalOpen(false)}
            selectWorker={manager}
            workerList={workerList}
          />
        </>
      )}
      {!manager && (
        <>
          <div
            className="button-flex manager-button"
            style={{ justifyContent: "space-between" }}
          >
            <p style={{ marginLeft: "1.5rem" }}>매니저가 할당되지 않았습니다</p>
            <button
              style={{ marginRight: 0 }}
              onClick={() => {
                setMode("add");
                fetchCand();
              }}
            >
              등록
            </button>
          </div>
        </>
      )}
      {/* 모드에 따라 추가하는 부분 보여주기 */}
      {mode && (
        <>
          <div className="edit-manager">
            <div className="select-flex">
              <p>담당자 선택</p>
              <select
                onChange={(e) => setSelectedWorkerId(e.target.value)}
                value={selectedWorkerId ?? ""}
                disabled={cand?.length === 0}
              >
                {cand?.map((c, i) => {
                  return (
                    <option key={i} value={c.workerId}>
                      {c.name} ({c.workerId})
                    </option>
                  );
                })}
                {!cand?.length && (
                  <option disabled value="">
                    선택 가능한 직원이 없습니다
                  </option>
                )}
              </select>
              {(mode == "edit" || mode == "add") && (
                <button className="no-flex-button" onClick={handleSubmit}>
                  {mode == "edit" ? "변경" : "등록"}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
