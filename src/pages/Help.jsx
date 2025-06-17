import { useState } from "react";
import "../styles/additional.css";
import { manualData } from "../assets/data/manualData";
import ManualItem from "../components/ManualItem";

export default function Help() {
  const [activeTab, setActiveTab] = useState("시작 · Home");
  const handlePdf = () => {
    const confirmed = window.confirm(
      "다른 창에서 PDF가 열립니다. 계속하시겠습니까?"
    );
    if (confirmed) {
      window.open("/manual.pdf", "_blank");
    }
  };
  return (
    <>
      <h1>모니토리 사용법</h1>
      <div className="box-wrapper">
        <div className="top-box team-tab-box">
          {[
            "시작 · Home",
            "모니터링",
            "작업자 관리",
            "설비/센서 관리",
            "월간 리포트",
          ].map((tab) => (
            <button
              key={tab}
              className={`team-tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="bottom-box team-info-box">
          <p className="team-summary">{manualData[activeTab]?.content}</p>
          {manualData[activeTab]?.features.map((feature, index) => (
            <ManualItem key={index} feature={feature} />
          ))}
        </div>
        <div
          className="button-flex"
          style={{
            marginTop: "1rem",
            justifyContent: "flex-end",
          }}
        >
          <button onClick={handlePdf}>PDF 열기</button>
        </div>
      </div>
    </>
  );
}
