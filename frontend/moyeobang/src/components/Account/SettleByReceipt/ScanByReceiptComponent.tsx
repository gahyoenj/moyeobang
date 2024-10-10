import React, { useEffect } from "react";
import { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { css } from "@emotion/react";
import { colors } from "@/styles/colors";
import { extractItems } from "@/util/receiptExtract";
import FailByReceipt from "./FailByReceipt";
import SettleByReceiptComponent from "./SettleByReceiptComponent";

// const api_url= "/api/custom/v1/34393/8f13443da4a5bb3449e36dac1ddda218c4f02d27884df6cd85905363c5603a72/general"

const layoutStyle = css`
    width:100%;
    height:100%;
    display: flex;
    flex-direction: column;
    gap:30px;
    align-items: center;
`;
// 이안에 로딩창. 이미지 사진, 웹캠 있음. z-index:0
const cameraStyle = css`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index:1;
    position:relative; 
    // 웹캠
    video {
        width:390px;
        height:550px;
        object-fit: cover;
        z-index:1;
    }
    // 찍힌 이미지 이미지위에 로딩선 올라와야함. relative설정.
    img {
        height:600px;
        object-fit: cover;
        position:relative;
        z-index:1;
    }
`;
// webcam위에 네모 영역
const rectangleStyle=css`
    z-index:2;
    background-color:transparent;
    border: solid 3px ${colors.third};
    width:300px;
    height:500px;
    position:absolute;
`;
// loading선 이미지위에 올라오기때문에 absolute설정.
const loadingStyle=css`
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index:3;

    #line{
        position: absolute;
        width: 100%;
        height: 20px;
        // 그라데이션 효과
        background: linear-gradient(
        to bottom,
        ${colors.third} 0%,      
        rgba(255, 255, 255, 0) 100% 
    );
        animation: moveUpDown 3s infinite ease-in-out;     
    }
    
    @keyframes moveUpDown {
    0% {
      top: 0;
    }
    50% {
      top: calc(100% - 20px);
    }
    100% {
      top: 0;
    }
  }
`;

const buttonStyle = css`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: solid 5px ${colors.third};
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    button {
        width: 60px;
        height: 60px;
        background-color: ${colors.third};
        border: solid 0px transparent;
        border-radius: 50%;
    }
`;

type ScanByReceiptComponentProps = DefaultCompleteTransaction & {isUpdate:boolean}

export default function ScanByReceiptComponent({transactionId, money, paymentName, address, createdAt, acceptedNumber, isUpdate} : ScanByReceiptComponentProps) {

    const webcamRef = useRef<Webcam>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [results, setResults] = useState<TransactionDetailByReceipt>();
    const [openResultModal, setOpenResultModal] = useState<boolean>(false);

    // Base64 데이터를 Blob 파일로 변환
    const base64ToFile = (base64Data: string, filename: string) => {
        const byteString = atob(base64Data.split(",")[1]);
        const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new File([ab], filename, { type: mimeString });
    };

    function handleCapture() {
        try {
            const imageSrc = webcamRef.current?.getScreenshot();
            if (imageSrc) {
                const imageFile = base64ToFile(imageSrc, 'receipt.jpeg')
                setImageSrc(imageSrc)
                sendToOCR(imageFile);
            }
        } catch {
            setError('카메라 사용이 허용되지 않았습니다.');
        }
    };


    async function sendToOCR(imageFile : File) {

        const formData = new FormData()
        const requestJson = {
            version: "V2",
            requestId: uuidv4(), // 고유한 문자열 변환!
            timestamp: new Date().getTime(),
            // lang: "ko",
            images: [
                {
                    format:"jpeg",
                    name:"receipt.jpg"
                }
            ],
        };

        formData.append("message", JSON.stringify(requestJson));
        formData.append("file", imageFile)

        setIsLoading(true); // 영수증 인식 시작!

        // axios.post(url, data, config) config: 헤더 정보
        // NAVER CLOVA API 요청s
        try {
            const response = await axios.post(import.meta.env.VITE_OCRURL, formData, {
                headers: {
                    'X-OCR-SECRET': import.meta.env.VITE_OCR_API_KEY,
                    "Content-Type": "multipart/form-data",
                }
            });

            // console.log(response.data.images[0].inferResult) // 영수증 이미지 인식 결과 'SUCCESS | FAILURE | ERROR"
            if (response.data.images[0].inferResult==='SUCCESS') {
                
                // console.log('subResults : ', response.data.images[0].receipt.result.subResults[0].items)
    
                // 영수증 아이쳄 리스트 추출
                const itemData : OcrItem[] = response.data.images[0].receipt.result.subResults[0].items.map((item:OcrApiItem) => {
                    return {name : (item.name ? item.name.text : '상품명을 입력해주세요'), count : Number(item.count ? item.count.text: 1), price: Number(item.price ? item.price.price.formatted.value : 0)}
                })
    
                // extractItems를 통해 데이터 변환
                if (itemData) {
                    const results = extractItems(itemData, transactionId, createdAt, money, paymentName, address, acceptedNumber);
                    setResults(results);
                    setIsLoading(false);
                    setOpenResultModal(true);
                }
            } else {
                setError('영수증 인식 오류 발생')
            }

        } catch (error) {
            // console.log(error)
            setError('영수증 인식 오류 발생')
        }
    }


    function handleFailClose() {
        setError('');
        setImageSrc(null);
    }

    function handleClose() {
        setOpenResultModal(false);
        setImageSrc('');
    }

    useEffect(() => {
        // console.log('isLoading:', isLoading);
    }, [isLoading]);

    return (
        <div css={layoutStyle}>
           {results && openResultModal ? (
            <SettleByReceiptComponent data={results} onClose={handleClose} isUpdate={isUpdate} />
        ) : (
            <>
                <div css={cameraStyle}>
                    {imageSrc ? (
                        <>
                            <img src={imageSrc} alt="capture_img" />
                            {isLoading && (
                                <div css={loadingStyle}>
                                    <div id='line' />
                                </div> 
                            )}
                        </>
                    ) : (
                        <>
                        <Webcam 
                        ref={webcamRef} 
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "environment" }} // 모바일 후면 카메라 사용
                        />
                        <div css={rectangleStyle} />
                        </>
                    )}
                </div>
                <div css={buttonStyle}>
                    <button onClick={handleCapture}/>
                </div>
            </>
        )}
        {error && <FailByReceipt onClose={handleFailClose} transactionId={transactionId}/>}
        </div>
    )
}