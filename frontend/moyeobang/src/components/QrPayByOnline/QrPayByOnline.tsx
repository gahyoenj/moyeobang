import React, { useRef } from "react";
import Backdrop from "../Account/FinalModal/Backdrop/Backdrop";
import QRCode from "react-qr-code";
import { css } from "@emotion/react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { colors } from "@/styles/colors";
import { useState } from "react";
import { useEffect } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { getCookie } from "@/util/cookie";

const qrContainerStyle=css`
    border-radius:5px;
    background-color: ${colors.white};
    display:flex;
    flex-direction:column;
    align-items:center;
    width: 400px;
    height:500px;
    padding: 30px 10px;
    span {
        font-family: 'english';
        font-size: 46px;
        padding: 2px;
    }
`;

const qrStyle = css`
    box-sizing:border-box;
    width:300px;
    height:300px;
    border-radius:10px;
    padding: 15px;
    border:solid 4px ${colors.third};
`;

const titleStyle=css`
    padding:10px;
    font-size:40px;
    font-family:'semibold';
`;

const contentStyle=css`
    padding: 20px 0;
    font-size:20px;
`;

const amountStyle=css`
    padding: 20px 0;
    font-size:24px;
`;


interface QrPayByOnlineProps {
    onClickOutside: VoidFunction;
    qrData:OnlineQrData;
}


export default function QrPayByOnline({qrData, onClickOutside} : QrPayByOnlineProps) {

    // console.log('QR 데이터 확인', qrData)

    const modalRef = useRef<HTMLDivElement>(null)
    useOnClickOutside(modalRef, onClickOutside)

    const [eventSource, setEventSource] = useState<EventSourcePolyfill | null>(null);
    const token = getCookie('accessToken');

    const fetchSEE = () => {
        const eventSource = new EventSourcePolyfill(import.meta.env.VITE_BASEURL+`/pg/payment/connect?paymentRequestId=${qrData.paymentRequestId}`, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        })

        // EventSource.readyState()
        eventSource.onopen = () => {
            // console.log('aiport sse open')
        }

        eventSource.addEventListener('connect', (event) => {

            const messageEvent = event as MessageEvent<string>;
            const connectMessage : ConnectMessage = messageEvent.data;
            // console.log('connect:', connectMessage);
        });

        eventSource.addEventListener('payment-success', (event) => {

            const messageEvent = event as MessageEvent<string>;
            const parsedData = JSON.parse(messageEvent.data);
            // console.log('payment-succes:', parsedData);
        });

        eventSource.onerror = (event) => {
            
        eventSource.close();
            if (event) {
                // console.log('sse요청 error발생', event)
            }

            if (event.target.readyState === EventSource.CLOSED) {
                // console.log('see연결 종료')
            }
        };

        // eventSource 상태에 저장
        setEventSource(eventSource);
    }

    useEffect(() => {
        fetchSEE();

        // 컴포넌트 언마운트 시 SSE 연결 종료
        return () => {
            if (eventSource) {
                eventSource.close(); // 언마운트시 종료
                // console.log('sse 연결 종료')
            }
        };
    }, []);

    return (
        <Backdrop>
            <div ref={modalRef} css={qrContainerStyle}>
                <div css={titleStyle}><span>QR</span>결제</div>
                <QRCode value={JSON.stringify(qrData)} css={qrStyle} />
                <div css={contentStyle}>카메라를 통해 <span>QR</span>을 스캔해주세요</div>
                <div css={amountStyle}>결제 금액 : {qrData.amount.toLocaleString()}원</div>
            </div>
        </Backdrop>
    )
}