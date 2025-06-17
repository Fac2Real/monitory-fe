import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./Sidebar";
import "./styles/style.css";
import "./styles/common.css";
import Settings from "./pages/Settings";
import Monitoring from "./pages/Monitoring";
import Report from "./pages/Report";
import Safety from "./pages/Safety";
import ZoneDetail from "./pages/ZoneDetail";
import { ToastProvider } from "./contexts/ToastProvider";
import { useState } from "react";
import Login from "./pages/Login";
import Help from "./pages/Help";
import BasicModal from "./components/modal/BasicModal";
import HiddenPage from "./pages/HiddenPage";
import Header from "./Header";

export default function App() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="main">
          <Header />
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          <div className={`sidebar-guard ${isOpen ? "open" : "close"}`}></div>
          <div className="contents">
            <Routes>
              <Route path="/" element={<Home isSidebarOpen={isOpen} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/report" element={<Report />} />
              <Route path="/zone/:zoneId" element={<ZoneDetail />} />
              <Route path="/help" element={<Help />} />
              <Route path="/team" element={<HiddenPage />} />
              <Route path="*" element={<BasicModal />} />
            </Routes>
          </div>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}
