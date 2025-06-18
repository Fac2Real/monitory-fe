import { useEffect, useState } from "react";
import Logo from "../../assets/logo.svg?react";
import { EnvLogs, EquipLogs, WokrerLogs } from "./ZonewiseLogs.jsx";

export default function ZonewiseReport({ report }) {
  const [data, setData] = useState({});
  useEffect(() => {
    const tmp = [
      { name: "전체", count: report.totalCnt },
      { name: "환경", count: report.envCnt },
      { name: "안전", count: report.workerCnt },
      { name: "설비", count: report.facCnt },
    ];
    setData(tmp);
  }, [report]);

  const [mode, setMode] = useState("total");
  return (
    <>
      <div className="box-wrapper">
        <div className="top-box cat-top-box">
          <div
            className="buttonlike"
            onClick={() => {
              setMode("total");
            }}
          >
            {report.zoneName}
          </div>
          <div className="cat-box-mini">
            <div
              style={{ color: `${mode == "env" ? "var(--c3)" : ""}` }}
              className="buttonlike"
              onClick={() => {
                setMode("env");
              }}
            >
              환경 ({report.envCnt}건)
            </div>
            <div
              style={{ color: `${mode == "worker" ? "var(--c3)" : ""}` }}
              className="buttonlike"
              onClick={() => {
                setMode("worker");
              }}
            >
              안전 ({report.workerCnt}건)
            </div>
            <div
              style={{ color: `${mode == "fac" ? "var(--c3)" : ""}` }}
              className="buttonlike"
              onClick={() => {
                setMode("fac");
              }}
            >
              설비 ({report.facCnt}건)
            </div>
          </div>
        </div>
        <div className="bottom-box cat-bottom-box">
          {mode == "total" && <Total data={data} />}
          {mode == "env" && (
            <EnvReport info={report.envAbnormals} cnt={report.envCnt} />
          )}
          {mode == "worker" && (
            <WorkerReport info={report.workers} cnt={report.workerCnt} />
          )}
          {mode == "fac" && (
            <EquipReport info={report.equips} cnt={report.facCnt} />
          )}
        </div>
      </div>
    </>
  );
}

function NoItems({ mode }) {
  return (
    <div className="null-container">
      <Logo width="3rem" />
      <p>{mode} 이상 기록 없음</p>
    </div>
  );
}

function EnvReport({ info, cnt }) {
  if (cnt == 0) {
    return <NoItems mode="환경" />;
  }
  return <EnvLogs log={info} />;
}

function WorkerReport({ info, cnt }) {
  if (cnt == 0) {
    return <NoItems mode="안전" />;
  }
  return (
    <>
      {info?.map((w, i) => (
        <WokrerLogs key={i} worker={w} />
      ))}
    </>
  );
}

function EquipReport({ info, cnt }) {
  if (cnt == 0) {
    return <NoItems mode="설비" />;
  }
  return (
    <>
      {info?.map((e, i) => {
        return <EquipLogs key={i} equip={e} />;
      })}
    </>
  );
}

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Example({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" stackId="a" fill="#000" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function Total({ data }) {
  return (
    <div className="total-box">
      {!data[0]?.count && <NoItems mode="" />}
      {!!data[0]?.count && (
        <>
          <div
            style={{
              width: "50%",
              maxWidth: "25rem",
              height: "auto",
              marginTop: "1.5rem",
            }}
          >
            <Example data={data} />
          </div>
          <div className="text-area">
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                textAlign: "center",
              }}
              className="worker-table"
            >
              <tbody>
                <tr>
                  <th
                    style={{
                      padding: "8px",
                      border: "1px solid #ccc",
                      width: "30%",
                      backgroundColor: "var(--head)",
                      color: "white",
                    }}
                  >
                    전체
                  </th>
                  <td
                    style={{
                      backgroundColor: "white",
                      padding: "8px",
                      border: "1px solid #ccc",
                    }}
                  >
                    {data[0].count}
                  </td>
                </tr>
                {data.slice(1)?.map((item) => (
                  <tr key={item.name}>
                    <th
                      style={{
                        padding: "8px",
                        border: "1px solid #ccc",
                        backgroundColor: "var(--head)",
                        color: "white",
                      }}
                    >
                      {item.name}
                    </th>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
