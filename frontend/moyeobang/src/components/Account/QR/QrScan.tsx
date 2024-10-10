import React, { useRef, useEffect, useState } from "react"
import QrScanner from "qr-scanner"
import { css } from "@emotion/react"
import { colors } from "@/styles/colors";
import { useMutation } from "@tanstack/react-query";
import moyeobang from "@/services/moyeobang";
import { AxiosError } from "axios";

const storeData = [
    {
        placeId: 'airport-1',
        placeName : '모여방윙스',
        placeAddress: '제주시 특별자치도, 공항로 2 제주국제공항',
        latitude: 33.5070772,
        longitude: 126.4934311,
        targetAccountNumber: '0018418012115489',
        tag:'AIRPLANE'
    },
    {
        placeId: 'hotel-1',
        placeName : '호텔모여방',
        placeAddress: '제주특별자치도 제주시 특별자치도, 애월읍 하귀동남3길',
        latitude: 33.5042779,
        longitude: 126.519838,
        targetAccountNumber: '0018418012115489',
        tag:'ACCOMMODATION'
    }
]

const qrReaderLayoutStyle = css`
    padding-top: 30px;
    width: 100%;
    height: 100%;
    display:flex;
    flex-direction:column;
    position : relative; 
    video { 
    width : 100% ; 
    height : 550px; 
    object-fit : cover; 
    } 
`;

const qrBoxStyle = css`
    width : 300px !important; 
    height: 300px !important; 
    border: 3px solid ${colors.third};
    border-radius: 15px;
    position: absolute;
    top: 25%;
    left: 12% !important;
    z-index:99;
`;

const smallTextStyle = css`
    font-family: 'regular';
    font-size:16px;
`;

const bigTextStyle = css`
    font-family: 'semibold';
    font-size:24px;
    span {
        font-family: 'english';
        font-size:28px;
    }
`;

const textBoxStyle= css`
    display:flex;
    flex-direction:column;
    margin-top:30px;
    justify-content:center;
    align-items:center;
    gap:20px;
`;

interface QrScanProps {
    onMessage: (trasactionId:TransactionId) => void;
    onError: (errorMessage:string) => void;
    restart:boolean
    accountNumber:SourceAccountNumber;
}

export default function QrScan({onMessage, onError, restart, accountNumber}:QrScanProps) {
    
    const scanner = useRef<QrScanner>();
    const videoElement = useRef<HTMLVideoElement>(null);
    const qrBoxElement = useRef<HTMLDivElement>(null);
    const [qrOn, setQrOn] = useState<boolean>(true);

    const {mutate: postPaymentByOnline } = useMutation({
        mutationFn: ({data} : {data: PaymentProps}) => moyeobang.postPayByOnline(data),
        onSuccess: async (response) => {
            onMessage(Number(response.data.data.transactionId))
            // console.log('온라인 결제 성공!')
        },
        onError: (error) => {
            if (error instanceof AxiosError) {

                onError(error.response?.data?.error?.message)
            } else {
                onError('온라인 결제 실패')
            }
        }
    });

    // 성공
    function onScanSuccuess( result : QrScanner.ScanResult ) {  

        try {
            if (result.data) {
                const data = JSON.parse(result.data);
                
                const stores = storeData.filter((store) => store.placeId === data.placeId)
                const payData : PaymentProps = { 
                    ...stores[0],
                    ...data,
                    sourceAccountNumber: accountNumber
                }
                // console.log('post요청 결제 데이터:', payData)

                // 결제 데이터 API 요청!
                postPaymentByOnline({data:payData})
                // 성공적으로 스캔한 후 스캐너 중지
                scanner?.current?.stop();
            }
            
        } catch (error) {
            console.log('QR스캔 오류 발생', error)
            onError('QR스캔 오류 발생');
        }
    }

    function onScanFail() {
        // QR인식중
    }

    useEffect(()=>{

        const initScanner = () => {
            if (videoElement.current) {
                
                scanner.current = new QrScanner( 
                    videoElement?.current,
                    onScanSuccuess,
                    {
                        onDecodeError : onScanFail,
                        preferredCamera : "environment", // 후면지향
                        maxScansPerSecond:3, // 1초당 3번
                        highlightScanRegion : true, // ? 알아보기
                        // highlightCodeOutline : true, // QR주변 윤곽선 생성
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
                        onError('QR 스캔 실패')
                        setQrOn(false);
                    }
                });
            }
        }

        initScanner();
        
        // 언마운트시
        return () => {
            if (scanner.current) {
                
                scanner.current.destroy(); //스캐너 완전히 해제
            }
        }
    }, [restart])

    // 브라우저에 카메라가 허용되지 않은 경우
    useEffect(()=> {
        if (!qrOn) {
            alert("카메라가 차단되었거나 접근할 수 없습니다.")
        }
    }, [qrOn])

    return (
        <div css={qrReaderLayoutStyle}>
                <video ref={videoElement} ></video>
                <div css={qrBoxStyle} ref={qrBoxElement}/>
                <div css={textBoxStyle}>
                    <div css={smallTextStyle}>오프라인 결제 • 해외결제 • 싸피페이</div>
                    <div css={bigTextStyle}><span>QR</span>코드를 스캔하세요</div>
                </div>
        </div>
    ) 
}     