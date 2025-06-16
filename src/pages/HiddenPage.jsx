import { useState } from "react";
import { teamData } from "../assets/data/teamData";
import LogoImg from "../assets/img/monitory_logo.png";
import "../styles/additional.css";

export default function HiddenPage() {
  const [activeTab, setActiveTab] = useState("Factoreal");

  return (
    <>
      <h1>MEET THE TEAM</h1>
      <div className="box-wrapper">
        <div className="top-box team-tab-box">
          {["Factoreal", "Infra", "IoT", "Service", "ML"].map((tab) => (
            <button
              key={tab}
              className={`team-tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab !== "Factoreal" ? " Team" : ""}
            </button>
          ))}
        </div>

        <div className="bottom-box team-info-box">
          <p className="team-summary">{teamData[activeTab].content}</p>

          {activeTab !== "Factoreal" && (
            <div className="members-wrapper">
              {teamData[activeTab].members.map((m, i) => (
                <div className="member-card" key={i}>
                  <img
                    src={`https://github.com/${m.github}.png`}
                    className="member-img"
                    alt={m.name}
                  />
                  <h2 className="member-name">{m.name}</h2>
                  <div className="member-info-1">{m.role}</div>
                  <div className="member-info-2">
                    <strong>EMAIL:</strong> <span>{m.email}</span>
                  </div>
                  <div className="member-info-2">
                    <strong>Github:</strong>{" "}
                    <a href={`https://github.com/${m.github}`}>{m.github}</a>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab == "Factoreal" && (
            <div className="factoreal-wrapper">
              {/* 내용1 */}
              <br></br>
              <div className="sensorlist-underbar">
                <span style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
                  Monitory 서비스 개요
                </span>
              </div>
              <br></br>
              <div className="info-contents">
                <span>
                  <img src={LogoImg} alt="Monitory Logo" width={"300px"} />
                </span>
                <p>
                  Monitory는 석유 화학 공장의 환경 모니터링부터 작업자 안전,
                  설비 예지까지 통합 관리하는 스마트 팩토리 플랫폼입니다
                </p>
              </div>
              <br></br>
              {/* 내용2 */}
              <div className="sensorlist-underbar">
                <span style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
                  Factoreal 팀의 목표
                </span>
              </div>
              <div className="info-contents">
                <p>
                  <strong style={{ fontSize: "1.5rem", color: "#608dff" }}>
                    첫째,
                  </strong>{" "}
                  제조업이라는 도메인에 대한 이해를 바탕으로, 기술 개발을 넘어
                  도메인 중심의 문제 해결 역량을 강화
                </p>
                <p>
                  <strong style={{ fontSize: "1.5rem", color: "#608dff" }}>
                    둘째,
                  </strong>{" "}
                  실제 공정을 기반으로, 공정 내에서 발생하는 현실적인 문제를
                  도출하고, 이를 해결할 수 있는 시스템의 개발
                </p>
                <p>
                  <strong style={{ fontSize: "1.5rem", color: "#608dff" }}>
                    셋째,
                  </strong>{" "}
                  산업 현장에서 발생하는 데이터를 수집, 가공, 분석한 후 실제
                  활용까지 클라우드 상에서 구축
                </p>
              </div>
              {/* 내용3 */}
              {/* <div className="sensorlist-underbar">
                <span style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
                  Factoreal 팀의 목표
                </span>
              </div>
              <div className="info-contents"> </div> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
