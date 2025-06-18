export function EnvLogs({ log }) {
  return (
    <div className="sensorlist">
      <div
        className="sensorlist-underbar"
        style={{ marginBottom: "0.5rem", lineHeight: "2.25rem" }}
      >
        <span>전체 환경 이상치 개수</span>
        <span>{log?.length ?? 0}건</span>
      </div>
      <div style={{ overflow: "auto", maxHeight: "40vh" }}>
        <EnvTable log={log} />
      </div>
    </div>
  );
}

function EnvTable({ log }) {
  if (!log) {
    return;
  }
  return (
    <table className="worker-table">
      <thead>
        <tr className="table-header">
          <th style={{ width: "2%" }}>위험도</th>
          <th style={{ width: "2%" }}>No.</th>
          {/* <th>유형</th> */}
          <th style={{ width: "2%" }}>값</th>
          <th>발생 시각</th>
        </tr>
      </thead>
      <tbody>
        {log?.map((l, i) => {
          return (
            <tr key={i}>
              <td>{l.dangerLevel}</td>
              <td>{l.abnormalId}</td>
              {/* <td>{l.targetDetail}</td> */}
              <td>{l.abnormalType}</td>
              <td>{new Date(l.detectedAt).toLocaleString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function WokrerLogs({ worker }) {
  return (
    <>
      <div className="sensorlist">
        <div
          className="sensorlist-underbar"
          style={{ marginBottom: "0.5rem", lineHeight: "2.25rem" }}
        >
          <span>
            {worker.name ?? "로딩실패"} ({worker.workerId})
          </span>
          <span>{worker.workerCnt} 건</span>
        </div>
        <div style={{ overflow: "auto", maxHeight: "40vh" }}>
          <WorkerTable log={worker.workerAbnormals} />
        </div>
      </div>
    </>
  );
}

function WorkerTable({ log }) {
  if (!log) {
    return;
  }
  return (
    <table className="worker-table">
      <thead>
        <tr className="table-header">
          <th style={{ width: "2%" }}>위험도</th>
          <th style={{ width: "2%" }}>No.</th>
          <th>유형</th>
          {/* <th style={{ width: "2%" }}>값</th> */}
          <th>발생 시각</th>
        </tr>
      </thead>
      <tbody>
        {log?.map((l, i) => {
          return (
            <tr key={i}>
              <td>{l.dangerLevel}</td>
              <td>{l.abnormalId}</td>
              <td>{l.abnormalType}</td>
              {/* <td>{l.abnVal}</td> */}
              <td>{new Date(l.detectedAt).toLocaleString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function EquipTable({ log }) {
  if (!log) {
    return;
  }
  return (
    <table className="worker-table">
      <thead>
        <tr className="table-header">
          <th style={{ width: "2%" }}>위험도</th>
          <th style={{ width: "2%" }}>No.</th>
          <th>유형</th>
          <th style={{ width: "2%" }}>값</th>
          <th>발생 시각</th>
          {/* <th>제어</th> */}
        </tr>
      </thead>
      <tbody>
        {log?.map((l, i) => {
          return (
            <tr key={i}>
              <td>{l.dangerLevel}</td>
              <td>{l.abnormalId}</td>
              <td>{l.abnormalType}</td>
              <td>D-{l.abnVal}</td>
              <td>{new Date(l.detectedAt).toLocaleString()}</td>
              {/* <td>{l.control.controlStat}</td> */}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function EquipLogs({ equip }) {
  if (equip.facAbnormals)
    return (
      <>
        <div className="sensorlist">
          <div
            className="sensorlist-underbar"
            style={{ marginBottom: "0.5rem", lineHeight: "2.25rem" }}
          >
            <span>
              {equip.equipName ?? "로딩실패"} ({equip.equipId})
            </span>
            <span>{equip.facCnt} 건</span>
          </div>
          <div style={{ overflow: "auto", maxHeight: "40vh" }}>
            <EquipTable log={equip.facAbnormals} />
          </div>
        </div>
      </>
    );
}
