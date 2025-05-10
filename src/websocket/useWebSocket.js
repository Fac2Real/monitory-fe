import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
// 웹소켓 연결과 관련한 hook 함수
// topic: STOMP채널의 주소
// onMessage: 서버로부터 메시지를 받았을 때 실행할 콜백 함수
export default function useWebSocket(topic, onMessage) {
    const clientRef = useRef(); // 웹소켓 연결 객체 저장할 변수
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");

        // STOMP 클라이언트 생성
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // 5초 간격으로 재연결 시도

            // onConnect: 연결 성공 시 호출할 함수
            onConnect: () => {
                console.log("웹소켓 연결 성공");
                // topic으로부터 메시지를 구독하고, 메시지를 받으면 JSON으로 파싱해서 콜백함수로 전달합니다.
                client.subscribe(topic, (message) => {
                    const payload = JSON.parse(message.body);
                    onMessage(payload);
                    console.log(payload);
                })
            },
            onStompError: (frame) => {
                console.log("STOMP 에러=================");
                console.log(frame);
                console.log("===========================");
            }
        });
        client.activate();
        clientRef.current = client;

        return () => {
            clientRef.current?.deactivate();
        };
    }, [topic, onMessage])
}

export function useWebSocket2(topic, onMessage) {
    const clientRef = useRef(); // 웹소켓 연결 객체 저장할 변수
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");

        // STOMP 클라이언트 생성
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // 5초 간격으로 재연결 시도

            // onConnect: 연결 성공 시 호출할 함수
            onConnect: () => {
                console.log("웹소켓 연결 성공");
                // topic으로부터 메시지를 구독하고, 메시지를 받으면 JSON으로 파싱해서 콜백함수로 전달합니다.
                client.subscribe(topic, (message) => {
                    const payload = JSON.parse(message.body);
                    onMessage(payload);
                    console.log(payload);
                })
            },
            onStompError: (frame) => {
                console.log("STOMP 에러=================");
                console.log(frame);
                console.log("===========================");
            }
        });
        client.activate();
        clientRef.current = client;

        return () => {
            clientRef.current?.deactivate();
        };
    }, [topic, onMessage])
}
export function useWebSocket3(topic, onMessage) {
    const clientRef = useRef(); // 웹소켓 연결 객체 저장할 변수
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");

        // STOMP 클라이언트 생성
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // 5초 간격으로 재연결 시도

            // onConnect: 연결 성공 시 호출할 함수
            onConnect: () => {
                console.log("웹소켓 연결 성공");
                // topic으로부터 메시지를 구독하고, 메시지를 받으면 JSON으로 파싱해서 콜백함수로 전달합니다.
                client.subscribe(topic, (message) => {
                    const payload = JSON.parse(message.body);
                    onMessage(payload);
                    console.log(payload);
                })
            },
            onStompError: (frame) => {
                console.log("STOMP 에러=================");
                console.log(frame);
                console.log("===========================");
            }
        });
        client.activate();
        clientRef.current = client;

        return () => {
            clientRef.current?.deactivate();
        };
    }, [topic, onMessage])
}