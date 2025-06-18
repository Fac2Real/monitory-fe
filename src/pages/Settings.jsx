import { useEffect, useRef, useState } from "react";
import ZoneInfoBox from "../components/ZoneInfoBox";
import axiosInstance from "../api/axiosInstance";

import SensorModal from "../components/modal/SensorModal";
import FacilityModal from "../components/modal/FacilityModal";
import EditModal from "../components/modal/EditModal";
import FacEditModal from "../components/modal/FacEditModal";
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
  const [selectedFac, setSelectedFac] = useState();
  const [selectedFacId, setSelectedFacId] = useState();
  const [isSensorModalOpen, setSensorModalOpen] = useState(false); // 모달 열기
  const [isFacilityModalOpen, setFacilityModalOpen] = useState(false); // 모달 열기
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isFacEditModalOpen, setFacEditOpen] = useState(false);
  const [zoneList, setZoneList] = useState([]); // 존 추가하고 열기

  /* ────────────────────────────────
       2. ① 공간 + ② 센서를 한 번에 받아서 매핑
    ───────────────────────────────── */
  useEffect(() => {
    Promise.all([
      axiosInstance.get("/api/zones/zoneitems"), // zoneItems 1개만 써도 OK
    ])
      .then(([res]) => {
        const list = res.data.data?.map((z) => ({
          title: z.zoneName,
          env_sensor: z.envList?.map((s) => ({
            name: toKoName(s.sensorType), // 한글 변환
            thres: s.sensorThres,
            margin: s.allowVal, // JSON 내용 확인해서 변경해야댐..
            sensorId: s.sensorId,
          })),
          facility: z.equipList?.map((f) => ({
            name: f.equipName,
            id: f.equipId,
            fac_sensor: f.facSensor?.map((s) => ({
              name: toKoName(s.sensorType),
              id: s.sensorId,
            })),
          })),
        }));

        setZoneList(list.length ? list : initialZoneList);
      })
      .catch(console.error);
  }, []);

  /* 모달 여는 동작 전용 함수 */
  const handleOpenSensorModal = (zoneName, sensorId, thres, margin) => {
    setSensorInfo({ zoneName, sensorId, thres, margin });
    setSensorModalOpen(true);
  };

  const handleOpenFacilityModal = (zoneName) => {
    setSelectedZone(zoneName);
    setFacilityModalOpen(true);
  };

  const handleOpenZoneEditModal = (zoneName) => {
    setSelectedZone(zoneName);
    setEditModalOpen(true);
  };

  const handleOpenFacEditModal = (facName, equipId) => {
    setSelectedFac(facName);
    setSelectedFacId(equipId);
    setFacEditOpen(true);
  };

  const handleThresUpdate = (newThres, newMargin) => {
    /* TODO :: 임계값 업데이트하기 */
    axiosInstance
      .post(`/api/sensors/${sensorInfo.sensorId}`, {
        sensorThres: newThres,
        allowVal: newMargin,
      })
      .then((res) => {
        const updated = zoneList?.map((zone) => {
          if (zone.title !== sensorInfo.zoneName) {
            return zone;
          }
          return {
            ...zone,
            env_sensor: zone.env_sensor?.map((sen) => {
              if (sen.sensorId !== sensorInfo.sensorId) {
                return sen;
              }
              return { ...sen, thres: newThres, margin: newMargin };
            }),
          };
        });
        setZoneList(updated);
      })
      .catch((e) => {
        console.error("임계값 업데이트 실패:", e);
        alert("임계값 업데이트에 실패했습니다. 다시 시도해주세요.");
      });
    setSensorModalOpen(false);
  };

  // 설비 추가
  const handleFacilityUpdate = (newValue) => {
    if (newValue.length == 0) {
      return;
    }
    axiosInstance
      .post("/api/equips", {
        zoneName: selectedZone,
        equipName: newValue,
      })
      .then((res) => {
        const newId = res.data.data.equipId;
        const updated = zoneList?.map((z) => {
          if (z.title !== selectedZone) return z;
          return {
            ...z,
            facility: [
              ...(z.facility || []),
              {
                name: newValue,
                id: newId,
                fac_sensor: [],
              },
            ],
          };
        });
        setZoneList(updated);
        alert(`${newValue} 설비가 추가되었습니다.`);
      })
      .catch((e) => {
        console.error("설비 추가 실패:", e);
        alert("설비 추가에 실패했습니다. 다시 시도해주세요.");
      });
    setFacilityModalOpen(false);
  };

  // 공간명 수정
  const handleEditZone = (newZoneName) => {
    if (newZoneName.length == 0) {
      return;
    }
    axiosInstance
      .post(`/api/zones/${selectedZone}`, {
        zoneName: newZoneName,
      })
      .then(() => {
        const updated = zoneList?.map((z) => {
          if (z.title !== selectedZone) return z;
          return {
            ...z,
            title: newZoneName,
          };
        });
        setZoneList(updated);
        alert(`${selectedZone}이 ${newZoneName}로 변경되었습니다`); // 없애도 되려나..
        setSelectedZone(newZoneName);
      })
      .catch((e) => alert("이름 변경에 실패하였습니다"));
    setEditModalOpen(false);
  };

  // 설비 이름 수정
  const handleEditFac = (newFacName, equipId) => {
    if (newFacName.length == 0) {
      return;
    }
    axiosInstance
      .post(`/api/equips/${equipId}`, {
        equipName: newFacName,
      })
      .then((res) => {
        const updated = zoneList?.map((z) => {
          return {
            ...z,
            facility: z.facility?.map((fac) => {
              if (fac.id !== equipId) return fac;

              return {
                ...fac,
                name: newFacName,
              };
            }),
          };
        });

        setZoneList(updated);
        alert(`설비명이 ${newFacName}로 변경되었습니다`); // 없애도 되려나..
      })
      .catch((e) => {
        console.error("설비 이름 수정 실패:", e);
        alert("설비 이름 수정에 실패했습니다. 다시 시도해주세요.");
      });

    setFacEditOpen(false);
  };

  // 공간 생성
  const handleAddZone = async (newZone) => {
    const confirmed = window.confirm(`[${newZone}]을 추가하시겠습니까?`);
    if (!confirmed) return;
    else {
      axiosInstance
        .post("/api/zones", {
          zoneName: newZone,
        })
        .then((res) => {
          const newItem = {
            title: newZone,
            env_sensor: [],
            facility: [],
            // master: "",
          };

          setZoneList((prev) => [...prev, newItem]);
          alert(`${newZone} 공간이 생성되었습니다.`);
        })
        .catch((e) => {
          alert("공간 생성에 실패하였습니다.", e);
        });
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
      <FacEditModal
        isOpen={isFacEditModalOpen}
        onClose={() => setFacEditOpen(false)}
        facName={selectedFac}
        equipId={selectedFacId}
        onUpdate={handleEditFac}
      />
      <h1>센서 관리</h1>
      {zoneList?.map((z, i) => (
        <ZoneInfoBox
          zone={z}
          key={z.title}
          sensorModalBtn={handleOpenSensorModal}
          facilityModalBtn={handleOpenFacilityModal}
          zoneEditModalBtn={handleOpenZoneEditModal}
          facEditModalBtn={handleOpenFacEditModal}
          isFirst={i === 0}
        />
      ))}
      <ZoneInfoBox zone="공간 추가" onAddZone={handleAddZone} />
    </>
  );
}
