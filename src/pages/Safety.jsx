import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import WorkerTable from "../components/WorkerTable";
import WorkerInfoModal from "../components/modal/WorkerInfoModal";
import RegisterWorker from "../components/RegisterWorker";
import SafetyCallModal from "../components/modal/SafetyCallModal";
import "../styles/table.css";

export default function Safety() {
  const [workerList, setWorkerList] = useState([]);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [selectedWorkerInfo, setSelectedWorker] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setSelectedWorker();
    setIsOpen(false);
  };

  const fetchWorkers = useCallback(() => {
    axiosInstance
      .get("/api/workers")
      .then((res) => {
        setWorkerList(res.data.data);
      })
      .catch((e) => {
        setWorkerList([]);
        console.error("작업자 정보를 불러오는 데 실패했습니다:", e);
      });
  });

  // 1분에 한 번씩 작업자 정보를 리프레시해준다.
  useEffect(() => {
    fetchWorkers();
    const interval = setInterval(() => {
      fetchWorkers();
    }, 60000); // 1분!
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <WorkerInfoModal
        isOpen={isOpen}
        onClose={onClose}
        workerInfo={selectedWorkerInfo}
        fetchWorkers={fetchWorkers}
      />
      <h1>작업자 관리</h1>
      <div className="safety-body">
        <WorkerTable
          worker_list={workerList}
          selectWorker={setSelectedWorker}
          openModal={setIsOpen}
          callbackModal={(worker) => {
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
      <div
        className="safety-body"
        style={{
          height: "auto",
          alignSelf: "center",
          flexDirection: "column",
        }}
      >
        <RegisterWorker fetchWorkers={fetchWorkers} />
      </div>
    </>
  );
}
