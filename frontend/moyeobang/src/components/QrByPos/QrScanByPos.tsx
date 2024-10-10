import React, { useRef, useEffect, useState } from "react"
import QrScanner from "qr-scanner"
import { css } from "@emotion/react"
import { colors } from "@/styles/colors";
// import ResultByPos from "./ResultByPos";
import HeaderWithXButton from "../common/Header/HeaderWithXbutton";

const qrReaderLayoutStyle = css`
    width: 100%;
    height: 100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    background-color:${colors.white};

    /* position : absolute; */
    z-index:9999;
    top:0;
    left:0;
    video { 
    width : 100% ; 
    height : 600px; 
    object-fit : cover; 
    } 
`;

const qrBoxStyle = css`
    width : 300px !important; 
    height: 300px !important; 
    border: 2px solid ${colors.third};
    border-radius: 15px;
    position: absolute;
    top: 25%;
    left: 9% !important;
`;

const resultStyle = css`
  font-family:'semibold';
  text-align: center;
  font-size: 20px;
`;

const bigText = css`
    font-family: 'semibold';
    font-size:24px;
`;

const english = css`
    font-family: 'english';
    font-size:32px;
`;

const textBoxStyle= css`
    display:flex;
    flex-direction:column;
    margin-top:30px;
    justify-content:center;
    align-items:center;
    gap:20px;
`;

interface QrScanByPosProps {
    onClose : () => void;
    paymentData : PosPay;
    onResult: (resultData:PaymentProps) => void;
}

export default function QrScanByPos({onClose, paymentData, onResult } : QrScanByPosProps) {
    
    const scanner = useRef<QrScanner>();
    const videoElement = useRef<HTMLVideoElement>(null);
    const qrBoxElement = useRef<HTMLDivElement>(null);
    const [qrOn, setQrOn] = useState<boolean>(true);

    // 결과 
    const [scannedResult, setScannedResult] = useState<QrData | null>();

    // 성공
    function onScanSuccuess( result : QrScanner.ScanResult ) {

        try {
            const data = JSON.parse(result.data);
            setScannedResult(data);
            // console.log('파싱된 QR 데이터', data)

            // 결제 데이터 합치기
            const payData : PaymentProps= {...data, ...paymentData}

            if (payData) {
                onResult(payData); // 상위로 데이터 보내기
                onClose() // QR스캔 닫기
            }

        } catch (error) {
            // console.log(error)
        }
        // 받은 계좌, uuid정보 ! data넣어서 백에 보내기!!
    }

    function onScanFail(error: string | Error) {
        // console.log(error)
    }

    useEffect(()=>{
        if ( videoElement?.current && !scanner.current ) {
            scanner.current = new QrScanner( 
                videoElement?.current,
                onScanSuccuess,
                {
                    onDecodeError : onScanFail,
                    preferredCamera : "environment", // 후면지향
                    maxScansPerSecond:2, // 1초당 2번
                    highlightScanRegion : true, // ? 알아보기
                    highlightCodeOutline : true, // QR주변 윤곽선 생성
                    overlay : qrBoxElement?.current || undefined,
                }
            );

            //QR스캐너 시작
            scanner?.current?.start()
            .then(() => 
                setQrOn(true)
            )
            .catch((error : Error) => {
                if (error) {
                    setQrOn(false);
                }
            });
        }

        // 언마운트시
        return () => {
            if (!videoElement.current) {
                scanner?.current?.stop();
            }
        }

    }, [])

    // 브라우저에 카메라가 허용되지 않은 경우
    useEffect(()=> {
        if ( !qrOn) {
            alert("카메라가 차단되었거나 접근할 수 없습니다.")
        }
    }, [qrOn])

    return (
        <div css={qrReaderLayoutStyle}>
            <HeaderWithXButton onXClick={onClose}/>
            { !scannedResult && 
                <>
                <video ref={videoElement} ></video>
                <div 
                css={qrBoxStyle}
                ref={qrBoxElement}>
                </div>
                <div css={textBoxStyle}>
                <div css={bigText}><span css={english}>QR</span>코드를 스캔하세요</div>
                </div>
                </>
            }
        </div>
    ) 
}     