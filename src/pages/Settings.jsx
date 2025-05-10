import { useEffect, useRef, useState } from "react";
import SensorModal from "../components/SensorModal";
import ZoneInfoBox from "../components/ZoneInfoBox";
import axiosInstance from "../api/axiosInstance";
import FacilityModal from "../components/FacilityModal";
import EditModal from "../components/EditModal";
/* ────────────────────────────────
   1. 센서 타입 → 한글 명/분류 매핑
──────────────────────────────── */

const toKoName = (type) => {
  switch (type) {
    case "temp":
      return "온도 센서";
    case "humid":
      return "습도 센서";
    case "dust":
      return "먼지 센서";
    case "current":
      return "전류 센서";
    case "vibration":
      return "진동 센서";
    default:
      return type;
  }
};

export default function Settings() {
  const [sensorInfo, setSensorInfo] = useState(); // 모달 전달용
  const [selectedZone, setSelectedZone] = useState(); // 모달 전달용
  const [isSensorModalOpen, setSensorModalOpen] = useState(false); // 모달 열기
  const [isFacilityModalOpen, setFacilityModalOpen] = useState(false); // 모달 열기
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [zoneList, setZoneList] = useState([]); // 존 추가하고 열기

  // mock-data 시작 -->
  const initialZoneList = [
    {
      title: "보일러실",
      env_sensor: [
        { name: "온도 센서", thres: 60, sensorId: "TEMP001" },
        { name: "습도 센서", thres: 75, sensorId: "HUMID001" },
      ],
      facility: [
        {
          name: "설비A",
          fac_sensor: [
            { name: "진동 센서", id: "UA10T-VIB-24060890" },
            { name: "온도 센서", id: "UA10T-TEM-24060890" },
          ],
        },
      ],
      master: "김00",
    },
    {
      title: "휴게실",
      env_sensor: [],
      facility: [
        {
          name: "설비B",
          fac_sensor: [
            { name: "진동 센서", id: "UA10T-VIB-24060891" },
            { name: "온도 센서", id: "UA10T-TEM-24060891" },
          ],
        },
      ],
      master: "윤00",
    },
    { title: "테스트룸A", env_sensor: [], facility: [], master: "정00" },
    {
      title: "테스트룸B",
      env_sensor: [],
      facility: [{ name: "설비A" }],
      master: "윤00",
    },
  ];
  
  // <---- mock-data 끝

  /* ────────────────────────────────
       2. ① 공간 + ② 센서를 한 번에 받아서 매핑
    ───────────────────────────────── */
  useEffect(() => {
  Promise.all([
      axiosInstance.get("/api/zones/zoneitems"),    // zoneItems 1개만 써도 OK
    ])
      .then(([res]) => {
        const list = res.data.map((z) => ({
          title: z.title,
          env_sensor: z.env_sensor.map((s) => ({
            name:  toKoName(s.sensorType),        // 한글 변환
            thres: s.thres ?? "-",                // thres 없으면 “-”
            sensorId: s.sensorId,
          })),
          facility: z.facility.map((f) => ({
            name: f.name,
            fac_sensor: f.fac_sensor.map((s) => ({
              name: toKoName(s.sensorType),
              id:   s.sensorId,
            })),
          })),
        }));
  
        setZoneList(list.length ? list : initialZoneList);
        })
        .catch(console.error);
  }, []);

  /* 모달 여는 동작 전용 함수 */
  const handleOpenSensorModal = (zoneName, sensorId, thres) => {
    setSensorInfo({ zoneName, sensorId, thres });
    setSensorModalOpen(true);
  };

  const handleOpenFacilityModal = (zoneName) => {
    setSelectedZone(zoneName);
    setFacilityModalOpen(true);
  };

  const handleOpenEditModal = (zoneName) => {
    setSelectedZone(zoneName);
    setEditModalOpen(true);
  };

  const handleThresUpdate = (newValue) => {
    /* TODO :: 임계값 업데이트하기 */
    /* 화면 표현하기 (완료) */
    const value = Number(newValue);
    const updated = zoneList.map((zone) => {
      if (zone.title !== sensorInfo.zoneName) {
        return zone;
      }
      return {
        ...zone,
        env_sensor: zone.env_sensor.map((sen) => {
          if (sen.sensorId !== sensorInfo.sensorId) {
            return sen;
          }
          return { ...sen, thres: value };
        }),
      };
    });
    setZoneList(updated);
    setSensorModalOpen(false);
  };

  const handleFacilityUpdate = (newValue) => {
    axiosInstance.post("/api/equips", {
      zoneName: selectedZone,
      equipName: newValue,
    });
    // console.log(`공간명: ${selectedZone} 설비명: ${newValue}`);
    /* TODO :: 설비 목록 업데이트하기 */
    // axios.post() 
    /* 화면 표현하기 */
    const updated = zoneList.map((z) => {
      if (z.title !== selectedZone) return z;
      return {
        ...z,
        facility: [
          ...(z.facility || []),
          {
            name: newValue,
            fac_sensor: [],
          },
        ],
      };
    });
    setZoneList(updated);
    setFacilityModalOpen(false);
  };

  const handleEditZone = (newZoneName) => {
    // 여기에 editzone 수정 API
    console.log("공간명 변경 제출!");

    axiosInstance.post(`/api/zones/${selectedZone}`, {
      zoneName: newZoneName,
    });

    // 화면 반영 ()
    const updated = zoneList.map((z) => {
      if (z.title !== selectedZone) return z;
      return {
        ...z,
        title: newZoneName,
      };
    });
    setZoneList(updated);
    alert(`${selectedZone}이 ${newZoneName}로 변경되었습니다`); // 없애도 되려나..
    setSelectedZone(newZoneName);
    setEditModalOpen(false);
  };

  const handleAddZone = async (newZone) => {
    const confirmed = window.confirm(`[${newZone}]을 추가하시겠습니까?`);
    if (!confirmed) return;
    else {
      try {
        axiosInstance.post("/api/zones", {
          zoneName: newZone,
        });

        const newItem = {
          title: newZone,
          env_sensor: [],
          facility: [],
          master: "",
        };

        setZoneList((prev) => [...prev, newItem]);
      } catch (err) {
        console.error(err);
        alert("공간 생성에 실패했습니다.");
      }
    }
  };

  return (
    <>
      <SensorModal
        isOpen={isSensorModalOpen}
        onClose={() => setSensorModalOpen(false)}
        sensorInfo={sensorInfo}
        onUpdate={handleThresUpdate}
      />
      <FacilityModal
        isOpen={isFacilityModalOpen}
        onClose={() => setFacilityModalOpen(false)}
        zoneInfo={selectedZone}
        onUpdate={handleFacilityUpdate}
      />
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        zoneName={selectedZone}
        onUpdate={handleEditZone}
      />
      <h1>센서 관리</h1>
      {zoneList.map((z, i) => (
        <ZoneInfoBox
          zone={z}
          key={z.title}
          sensorModalBtn={handleOpenSensorModal}
          facilityModalBtn={handleOpenFacilityModal}
          editModalBtn={handleOpenEditModal}
        />
      ))}
      <ZoneInfoBox zone="공간 추가" onAddZone={handleAddZone} />
    </>
  );
}
