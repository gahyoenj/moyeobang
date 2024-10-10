import React from 'react';
import { createFileRoute,useRouter } from '@tanstack/react-router'
import HeaderWithXButton from '@/components/common/Header/HeaderWithXbutton'
import { css } from '@emotion/react'
import TwoBtn from '@/components/common/btn/TwoBtn';
import { useState } from 'react';
import SettleByCustomComponent from '@/components/Account/SettleByCustom/SettleByCustomComponent';
import ScanByReceiptComponent from '@/components/Account/SettleByReceipt/ScanByReceiptComponent';
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import moyeobang from '@/services/moyeobang';
import useTravelDetailStore from '@/store/useTravelDetailStore';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const Route = createFileRoute('/_layout/_protected/_layout/account/$transactionId/settle/')({
  component: Settle
})  

const layoutStyle = css`
  width:100%;
  height:100%;
  margin-top:50px;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
  gap: 20px;
`;

// 정산페이지 (영수증인지 직접 입력인지)
export default function Settle() {

  const {transactionId} : {transactionId:TransactionId} = Route.useParams(); 
  const {history} = useRouter()
  const {method, isUpdate} :{method:SplitMethod, isUpdate:boolean} = Route.useSearch();
  // method==='receipt' 이고 'true'이면
  // console.log('isUpdate', isUpdate)
  const {accountId} = useTravelDetailStore();
  const { travelId}= useTravelDetailStore();
  const {participantsInfo} = useTravelDetailStore();
  const queryClient = useQueryClient();
  
  const [activeComponent, setActiveComponent] = useState<'left' | 'right'>(
    method === 'custom' ? 'right' : 'left'
    );
  
  
  // 정산 내역 상세 조회 get API
  const {data} = useSuspenseQuery({
  queryKey: ['transactionDetail', accountId, transactionId],
  queryFn: () => moyeobang.getTransactionDetail(accountId, Number(transactionId)),
  });

  const transactionDetailData = data.data.data;

    // 언마운트 => default 정산하기(직접 정산 API)
  const {mutate: settleByDefault } = useMutation({
      mutationFn: ({transactionId, travelId, data} : {transactionId: TransactionId, travelId:Id, data: PostTransactionDetailByCustom}) => moyeobang.postSettleByCustom(transactionId, travelId, data),
      onSuccess: async () => {
      await queryClient.invalidateQueries({
          queryKey: ['transactionList', accountId], // 해당 계좌의 전체내역 업데이트
          refetchType: 'all',
      });
      }

      });

  function createDefaultSettleData() {
      const info = participantsInfo.map((member) => (
          {
              // money = 전체금액/맴버수 내림값
              memberId:member.memberId, 
              money: Math.floor(transactionDetailData.money/participantsInfo.length)
          }
      ))

      return {
          paymentName : transactionDetailData.paymentName,
          money : transactionDetailData.money,
          info : info,
          splitMethod:'custom',
          acceptedNumber:transactionDetailData.acceptedNumber,
      };
  };


  function handleLeft() {
    setActiveComponent('left')
  }
  
  function handleRight() {
    setActiveComponent('right')
  }
  
  function handleXClick() {
    history.back()
  }

  // 타입 가드 함수
  function isSettledParticipantByCustom(
    details: SettledItemByReceipt[] | SettledParticipantByCustom[]
  ): details is SettledParticipantByCustom[] {
    // console.log(details)
    return Array.isArray(details) && details.length > 0 && (details as SettledParticipantByCustom[])[0].participant!== undefined;
  }

  useEffect(() => {

    return () => {
      // 언마운트 될 떄 정산이 되지 않았다면
      if (transactionDetailData.details.length===0) {
        const sendData = createDefaultSettleData();
        settleByDefault({transactionId:transactionId, travelId:travelId, data:sendData});
      }
    }
  }, [])

  return (
      <>
        <HeaderWithXButton onXClick={handleXClick}/> 
        <div css={layoutStyle}>
          <TwoBtn 
            leftText='영수증 인식'
            rightText='직접 입력'
            onLeftClick={handleLeft}
            onRightClick={handleRight}
            defaultActive={activeComponent}
          />
          { activeComponent === 'left' && 
            <ScanByReceiptComponent 
              transactionId={Number(transactionId)}
              money={transactionDetailData.money}
              address={transactionDetailData.address}
              paymentName={transactionDetailData.paymentName}
              createdAt={transactionDetailData.createdAt}
              acceptedNumber={transactionDetailData.acceptedNumber}
              isUpdate={isUpdate} // true 수정 | false 새로 생성
            />
          }
          { activeComponent === 'right' &&
            <SettleByCustomComponent
              transactionId={Number(transactionId)}
              paymentName={transactionDetailData.paymentName}
              createdAt={transactionDetailData.createdAt}
              totalMoney={transactionDetailData.money}
              details={isSettledParticipantByCustom(transactionDetailData.details) ? transactionDetailData.details : []} 
              acceptedNumber={transactionDetailData.acceptedNumber}
              isUpdate={isUpdate} // true 수정 | false 새로 생성
              fromUpdateReceipt={method==='receipt'&&isUpdate}
            />
          }
        </div>
      </>
    )
}