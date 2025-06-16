import { useState } from "react";
import "../styles/additional.css";

export default function Help() {
  const [activeTab, setActiveTab] = useState("Factoreal");
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
          <p className="team-summary">ddd</p>
        </div>
      </div>
    </>
  );
}
