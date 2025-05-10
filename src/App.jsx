import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./Sidebar";
import "./styles/style.css";
import Settings from "./pages/Settings";
import Monitoring from "./pages/Monitoring";
import Certification from "./pages/Certifiaction";
// import ZoneDetail from "./pages/ZoneDetail";
import Safety from "./pages/Safety";
import Facility from "./pages/Facility";
import ZoneDetail_2 from "./pages/ZoneDetail_2";
import { ToastProvider } from "./contexts/ToastProvider";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="main">
          <Sidebar />
          <div className="contents">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/monitoring" element={<Monitoring />} />
              {/* <Route path="/zone/:zoneId" element={<ZoneDetail />} /> */}
              <Route path="/safety" element={<Safety />} />
              <Route path="/facility" element={<Facility />} />
              <Route path="/certification" element={<Certification />} />

              <Route path="/zone/:zoneId" element={<ZoneDetail_2 />} />
            </Routes>
          </div>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}
