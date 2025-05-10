import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function ZoneDetail_2() {
  const { zoneId } = useParams();
  const [isLogOpen, setLogOpen] = useState(false);
  const bottomRef = useRef(null);

  // Kibana 대시보드 ID (미리 저장해둔 고정된 dashboard)
  const dashboardId = "469736c0-2c7b-11f0-b6d9-690198decade";

  const sensorTypes = ["temp", "humid"]; // 원하는 센서 타입들 추가

  /* mock data */
  /* zoneId로 detail 정보를 요청하면, 아래 정보를 줬으면 좋겠다...*/

  // 최종 프로젝트
  // 시뮬레이션 시각화 
  // 핸드폰 앱으로 만들어서 센서 데이터 전송가능하게끔.

  // 데이터 기반 의사 결정

  // 줌으로 면접 녹화해보기

  // cam이 아닌 클라우드 Am으로 말하기

  const mock_details_sensor = {
    zoneId: zoneId,
    zoneName: "생산 라인 A",
    sensors: [
      { type: "temp", id: "SID-XXX" },
      { type: "humid", id: "SID-YYY" },
      { type: "humid", id: "SID-ZZZ" },
    ],
  };
  console.log(mock_details_sensor.sensors);

  const mapSensorType = (sensorType) => {
    const sensorMap = { temp: "온도 센서", humid: "습도 센서" };
    return sensorMap[sensorType];
  };
  const buildKibanaUrl = (sensorType) =>
    `http://localhost:5601/app/dashboards#/view/${dashboardId}?embed=true&_g=(
      filters:!(
        (query:(match_phrase:(zoneId.keyword:${zoneId}))),
        (query:(match_phrase:(sensorType.keyword:${sensorType})))
      ),
      refreshInterval:(pause:!f,value:5000),
      time:(from:now-10m,to:now)
    )`.replace(/\s+/g, "");

  useEffect(() => {
    if (isLogOpen && bottomRef.current) {
      setTimeout(() => {
        bottomRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 200); // transition 후 약간의 시간 대기 (300ms)
    }
  }, [isLogOpen]);
  return (
    <>
      <h1>모니터링 현황</h1>
      {/* 환경 리포트 부분 :: ELK */}
      <div className="box-wrapper">
        <div className="top-box">환경 리포트</div>
        <div className="bottom-box">
          <div className="elk-wrapper">
            {mock_details_sensor.sensors?.map((sensor) => (
              <div key={sensor.id} className="elk-box">
                <p>
                  {mapSensorType(sensor.type)} ({sensor.id})
                </p>
                <div>
                  <iframe
                    src={buildKibanaUrl(sensor.type)}
                    title={`Dashboard for ${zoneId} - ${sensor.type}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 근무자 현황 :: 스프린트2 */}
      <div className="box-wrapper">
        <div className="top-box">근무자 현황</div>
        <div className="bottom-box">
          <p>스프린트2에서 진행 예정</p>
        </div>
      </div>
      {/* 설비 현황 :: 스프린트3 */}
      <div className="box-wrapper">
        <div className="top-box">설비 현황</div>
        <div className="bottom-box">
          <p>스프린트3에서 진행 예정</p>
        </div>
      </div>
      {/* 시스템 로그 조회 :: 토글해야 호출! */}
      <div className="box-wrapper">
        <div className="top-box">
          시스템 로그 조회
          <span className="arrow" onClick={() => setLogOpen((prev) => !prev)}>
            {isLogOpen ? "▲" : "▼"}
          </span>
        </div>
        <div className={`bottom-box last-box ${isLogOpen ? "open" : "closed"}`}>
          <p>logs</p>
          <p>logs</p>
          <p>logs</p>
          <p>logs</p>
          <p>logs</p>
        </div>
        {/* <div ref={bottomRef}>스크롤 위치 조정용</div> */}
      </div>
      <div ref={bottomRef} style={{ height: 0 }}></div>
    </>
  );
}
