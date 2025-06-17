import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const statusKor = (status) => {
  if (status == 0) {
    return "정상";
  } else if (status == 1) {
    return "위험";
  } else {
    return "오류";
  }
};

export default function WorkerTable({
  worker_list,
  isDetail = false,
  selectWorker,
  openModal,
  isManager = false,
  callbackModal = () => {},
}) {
  const [searchType, setSearchType] = useState("byName");
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("전체");

  const filteredWorkers = worker_list?.filter((worker) => {
    if (searchType === "byName") {
      return worker.name.includes(search.trim());
    } else if (searchType === "byStatus") {
      if (selectedStatus === "전체") {
        return true;
      }
      return worker.status == Number(selectedStatus);
    }
    return true;
  });

  const directCall = (worker) => {
    callbackModal(worker);
  };

  return (
    <>
      <div className="table-container">
        {!isManager && (
          <div className="table-search">
            <div colSpan={6}>
              <div className="search-container">
                {/* 이름검색 라디오버튼 */}
                <div>
                  <label>
                    <input
                      className="radio"
                      type="radio"
                      name="searchType"
                      value="byName"
                      checked={searchType == "byName"}
                      onChange={() => {
                        setSearchType("byName");
                        setSearch("");
                      }}
                    ></input>
                    이름으로 검색
                  </label>
                  <input
                    id="search"
                    name="search"
                    className="search-field"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    disabled={searchType !== "byName"}
                  />
                </div>
                {/* 상태별 분류 라디오버튼 */}
                <div>
                  <label>
                    <input
                      className="radio"
                      type="radio"
                      name="searchType"
                      value="byStatus"
                      checked={searchType == "byStatus"}
                      onChange={() => {
                        setSearchType("byStatus");
                        setSelectedStatus("전체");
                      }}
                    ></input>
                    상태별 분류
                  </label>
                  <select
                    id="status"
                    className="search-field"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    disabled={searchType !== "byStatus"}
                  >
                    <option value="전체">전체</option>
                    <option value={0}>정상</option>
                    <option value={2}>위험</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
        <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
          <table className="worker-table">
            <thead>
              <tr className="table-header">
                <th>상태</th>
                <th>사번</th>
                <th>이름</th>
                {!isDetail && <th>현재 위치</th>}
                <th className="contact-row">이메일</th>
                <th className="contact-row">전화번호</th>
                <th style={{ width: "5%" }}>호출</th>
                {!isDetail && !isManager && <th>정보 수정</th>}
              </tr>
            </thead>
            <tbody>
              {filteredWorkers?.length == 0 && (
                <tr>
                  <td colSpan={8}>조건에 맞는 직원 정보가 없습니다</td>
                </tr>
              )}
              {filteredWorkers &&
                filteredWorkers?.map((worker, i) => {
                  let tmp = "normal";
                  if (worker.status == "위험") {
                    tmp = "critical";
                  }
                  return (
                    <tr key={i} className={tmp}>
                      <td>{statusKor(worker.status)}</td>
                      <td>{worker.workerId}</td>
                      <td>{worker.name}</td>
                      {!isDetail && <td>{worker.currentZoneName}</td>}
                      <td className="contact-row">{worker.email}</td>
                      <td className="contact-row">{worker.phoneNumber}</td>
                      <td
                        style={{ fontSize: "1.2rem", cursor: "pointer" }}
                        onClick={() => directCall(worker)}
                      >
                        🚨
                      </td>
                      {!isDetail && !isManager && (
                        <td
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => {
                            selectWorker(worker);
                            openModal(true);
                          }}
                        >
                          수정
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
