import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import RefreshIcon from "../assets/refresh_icon.svg?react";
import LogTable from "../components/LogTable";
import WorkerInfoModal from "../components/modal/WorkerInfoModal";
import WorkerTable from "../components/WorkerTable";
import ManagerSetting from "../components/ManagerSetting";
import Equip from "../components/Equip";
import SafetyCallModal from "../components/modal/SafetyCallModal";

export default function ZoneDetail() {
  const { zoneId } = useParams();
  const { state } = useLocation();
  const zoneName = state?.zoneName;

  // 1) 모든 useState/useRef
  const [dashboards, setDashboards] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  const [refreshLog, setRefreshLog] = useState(0);
  const [refreshEquip, setRefreshEquip] = useState(0);
  const [logs, setLogs] = useState([]);
  const [refreshWorkers, setRefreshWorkers] = useState(0);
  const [workerList, setWorkerList] = useState([]);
  const [selectedWorkerInfo, setSelectedWorker] = useState(null);
  const [selectedEquipInfo, setSelectedEquip] = useState();
  const [isWorkerOpen, setIsWorkerOpen] = useState(false);
  // const [isEquipOpen, setIsEquipOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const onCloseWorker = () => {
    setSelectedWorker();
    setIsWorkerOpen(false);
  };

  // 2) 모든 useEffect (조건 없이 항상 선언)
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/api/grafana-zone/${zoneId}/dashboards`)
      .then((res) => {
        if (!res.status) throw new Error(`Status ${res.status}`);
        return res.data;
      })
      .then((res) => {
        setDashboards(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [zoneId]);

  // 로그 펴질 때 화면 부드럽게 펼쳐지기
  useEffect(() => {
    if (refreshLog !== 0 && bottomRef.current) {
      setTimeout(() => {
        bottomRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 200);
    }
  }, [logs?.length, refreshLog]);

  // 공간의 작업자 정보 받아오기
  const fetchWorkers = () => {
    axiosInstance
      .get(`/api/workers/zone/${zoneId}`)
      .then((res) => {
        setWorkerList(res.data.data);
      })
      .catch((e) => {
        setWorkerList([]);
      });
  };

  useEffect(() => {
    fetchWorkers();
    const interval = setInterval(() => {
      fetchWorkers();
    }, 60000); // 1분!
    return () => clearInterval(interval);
  }, [refreshWorkers]);

  // 로그 정보 받아오기
  const currentPage = useRef(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchLogs = () => {
    if (!hasMore) {
      return;
    }
    currentPage.current += 1;
    axiosInstance
      .get(`/api/zones/${zoneId}/logs`, {
        params: {
          page: currentPage.current,
          size: 10,
        },
      })
      .then((res) => {
        const nextLogs = res.data.data.content;
        if (nextLogs.length === 0) {
          setHasMore(false);
        } else {
          setLogs((prev) => [...prev, ...nextLogs]);
        }
      })
      .catch((e) => {
        setHasMore(false);
      });
  };
  const scrollBoxRef = useRef(null);
  useEffect(() => {
    if (refreshLog) {
      currentPage.current = 0;
      setLogs([]);
      if (scrollBoxRef.current) {
        scrollBoxRef.current.scrollTop = 0;
      }
      setHasMore(true);
      axiosInstance
        .get(`/api/zones/${zoneId}/logs`, {
          params: {
            page: 0,
            size: 10,
          },
        })
        .then((res) => {
          setLogs(res.data.data.content);
        })
        .catch((e) => {
          setLogs([]);
        });
    }
  }, [refreshLog]);

  const [equips, setEquips] = useState([]);

  const fetchEquips = () => {
    axiosInstance
      .get(`/api/equips/zone/${zoneId}`)
      .then((res) => {
        setEquips(res.data.data);
      })
      .catch((e) => {
        setEquips([]);
      });
  };
  useEffect(() => {
    fetchEquips();
  }, [refreshEquip]);

  return (
    <>
      <WorkerInfoModal
        isOpen={isWorkerOpen}
        onClose={onCloseWorker}
        workerInfo={selectedWorkerInfo}
      />
      <h1>{zoneName}</h1>
      <div className="box-wrapper">
        <div className="top-box">환경 리포트</div>
        <div className="bottom-box">
          {loading && <div>로딩 중…</div>}
          {error && (
            <>
              {/* 에러 발생: {error} */}
              {error.status == 404 && <div>등록된 센서가 없습니다</div>}
              {error.status == 500 && <div>{error.message}</div>}
            </>
          )}
          {!loading && !error && (
            <div className="grafana-wrapper">
              {dashboards &&
                dashboards?.map(({ sensorId, sensorType, iframeUrl }) => (
                  <div key={sensorId} className="grafana-box">
                    <div>
                      {sensorType} 센서
                      <p
                        style={{
                          margin: "0.25rem 0",
                          fontSize: "1rem",
                          color: "gray",
                        }}
                      >
                        ID: {sensorId}
                      </p>
                    </div>
                    <div>
                      <iframe
                        src={iframeUrl}
                        title={`grafana-${sensorId}`}
                        style={{ width: "100%", height: "100%", border: 0 }}
                        loading="lazy"
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      {/* 근무자 현황 :: 스프린트2 */}
      <div className="box-wrapper">
        <div className="top-box">
          근무자 현황
          <span
            className="refresh"
            onClick={() => setRefreshWorkers((prev) => prev + 1)}
          >
            <RefreshIcon width="1.2rem" fill="#000" />
          </span>
        </div>
        <div className="bottom-box">
          <WorkerTable
            worker_list={workerList}
            isDetail={true}
            selectWorker={setSelectedWorker}
            openModal={setIsWorkerOpen}
            callbackModal={(worker) => {
              // 호출 버튼 클릭시 모달 열기
              setSelectedWorker(worker);
              setIsCallModalOpen(true);
            }}
          />
        </div>
        <SafetyCallModal
          isOpen={isCallModalOpen}
          onClose={() => setIsCallModalOpen(false)}
          selectWorker={selectedWorkerInfo}
          workerList={workerList}
        />
      </div>

      {/* 담당자 :: 스프린트2 */}
      <div className="box-wrapper">
        <div className="top-box">담당자 정보</div>
        <div className="bottom-box">
          <ManagerSetting
            workerList={workerList}
            zoneId={zoneId}
            modalParam={{
              selectedWorker: setSelectedWorker,
              openModal: setIsWorkerOpen,
            }}
          />
        </div>
      </div>
      {/* 설비 현황 :: 스프린트3 */}
      <div className="box-wrapper">
        <div className="top-box">
          설비 현황
          {/* <span
            className="refresh"
            onClick={() => setRefreshEquip((prev) => prev + 1)}
          >
            <RefreshIcon width="1.2rem" fill="#FFF" />
          </span> */}
        </div>
        <div className="bottom-box">
          <Equip
            workerList={workerList}
            equips={equips}
            modalParam={{
              fetchEquips: fetchEquips,
            }}
          />
        </div>
      </div>
      {/* 시스템 로그 조회 :: 토글해야 호출! */}
      <div className="box-wrapper">
        <div className="top-box">
          시스템 로그 조회
          <span
            className="refresh"
            onClick={() => setRefreshLog((prev) => prev + 1)}
          >
            <RefreshIcon width="1.2rem" fill="#FFF" />
          </span>
        </div>
        <div
          className={`bottom-box last-box ${
            refreshLog == 0 ? "closed" : "open"
          }`}
        >
          <LogTable
            logs={logs}
            onScrollEnd={fetchLogs}
            scrollBoxRef={scrollBoxRef}
          />
        </div>
      </div>
      <div ref={bottomRef} style={{ height: 0 }}></div>
    </>
  );
}
