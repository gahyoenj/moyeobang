import React, { useRef } from "react";
import Backdrop from "../Account/FinalModal/Backdrop/Backdrop";
import { css } from "@emotion/react";
import { colors } from "@/styles/colors";
import Btn from "../common/btn/Btn";
import type {HTMLAttributes, PropsWithChildren} from "react";
import { useMutation } from "@tanstack/react-query";
import moyeobang from "@/services/moyeobang";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { AxiosError } from "axios";

const containerLayoutStyle=css`
    position:absolute;
    bottom:0;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;

    width: 100%;
    height: 700px;
    background-color:${colors.white};
    display:flex;
    flex-direction:column;
    justify-content:center;

    p {
        text-align:start;
    }

    div {
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        box-sizing:border-box;
    }
`;

type ResultByPos = PaymentProps & PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
    onClickOutside: VoidFunction;
    setIsSuccess:(isSuccess:boolean)=>void;
}

export default function ResultByPos({
    paymentRequestId,
    sourceAccountNumber,
    placeId,
    placeName,
    placeAddress,
    latitude,
    longitude,
    amount,
    targetAccountNumber,
    tag,
    onClickOutside,
    setIsSuccess,
    }:ResultByPos) {

    const modalRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(modalRef, onClickOutside);


    const {mutate: postPayment } = useMutation({
    mutationFn: ({data} : {data: PaymentProps}) => moyeobang.postPayByPos(data),
    onSuccess: async () => {
        // console.log('결제 성공!')
        setIsSuccess(true);
        onClickOutside();
    },
    onError: async (error:AxiosError )=> {

        if (error.response?.data) {
        const errorMessage = (error.response.data as { error: string }).error;
        // console.log(errorMessage); // 'Payment failed.'
        if (errorMessage==='Payment failed.') {
            setIsSuccess(false)
        }
        }
        // console.log('결제 실패')
    }
  });
    
    function handleSettle() {
        // console.log('결제 요청 중')
        // api결제 요청
        const payData : PaymentProps = {
            paymentRequestId : paymentRequestId,
            sourceAccountNumber : sourceAccountNumber,
            placeId : placeId,
            placeName : placeName,
            placeAddress : placeAddress,
            amount:amount,
            latitude : latitude,
            longitude : longitude,
            targetAccountNumber : targetAccountNumber,
            tag:tag
        }
        postPayment({data : payData})
    }

    return (
        <Backdrop>
            <div ref={modalRef} css={containerLayoutStyle}>
                <p>결제 uuid : {paymentRequestId}</p>
                <p>모임통장 계좌번호 : {sourceAccountNumber}</p>
                <p>가맹점 id : {placeId}</p>
                <p>가맹정 이름 : {placeName}</p>
                <p>가맹점 주소 : {placeAddress}</p>
                <p>워도 : {latitude}</p>
                <p>경도 : {longitude}</p>
                <p>가맹점 계좌번호 : {targetAccountNumber}</p>
                <p>카데고리 태그: {tag}</p>
                <div>
                    <Btn buttonStyle={{style:'blue', size:'big'}} onClick={handleSettle}>결제 하기</Btn>
                </div>
            </div>
        </Backdrop>
    )
}