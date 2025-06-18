import { isValidElement, useEffect, useState } from "react";
import XIcon from "../../assets/x_icon.svg?react";
import BasicModal from "./BasicModal";
import "./modal.css";
import axiosInstance from "../../api/axiosInstance";

const formatPhoneNumber = (value) => {
  const onlyNums = value.replace(/[^\d]/g, "").slice(0, 11); // 숫자만, 최대 11자리

  if (onlyNums.length < 4) return onlyNums;
  if (onlyNums.length < 8)
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
  return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7)}`;
};

function ContactTable({ workerInfo, onClose, fetchWorkers }) {
  const {
    name,
    email,
    phoneNumber,
    workerId,
    isManager,
    accessZones,
    managedZones,
  } = workerInfo;
  const [formData, setForm] = useState({
    workerId: workerId,
    name: name,
    phoneNumber: phoneNumber,
    email: email,
    selectedZones: accessZones?.map((z) => z.zoneName) ?? [],
    managedZones: managedZones?.map((z) => z.zoneName) ?? [],
  });

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: field === "phoneNumber" ? formatPhoneNumber(value) : value,
    }));
  };

  const handleCheckboxChange = (e, zoneName) => {
    setForm((prevForm) => {
      const alreadySelected = prevForm.selectedZones?.includes(zoneName);
      const updatedZones = alreadySelected
        ? prevForm.selectedZones?.filter((zone) => zone !== zoneName)
        : [...prevForm.selectedZones, zoneName];

      return {
        ...prevForm,
        selectedZones: updatedZones,
      };
    });
  };

  const [zoneList, setZoneList] = useState([]);
  useEffect(() => {
    axiosInstance.get(`/api/zones`).then((res) => {
      setZoneList(res.data.data);
    });
  }, []);

  const handleSubmit = () => {
    let isValid = true;
    let invalidList = [];
    const { name, phoneNumber, email } = formData;
    if (
      [name, phoneNumber, email].some((val) => val.replace(/\s+/g, "") === "")
    ) {
      isValid = false;
    }
    const phonePattern = /^\d{3}-\d{4}-\d{4}$/; // 하이픈 포함해서 XXX-YYYY-ZZZZ 형식
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // x@y.z 형식
    const namePattern = /^[가-힣a-zA-Z\s]+$/; // 이름은 문자여야 함
    if (!namePattern.test(name)) {
      isValid = false;
      invalidList.push("이름");
    }
    if (!phonePattern.test(phoneNumber)) {
      isValid = false;
      invalidList.push("전화번호");
    }
    if (!emailPattern.test(email)) {
      isValid = false;
      invalidList.push("이메일");
    }
    if (!isValid) {
      alert(`입력값이 올바른지 확인하세요: ${invalidList.join(", ")}`);
      return;
    }
    if (window.confirm(`수정한 정보를 저장하시겠습니까?`)) {
      axiosInstance
        .post(`/api/workers/update`, {
          workerId: formData.workerId,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          zoneNames: formData.selectedZones,
        })
        .then(() => {
          alert("저장되었습니다!");
          onClose(false);
          fetchWorkers();
        })
        .catch((e) => {
          if (e.response.status == 409) {
            alert(e.response.data.message);
            return;
          }
          console.error("직원 정보 수정에 실패했습니다:", e);
          alert("직원 정보 수정에 실패했습니다. 다시 시도해주세요.");
          onClose(true);
        });
    }
  };

  return (
    <div className="table-container" style={{ justifyContent: "flex-end" }}>
      <table className="contact-table">
        <thead>
          <tr>
            <th>사번</th>
            <td style={{ backgroundColor: "var(--box-color)" }}>
              {formData.workerId}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">이름</th>
            <td>
              <input
                onChange={handleInputChange("name")}
                value={formData.name}
                className="workerInfo-input"
              ></input>
            </td>
          </tr>
          <tr>
            <th scope="row">휴대폰 번호</th>
            <td>
              <input
                onChange={handleInputChange("phoneNumber")}
                value={formData.phoneNumber}
                className="workerInfo-input"
              ></input>
            </td>
          </tr>
          <tr>
            <th scope="row">이메일</th>
            <td>
              <input
                onChange={handleInputChange("email")}
                value={formData.email}
                className="workerInfo-input"
              ></input>
            </td>
          </tr>
          <tr>
            <th scope="row">출입 권한 설정</th>
            <td>
              <div className="checkbox-group edit-mode">
                {zoneList?.map((z) => {
                  return (
                    <span key={z.zoneId}>
                      <input
                        id={z.zoneName}
                        name={z.zoneName}
                        type="checkbox"
                        value={z.zoneName}
                        checked={formData.selectedZones?.includes(z.zoneName)}
                        onChange={(e) => handleCheckboxChange(e, z.zoneName)}
                      ></input>
                      <label htmlFor={z.zoneName}>{z.zoneName}</label>
                    </span>
                  );
                })}
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row">담당자 여부</th>
            <td style={{ backgroundColor: "var(--box-color)" }}>
              {isManager ? `예 (${managedZones[0].zoneName})` : "아니오"}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="button-flex">
        <button onClick={handleSubmit}>수정</button>
      </div>
    </div>
  );
}

export default function WorkerInfoModal({
  isOpen,
  onClose,
  workerInfo,
  fetchWorkers,
}) {
  if (isOpen) {
    return (
      <BasicModal
        onClose={onClose}
        type="edit"
        modal_contents={{
          title: `직원 정보 수정`,
          contents: (
            <ContactTable
              workerInfo={workerInfo}
              onClose={onClose}
              fetchWorkers={fetchWorkers}
            />
          ),
        }}
      />
    );
  }
  return <></>;
}
