import { createFileRoute } from '@tanstack/react-router';
import React, { useState } from 'react';
import { css } from '@emotion/react';
import Btn from '@/components/common/btn/Btn';
import QrScanByPos from '@/components/QrByPos/QrScanByPos';
import ResultByPos from '@/components/QrByPos/ResultByPos';
import SuccessModalByPos from '@/components/QrByPos/SuccessModalByPos';
import FailModalByPos from '@/components/QrByPos/FailModalByPos';

const starbucks: PosPay = {
    placeId : 'starbucks-12',
    placeName: '스타벅스 제주중문점',
    placeAddress: '제주 서귀포시 중문관광로110번길 32 (색달동)',
    amount: 25000,
    latitude:33.251224,
    longitude:126.4128286,
    targetAccountNumber: '0018418012115489',
    tag:'CAFE'
  }

const kurosiro: PosPay = {
    placeId : 'ramen-186',
    placeName: '자매국수',
    placeAddress: '제주 제주시 항골남길 46 자매국수',
    amount: 20000,
    latitude:33.4985643,
    longitude:126.458788,
    targetAccountNumber: '0018418012115489',
    tag:'RESTAURANT'
  }

const abebeBakery: PosPay = {
    placeId : 'bakery-12',
    placeName: '아베베베이커리',
    placeAddress: '제주 제주시 동문로6길 4 동문시장 12번 게이트 옆',
    amount: 34000,
    latitude: 33.512635,
    longitude: 126.5288514,
    targetAccountNumber: '0018418012115489',
    tag:'CAFE'
  }

const art: PosPay = {
    placeId : 'art-112',
    placeName: '도토리캐리커쳐 제주점',
    placeAddress: '제주 제주시 애월읍 애월로 11 1동 1층',
    amount: 40000,
    latitude:33.5042779,
    longitude:126.519838,
    targetAccountNumber: '0018418012115489',
    tag:'ETC'
  }

const circus: PosPay = {
    placeId : 'circus-12',
    placeName: '제주아트서커스',
    placeAddress: '제주 서귀포시 안덕면 동광로 214',
    amount: 44000,
    latitude: 33.3143407,
    longitude: 126.3447396,
    targetAccountNumber: '0018418012115489',
    tag:'ACTIVITY'
  }

const garden: PosPay = {
    placeId : 'garden-10',
    placeName: '카멜리아 힐',
    placeAddress: '제주 서귀포시 안덕면 병악로 166',
    amount: 50000,
    latitude:33.2898049,
    longitude:126.3682983,
    targetAccountNumber: '0018418012115489',
    tag:'ACTIVITY'
  }

const shop: PosPay = {
    placeId : 'shop-10',
    placeName: '제주소품샵 올망',
    placeAddress: '제주 제주시 애월읍 어도봉남길 27 제주소품샵 올망',
    amount: 42000,
    latitude:33.4160325,
    longitude:126.3028545,
    targetAccountNumber: '0018418012115489',
    tag:'SHOPPING'
  }

const bar: PosPay = {
    placeId : 'bar-10',
    placeName: '갓포횻',
    placeAddress: '제주 제주시 원노형10길 38 1층',
    amount: 54500,
    latitude:33.4827591,
    longitude: 126.4863695,
    targetAccountNumber: '0018418012115489',
    tag:'RESTAURANT'
  }

export const Route = createFileRoute('/pos/')({
  component: Pos,
})

const layoutStyle = css`
  width: 100%;
  height: 100%;
  box-sizing:border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding-bottom:30px;

  input {
    width: 300px;
    height: 30px;
    border-radius: 15px;
    font-size: 16px;
    padding: 0 15px;
  }

  div {
    padding: 10px;
  }

  p {
    padding: 10px;
  }
`;

const storeLayoutStyle=css`
  display:flex;
  flex-direction:column;
  gap:10px;
`;

// uuid(paymentRequestId), paymentName, address, money 필요
export default function Pos() {

  // 가맹점 계좌번호 고정!
  // const targetAccountNumber = '0012280102000441'
  // 신규 const targetAccountNumber '0018418012115489'

  const [isOpenQrModal, setIsOpenQrModal] = useState<boolean>(false)
  const [ openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);
  const [data, setData] = useState<PosPay>() // requestId, 결제자 계좌 아이디 없는 data 즉 결제기 데이터
  const [isOpenResultModal, setIsOpenResultModal] = useState<boolean>(false);
  const [openFailModal, setOpenFailModal] = useState<boolean>(false);
  const [resultData, setResultData] = useState<PaymentProps>(); // 결제 최종 데이터 


  function handleQrClose() {
    setIsOpenQrModal(false);
  }

  function handleResult(data:PaymentProps) {
    setResultData(data); // 결제 최종 데이터 받아오기
    setIsOpenResultModal(true)

    // 결제 api
  }

  function handleOnClickOutside() {
    setIsOpenResultModal(false);
  }
  
  function handleOpen(data:PosPay) {
    setData(data)
  }

  function handleSettle() {
    setIsOpenQrModal(true)
  }

  function handleSuccess(isSuccess:boolean) {
    if (isSuccess) {
      setOpenSuccessModal(true);
    } else {
      setOpenFailModal(true)
    }
  }

  function handleCloseSuccessModal() {
    setOpenSuccessModal(false);
  }

  function handleCloseFailModal() {
    setOpenFailModal(false);
  }

  return (
    <div css={layoutStyle}>
      {openSuccessModal && <SuccessModalByPos onClickOutside={handleCloseSuccessModal} />}
      {isOpenQrModal && data && <QrScanByPos onClose={handleQrClose} paymentData={data} onResult={handleResult}/> }
      {isOpenResultModal && resultData && <ResultByPos {...resultData} onClickOutside={handleOnClickOutside} setIsSuccess={handleSuccess}/>}
      {openFailModal && <FailModalByPos onClickOutside={handleCloseFailModal} />}
      { !isOpenQrModal && !isOpenResultModal &&
        <>
        <div css={storeLayoutStyle}>
          <Btn buttonStyle={{size:'big', style:'red'}} onClick={() => handleOpen(starbucks)}>스타벅스 제주중문점</Btn>
          <Btn buttonStyle={{size:'big', style:'red'}} onClick={() => handleOpen(kurosiro)}>자매국수</Btn>
          <Btn buttonStyle={{size:'big', style:'red'}} onClick={() => handleOpen(abebeBakery)}>아베베베이커리</Btn>
          <Btn buttonStyle={{size:'big', style:'red'}} onClick={() => handleOpen(bar)}>갓포효</Btn>
          <Btn buttonStyle={{size:'big', style:'red'}} onClick={() => handleOpen(art)}>도토리캐리커쳐 제주점</Btn>
          <Btn buttonStyle={{size:'big', style:'red'}} onClick={() => handleOpen(circus)}>제주 아트 서커스</Btn>
          <Btn buttonStyle={{size:'big', style:'red'}} onClick={() => handleOpen(garden)}>카멜리아 힐</Btn>
          <Btn buttonStyle={{size:'big', style:'red'}} onClick={() => handleOpen(shop)}>제주소품샵 올망</Btn>
        </div>
          <Btn
            buttonStyle={{ size: 'big', style: 'blue' }}
            onClick={handleSettle}
          >
            결제하기
          </Btn>
          <div>
            {data ? 
            <>
            <div>amount(결제금액) : {data.amount}</div>
            <div>placeId(장소Id) : {data.placeId}</div>
            <div>placeName(장소명) : {data.placeName}</div>
            <div>placeAddress(주소) : {data.placeAddress}</div>
            <div>latitude(위도) : {data.latitude}</div>
            <div>longitude(경도) : {data.longitude}</div>
            <div>targetAccountNumber(가맹점 계좌번호) : {data.targetAccountNumber}</div>
            <div>tag(카테고리 이름) : {data.tag}</div>
            </> : 
            undefined
          }
          </div>
        </>
      }
    </div>
  )
}
