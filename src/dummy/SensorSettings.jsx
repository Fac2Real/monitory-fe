import { useEffect, useState } from "react";
import MiniMonitor from "../MiniMonitor";
import mockSensorList from "../mock_data/mock_sensorlist";
import axiosInstance from "../api/axiosInstance";

export default function SensorSettings() {
  const [sensorFormData, setFormData] = useState({
    sensorPurpose: "",
    sensorPosition: "",
    facilityType: "",
    sensorType: "",
    sensorId: "",
    sensorThres: 0,
  });

  const [unregistered, setUnregistered] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/api/sensors/unregistered")
      .then((res) => {
        setUnregistered(res.data);
      })
      .catch((e) => console.error(e));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleButton = (e) => {
    axiosInstance
      .post(`/api/sensors/${sensorFormData.sensorId}`, {
        sensorPurpose: sensorFormData.sensorPurpose,
        location: sensorFormData.sensorPosition,
        threshold: sensorFormData.sensorThres,
      })
      .then((res) =>
        console.log(
          `제출 버튼: ${sensorFormData.sensorPurpose} ${sensorFormData.sensorPosition} ${sensorFormData.sensorType} ${sensorFormData.sensorThres} ${sensorFormData.facilityType}`
        )
      )
      .catch((e) => console.log(e));
  };

  return (
    <>
      <h2>기기 관리</h2>
      <div className="page-contents">
        <div className="rows">
          <table>
            <thead>
              <tr>
                <th>기기 등록/수정</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="table-contents">
                    <div className="dropdown">
                      <label htmlFor="sensorPurpose">센서 목적</label>
                      <select
                        id="sensorPurpose"
                        name="sensorPurpose"
                        value={sensorFormData.sensorPurpose}
                        onChange={handleChange}
                      >
                        <option value="" disabled selected></option>
                        <option value="environment">환경 모니터링</option>
                        <option value="facility">설비 모니터링</option>
                      </select>
                    </div>
                    <div className="dropdown">
                      <label htmlFor="sensorPosition">위치</label>
                      <select
                        id="sensorPosition"
                        name="sensorPosition"
                        value={sensorFormData.sensorPosition}
                        onChange={handleChange}
                      >
                        <option value="" disabled selected></option>
                        <option value="pos1">테스트룸1</option>
                        <option value="pos2">테스트룸2</option>
                        <option value="pos3">테스트룸3</option>
                        <option value="pos4">테스트룸4</option>
                      </select>
                    </div>
                    {sensorFormData.sensorPurpose == "facility" && (
                      <div className="dropdown">
                        <label htmlFor="facilityType">설비 종류</label>
                        <select
                          id="facilityType"
                          name="facilityType"
                          value={sensorFormData.facilityType}
                          onChange={handleChange}
                        >
                          <option value="" disabled selected></option>
                          <option value="fac1">설비 1</option>
                          <option value="fac2">설비 2</option>
                          <option value="fac3">설비 3</option>
                        </select>
                      </div>
                    )}
                    <div className="dropdown">
                      <label htmlFor="sensorId">센서 ID</label>
                      <select
                        id="sensorId"
                        name="sensorId"
                        value={sensorFormData.sensorId}
                        onChange={handleChange}
                      >
                        <option value="" disabled selected></option>
                        {unregistered.map((sens, key) => (
                          <option value={sens.sensorId} key={key}>
                            {sens.sensorId} - {sens.sensorType}
                          </option>
                        ))}
                      </select>
                    </div>
                    {sensorFormData.sensorPurpose == "environment" && (
                      <div className="dropdown">
                        <label htmlFor="sensorThres">센서 임계치</label>
                        <input
                          id="sensorThres"
                          name="sensorThres"
                          type="number"
                          value={sensorFormData.sensorThres}
                          onChange={handleChange}
                        />
                      </div>
                    )}
                    <div className="button-flex">
                      <button onClick={handleButton}>등록</button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <MiniMonitor />
      </div>
    </>
  );
}
