import { Link } from "react-router-dom";
import "./styles/header.css";
import { useState } from "react";
import QuestionIcon from "./assets/question_icon.svg?react";
import LogoutIcon from "./assets/logout_icon.svg?react";
import HomeIcon from "./assets/home_icon.svg?react";
import Logo from "./assets/simple_logo.svg?react";
import axiosInstance from "./api/axiosInstance";
export default function Header() {
  const [isOpen, setIsOpen] = useState(true);
  const handleButtonClick = () => {
    const result = confirm("로그아웃하시겠습니까?");
    if (!result) {
      return;
    }
    axiosInstance
      .post("/api/auth/logout")
      .then(() => {
        localStorage.removeItem("isLoggedIn");
        window.location.href = "/login";
      })
      .catch((e) => {
        console.error("로그아웃 실패", e);
        alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
      });
  };
  return (
    <>
      <div className="header-wrapper">
        <div className="header-container">
          <div className="header-body">
            <div
              style={{ display: "flex" }}
              className={isOpen ? `quick-open` : `quick-closed`}
            >
              <Link to="/" className="link-as-contents">
                <span className="header-menu">
                  <HomeIcon width="1rem" fill="gray" opacity="0.7" />
                  HOME
                </span>
              </Link>
              <Link to="/team" className="link-as-contents">
                <span className="header-menu">
                  <Logo width="1rem" fill="gray" opacity="0.7" />
                  Team Factoreal
                </span>
              </Link>
              <Link to="/help" className="link-as-contents">
                <span className="header-menu">
                  <QuestionIcon width="1rem" fill="gray" opacity="0.7" />
                  모니토리 사용법
                </span>
              </Link>
              <Link className="link-as-contents">
                <span
                  onClick={handleButtonClick}
                  className="header-menu"
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    color: "red",
                    borderColor: "red ",
                  }}
                >
                  <LogoutIcon fill="red" width="1rem" />
                  로그아웃
                </span>
              </Link>
            </div>
            <span
              style={{
                cursor: "pointer",
                fontWeight: 650,
                borderColor: "black",
                borderBlockWidth: "1.75px",
              }}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? (
                "닫기"
              ) : (
                <>
                  <strong style={{ fontWeight: "900" }}>↼</strong> 퀵 메뉴
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
