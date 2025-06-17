import axiosInstance from "../api/axiosInstance";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import { mock_report } from "../mock_data/mock_report";
import YCSide from "../assets/img/monitory_character_side.png";
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    showLabel,
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      {showLabel && (
        <text
          x={cx}
          y={cy}
          dominantBaseline="middle"
          textAnchor="middle"
          fill={fill}
          fontSize={payload.grade == "loading" ? "1rem" : "2.5rem"}
          fontWeight="bold"
          style={{
            opacity: showLabel ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          {payload.grade}
        </text>
      )}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 3}
        outerRadius={outerRadius + 5}
        fill={fill}
      />
    </g>
  );
};

function Donut({ report, color }) {
  const [showLabel, setShowLabel] = useState(false);
  return (
    <div className="donut-box">
      <h3 style={{ color: color.textColor }}>{report.type}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={0}
            activeShape={(props) => renderActiveShape({ ...props, showLabel })}
            data={[{ grade: report.grade, value: 1 }]}
            cx="50%"
            cy="50%"
            innerRadius={"70%"}
            outerRadius={"95%"}
            startAngle={-270}
            endAngle={90}
            fill={color.donutColor}
            dataKey="value"
            onAnimationEnd={() => setShowLabel(true)}
          />
        </PieChart>
      </ResponsiveContainer>
      <p>
        경고/위험 발생 <strong>{report.warnCnt + report.dangerCnt}건</strong>
      </p>
    </div>
  );
}

export default function MainBox({ isSidebarOpen }) {
  const [report, setReport] = useState([]);

  // 지난달 정보
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const lastMonth = new Date();
  lastMonth.setMonth(yesterday.getMonth() - 1);

  // 날짜 포맷팅
  const formatted = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}.${m}.${d}`;
  };

  useEffect(() => {
    axiosInstance
      .get(`/api/abnormal/report`)
      .then((res) => {
        setReport(res.data.data.abnormalInfos);
      })
      .catch((e) => {
        setReport([]);
      });
  }, []);

  const getColor = (grade) => {
    let color = { donutColor: null, textColor: null };
    if (grade) {
      if (grade === "A") {
        color.donutColor = "#608dff";
        color.textColor = "#1d4a7a";
      } else if (grade === "B") {
        color.donutColor = "#C5E384";
        color.textColor = "#658332";
      } else if (grade === "C") {
        color.donutColor = "#FFD88A";
        color.textColor = "#B76B00";
      }
    } else {
      color.donutColor = "#afafaf";
      color.textColor = "#5f5f5f";
    }
    return color;
  };

  /* 이스터에그 같은 거 저도 해보고 싶었거든요... */
  const [showRobot, setShowRobot] = useState(false);
  useEffect(() => {
    if (!isSidebarOpen) {
      const shouldShow = Math.random() < 0.3; // 30% 확률
      setShowRobot(shouldShow);
    } else {
      setShowRobot(false);
    }
  }, [isSidebarOpen]);

  return (
    <>
      <div className="main-box" style={{ backgroundColor: "#eff7ff" }}>
        {showRobot && (
          <Link to="/team">
            <img src={YCSide} className="robot-side" />
          </Link>
        )}
        <h2>모니토리 요약 리포트</h2>
        <p>
          반영 기간: {formatted(lastMonth)} ~ {formatted(yesterday)}
        </p>
        <div className="donut-wrapper">
          {report &&
            report?.map((r, i) => {
              return <Donut report={r} color={getColor(r.grade)} key={i} />;
            })}
        </div>
      </div>
    </>
  );
}
