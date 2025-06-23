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
import Logo from "../../assets/logo.svg?react";

function SummaryBox({ title, count }) {
  const box_color =
    title == "전체"
      ? "var(--blue)"
      : `${title == "경고" ? "var(--warning3)" : "orangered"}`;
  return (
    <div
      className="summarybox"
      style={{
        color: box_color,
      }}
    >
      <h3>{title}</h3>
      <p>{count} 건</p>
    </div>
  );
}

export default function GeneralReport({ report }) {
  const typeData = report?.typeStats
    ?.sort((a, b) => b.cnt - a.cnt)
    .slice(0, 5)
    ?.map((item) => ({
      name: item.label,
      count: item.cnt,
    }));

  const dateData = report?.dateStats
    ?.sort((a, b) => b.cnt - a.cnt)
    .slice(0, 5)
    ?.map((item) => ({
      name: item.label,
      count: item.cnt,
    }));

  const zoneData = report?.zoneStats
    ?.sort((a, b) => b.cnt - a.cnt)
    .slice(0, 5)
    ?.map((item) => ({
      name: item.label,
      count: item.cnt,
    }));

  return (
    <>
      <div>
        {/* <h2>발생 건수 요약</h2> */}
        <div className="summarybox-flex">
          <SummaryBox title="전체" count={report?.totalCnt ?? 0} />
          <SummaryBox title="경고" count={report?.warnCnt ?? 0} />
          <SummaryBox title="위험" count={report?.dangerCnt ?? 0} />
        </div>
      </div>
      <div className="box-wrapper">
        <div className="top-box">유형별 이상 발생 건수</div>
        <div className="bottom-box">
          <GraphContainer data={typeData} />
        </div>
      </div>
      <div className="box-wrapper">
        <div className="top-box">날짜별 이상 발생 건수</div>
        <div className="bottom-box">
          <GraphContainer data={dateData} />
        </div>
      </div>
      <div className="box-wrapper">
        <div className="top-box">공간별 이상 발생 건수</div>
        <div className="bottom-box">
          <GraphContainer data={zoneData} />
        </div>
      </div>
    </>
  );
}

function GraphContainer({ data }) {
  return (
    <div className="total-box">
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
        <table className="worker-table">
          <thead>
            <tr className="table-header">
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>항목</th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>건수</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item.name}>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                  {item.name}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                  {item.count}
                </td>
              </tr>
            ))}
            {data?.length == 0 && (
              <>
                <tr>
                  <td colSpan={2}>
                    <div
                      className="null-container"
                      style={{ marginTop: "1rem" }}
                    >
                      <Logo width="2rem" />
                      <p>기록 없음</p>
                    </div>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Example({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" stackId="a" fill="#1D4A7A" maxBarSize={45} />
      </BarChart>
    </ResponsiveContainer>
  );
}
