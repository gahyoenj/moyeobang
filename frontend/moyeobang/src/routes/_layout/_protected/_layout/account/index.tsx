import React, { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { css } from '@emotion/react'
import { useState } from "react";
import Navbar from "@/components/common/navBar/Navbar";
import ProfileImage from "@/components/Account/ProfileImage/ProfileImage";
import AllImage from "@/components/Account/ProfileImage/AllImage";
import AccountCard from '@/components/Account/AccountCard/AccountCard';
import TransactionCard from '@/components/Account/TranSaction/TransactionCard';
import { profileData, transactions } from "@/data/data";
import moyeobang from '@/services/moyeobang';
import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
import HorizonBarGraph from '@/components/Account/Chart/HorizonBarGraph';
import ChartCard from '@/components/Account/Chart/ChartCard';

export const Route = createFileRoute('/_layout/_protected/_layout/account/')({
  component: groupAccount
})

const layoutStyle = css`
    max-width: 100%;
    margin-top: 50px;

    display: flex;
    flex-direction: column;
    height:100%;

`;

const profileListStyle = css`
    display: flex;
    flex-direction: row;
    padding: 15px;
    gap: 15px;

    overflow-x: auto;

    &::-webkit-scrollbar {
    display: none;
    }
`;

const accountCardStyle = css`
    max-width: 100%;
    display:flex;
    justify-content: center;
    padding: 20px;
`;

const transactionListStyle = css`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;

  max-height: 400px; 
  overflow-y: auto; 
  width: 100%;

  &::-webkit-scrollbar {
    display: none; 
  }
`
const accountId = 1;
export default function groupAccount() {

  const allList = profileData.map((member) => member.memberId)
  type SelectedMember = MemberId[]; 
  const [ selectedMember , setSelectedMember ] = useState<SelectedMember>(allList) // default 전체임

  // TODO 주석제거
  // **
  const {data : transactionData} = useSuspenseQuery({
    queryKey: ['transactionList', accountId, selectedMember ],
    queryFn: () => moyeobang.getTransactionList(Number(accountId), selectedMember),
  });

  // get 모임 통장 전체 잔액 
  const { data :accountDataByGroup } = useQuery({
    queryKey: ['accoutByGroup', accountId],
    queryFn: () => moyeobang.getAccountState(accountId),
    enabled: selectedMember.length>1 // 전체
  });

  //get 모임 통장 개인별 잔액
  const { data : accountDataByMember } = useQuery({
    queryKey: ['accountByMemberId', accountId, selectedMember],
    queryFn: () => {
      if (!Array.isArray(selectedMember)) {
        return moyeobang.getAccountStateBymemberId(accountId, selectedMember)
      }
    },
    enabled: selectedMember.length==1 // 개인별
  });

  const transactionListData = transactionData.data.data;
  // **

  // const transactionListData = transactions;//임시

  // TODO 주석 제거
  // // 타입 가드 함수
  function isAccountBalanceByGroup(
    accountData: AccountBalanceByGroup | AccountBalanceBymemberId
  ): accountData is AccountBalanceByGroup {
    return (accountData as AccountBalanceByGroup).totalMoney !== undefined;
  }

  const accountData = selectedMember.length > 1 
    ? accountDataByGroup?.data.data 
    : accountDataByMember?.data.data;

  if (!accountData) {
    return <div>Loading...</div>;
  }

  function onMemberClick(memberId : MemberId | null) {
    if (memberId) {
        // 해당 memberId get요청
        setSelectedMember([memberId])
    } else {
        // 전체 조회
        const allList = profileData.map((member) => member.memberId)
        setSelectedMember(allList)
    }
  }  

  return (
    <>
    <div css={layoutStyle}>
        <div css={profileListStyle} >
        <AllImage
        isSelected={selectedMember.length>1}
        onClick={() => onMemberClick(null)}
        />
        { profileData.map((profile, index) => (
            <ProfileImage 
            key={index} 
            {...profile} 
            isSelected={selectedMember.length!==1 ? false : selectedMember.includes(profile.memberId) } 
            onClick={() => onMemberClick(profile.memberId)} />
        ))}
        </div>
        <div css={accountCardStyle} >
          {/* TODO 주석 제거 */}
          {isAccountBalanceByGroup(accountData)  ? 
            <AccountCard 
            currentBalance={accountData.currentBalance}
            travelAccountNumber={'333333-12-8912312'}
            travelName={'아기돼지 오형제'}
            /> 
            :
            <AccountCard 
            currentBalance={accountData.personalCurrentBalance}
            travelAccountNumber={'333333-12-8912312'}
            travelName={'아기돼지 오형제'}
            memberName={accountData.participant.memberName}
            />
          }
        </div>
        <div css={transactionListStyle}>
            {transactionListData.map((tran, index) => 
                <TransactionCard key={index} {...tran} />
            )}
        </div>
    </div>
    <Navbar/>
    </>
  )
}