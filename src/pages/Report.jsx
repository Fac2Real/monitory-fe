import { useEffect, useState } from "react";
import BasicModal from "../components/modal/BasicModal";
import GeneralReport from "../components/report/GeneralReport";
import ZonewiseReport from "../components/report/ZonewiseReport";
import axiosInstance from "../api/axiosInstance";
import "../styles/report.css";

export default function Report() {
  const [report, setReport] = useState(null);
  const [reportMode, setReportMode] = useState("general");
  useEffect(() => {
    if (reportMode == "zonewise") {
      axiosInstance
        .get(`/api/abnormal/detail-report`)
        .then((res) => {
          setReport(res.data.data);
        })
        .catch((e) => {
          console.error("리포트 패치 실패:", e);
          setReport(null);
        });
    } else if (reportMode == "general") {
      axiosInstance
        .get(`/api/abnormal/graph-report`)
        .then((res) => {
          setReport(res.data.data);
        })
        .catch((e) => {
          console.error("리포트 패치 실패:", e);
          setReport(null);
        });
    }
  }, [reportMode]);

  return (
    <>
      <h1>모니토리 월간 리포트</h1>
      <p className="period">집계 기간: {report?.period}</p>
      {reportMode == "general" && (
        <>
          <GeneralReport report={report} />
          <div
            className="report-button-flex"
            style={{ justifyContent: "flex-end" }}
          >
            <button
              className="report-button"
              onClick={() => {
                setReportMode("zonewise");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              공간별 상세 리포트 ⇀
            </button>
          </div>
        </>
      )}
      {reportMode == "zonewise" && (
        <>
          {report?.zones?.map((r, i) => {
            return <ZonewiseReport report={r} key={i} />;
          })}
          <div
            className="report-button-flex"
            style={{ justifyContent: "flex-start" }}
          >
            <button
              onClick={() => {
                setReportMode("general");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              ↼ 월간 종합 리포트
            </button>
          </div>
        </>
      )}
    </>
  );
}
