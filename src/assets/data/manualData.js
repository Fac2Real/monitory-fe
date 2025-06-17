import loginImg from "./img/login.png";
import homeImg from "./img/home.png";
import miniReportImg from "./img/mini_report.png";
import shortcutImg from "./img/shortcut.png";
import sidebarImg from "./img/sidebar.png";
import headerImg from "./img/header.png";
import alarmImg from "./img/alarm.png";
import unreadImg from "./img/unread.png";
import monitoringImg from "./img/monitoring.png";
import envImg from "./img/env.png";
import detailWorkerImg from "./img/detail_worker.png";
import detailEquipImg from "./img/detail_equip.png";
import logsImg from "./img/logs.png";
import listImg from "./img/list.png";
import callImg from "./img/call.png";
import editImg from "./img/edit.png";
import addImg from "./img/add.png";
import settingsImg from "./img/settings.png";
import totalReportImg from "./img/total_report.png";
import zoneReportImg from "./img/zone_report.png";

export const manualData = {
    "시작 · Home": {
        content: "Monitory는 공장 환경, 안전, 설비를 한눈에 통합 관리할 수 있는 스마트 팩토리 모니터링 플랫폼입니다.",
        features: [
            {
                title: "로그인",
                img: loginImg,
                description: "사용자는 Monitory에 로그인하여 서비스를 이용할 수 있습니다."
            },
            {
                title: "HOME 화면",
                img: homeImg,
                description: "HOME 화면에서는 요약 리포트와 바로가기 버튼을 확인할 수 있습니다."
            },
            {
                title: "요약 리포트",
                img: miniReportImg,
                description: "지난 30일간의 데이터를 기반으로 환경, 작업자, 설비 관련 총 이상 발생 횟수와 간단한 등급을 보여줍니다."
            },
            {
                title: "바로가기 버튼",
                img: shortcutImg,
                description: "모니토리의 주요 기능인 [실시간 모니터링, 작업자 안전 관리, 설비/센서 관리]로 빠르게 이동할 수 있습니다."
            },
            {
                title: "기타 요소들 - 사이드바",
                img: sidebarImg,
                description: "사이드바에서는 [HOME, 모니터링, 작업자 관리, 설비/센서 관리 월간 리포트] 각 기능으로 이동할 수 있습니다."
            },
            {
                title: "기타 요소들 - 퀵 메뉴",
                img: headerImg,
                description: "퀵 메뉴에서는 홈 화면 바로가기, 로그아웃, 개발자 소개, 사용법 버튼을 제공합니다. [닫기] 버튼을 눌러 접을 수 있고, [퀵 메뉴] 버튼을 눌러 다시 펼칠 수 있습니다."
            },
            {
                title: "실시간 알람 기능",
                img: alarmImg,
                description: "공장에 위험 요인이 발생했을 경우, 알람이 우측 하단에 생성됩니다. 웹페이지 어디에 있든 알람을 제공합니다. 알람은 5초 후 자동으로 사라지며, 알람을 클릭하면 실시간 모니터링 페이지로 이동합니다."
            },
            {
                title: "읽지 않은 알람",
                img: unreadImg,
                description: "실시간 알람을 시간 내에 확인하지 못했을 경우, 읽지 않은 알람 탭에 쌓여 필요할 때 다시 확인할 수 있습니다."
            },
        ],
    },
    "모니터링": {
        content: "모니터링 페이지에서는 실시간으로 공장 내 다양한 구역의 상태와 이상 상황을 모니터링할 수 있습니다.",
        features: [
            {
                title: "실시간 모니터링 - 전체 보기",
                img: monitoringImg,
                description: "공장 내 모든 구역의 상태를 색상과 아이콘을 통해 확인할 수 있습니다. 각 박스를 클릭해 세부 정보 페이지로 이동할 수 있습니다."
            },
            {
                title: "공간 세부 정보 - 환경 리포트",
                img: envImg,
                description: "공장 내 환경 센서의 데이터를 기반으로 실시간 환경 리포트를 제공합니다. 온도, 습도, 가스 농도 등의 정보를 확인할 수 있습니다."
            },
            {
                title: "공간 세부 정보 - 근무자 현황",
                img: detailWorkerImg,
                description: "공장 내 근무자의 위치와 안전 상태를 확인할 수 있습니다. 작업자별로 위험 등급을 표시합니다."
            },
            {
                title: "공간 세부 정보 - 설비 현황",
                img: detailEquipImg,
                description: "Monitory의 설비 수명 예측 모델을 통해 설비의 상태를 예측하고, 설비 수명을 관리할 수 있습니다."
            },
            {
                title: "공간 세부 정보 - 시스템 로그",
                img: logsImg,
                description: "시스템 로그를 통해 공장 내 시스템의 동작 이력을 확인할 수 있습니다."
            },
        ]
    },
    "작업자 관리": {
        content: "작업자 관리 페이지에서는 작업자 정보를 효율적으로 관리하고, 안전 상태를 실시간으로 확인할 수 있습니다.",
        features: [
            {
                title: "작업자 목록 조회",
                img: listImg,
                description: "작업자 목록을 조회하고, 실시간으로 작업자의 상태를 모니터링할 수 있습니다."
            },
            {
                title: "작업자 호출",
                img: callImg,
                description: "작업자를 호출할 수 있는 페이지입니다."
            },
            {
                title: "작업자 정보 수정",
                img: editImg,
                description: "작업자의 정보를 수정할 수 있는 페이지입니다. 작업자의 이름, 전화번호, 출입 권한 등을 수정할 수 있습니다."
            },
            {
                title: "작업자 등록",
                img: addImg,
                description: "새로운 작업자를 등록할 수 있는 페이지입니다."
            },
        ]
    },
    "설비/센서 관리": {
        content: "설비/센서 관리 페이지에서는 공장 내 설비와 센서를 등록·수정하고, 각 구역별 현황을 체계적으로 관리할 수 있습니다.",
        features: [
            {
                title: "설비/센서 관리 페이지",
                img: settingsImg,
                description: "이 페이지에서는 공장 내 구역과 설비의 등록 및 수정이 가능합니다. 또한, 구역, 센서, 설비의 목록을 확인할 수 있습니다."
            },
        ]
    },
    "월간 리포트": {
        content: "월간 리포트 페이지에서는 최근 30일간의 데이터를 기반으로 공장 운영 현황과 이상 발생 통계를 한눈에 확인할 수 있습니다.",
        features: [
            {
                title: "월간 종합 리포트",
                img: totalReportImg,
                description: "지난 30일간의 데이터를 기반으로 월간 종합 리포트를 조회합니다."
            },
            {
                title: "공간별 상세 리포트",
                img: zoneReportImg,
                description: "지난 30일간의 데이터를 기반으로 공간별 상세 리포트를 조회합니다."
            },

        ]
    },
};
