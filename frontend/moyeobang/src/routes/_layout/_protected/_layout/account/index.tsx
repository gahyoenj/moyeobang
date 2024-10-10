import React from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { css } from '@emotion/react'
import { useState } from "react";
import Navbar from "@/components/common/navBar/Navbar";
import ProfileImage from "@/components/Account/ProfileImage/ProfileImage";
import AllImage from "@/components/Account/ProfileImage/AllImage";
import TransactionCard from '@/components/Account/TranSaction/TransactionCard';
import moyeobang from '@/services/moyeobang';
import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
import Spinner from '@/components/Sipnner/Spinner';
import { isAccountBalanceByGroup } from '@/util/typeGaurd';
import CardSlider from '@/components/Account/CardSlider/CardSlider';
import ChartDetailCard from '@/components/Account/Chart/ChartDetailCard';
import useTravelDetailStore from '@/store/useTravelDetailStore';
import sadBangBang from '@/assets/icons/sadBangbang.png';
import { useMemo } from 'react';

export const Route = createFileRoute('/_layout/_protected/_layout/account/')({
  component: AccountMain
})

const layoutStyle = css`
    max-width: 100%;
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    align-items:center;
    height:100%;
    gap:10px;
`;

const profileListStyle = css`
    display: flex;
    flex-direction: row;
    justify-content:flex-start;
    align-items:center;
    padding: 10px 0;
    padding-left:10px;
    box-sizing:border-box;
    gap: 10px;
    width: 370px;

    overflow-x: auto;

    &::-webkit-scrollbar {
    display: none;
    }
`;

const accountCardStyle = css`
    max-width: 100%;
    display:flex;
    justify-content: center;
`;

const transactionListStyle = css`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;

  height:385px;
  max-height: 385px; 
  overflow-y: auto; 
  width: 100%;

  &::-webkit-scrollbar {
    display: none; 
  }
`;

const chartListStyle=css`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap:10px;

  height: 378px; 
  overflow-y: auto; 
  width: 100%;

  &::-webkit-scrollbar {
    display: none; 
  }
`;

const emptyTransactionStyle=css`
  padding-top:65px;
  width:100%;
  height:100%;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  font-family:'medium';
  font-size:20px;
  img {
    width:150px;
    height:150px;
  }
`;
export default function AccountMain() {

  const [index, setIndex] = useState<number>(0);
  const {accountId} = useTravelDetailStore();
  const {participantsInfo} = useTravelDetailStore();
  const allList = participantsInfo.map((member) => member.memberId)
  const [isAll, setIsAll]=useState<boolean>(true);
  type SelectedMember = MemberId[]; 
  const [ selectedMember , setSelectedMember ] = useState<SelectedMember>(allList) // default 전체임
  
  // get 모임 통장 거래 전체 리스트
  const {data : transactionData} = useSuspenseQuery({
    queryKey: ['transactionList', accountId, selectedMember],
    queryFn: () => moyeobang.getTransactionList(Number(accountId), selectedMember),
  });

  // get 모임 통장 전체 잔액 
  const { data :accountDataByGroup } = useQuery({
    queryKey: ['accoutByGroup', accountId],
    queryFn: () => moyeobang.getAccountState(accountId),
    enabled: isAll // 전체
  });

  //get 모임 통장 개인별 잔액
  const { data : accountDataByMember } = useQuery({
    queryKey: ['accountByMemberId', accountId, selectedMember[0]],
    queryFn: () => {
      if ( selectedMember.length==1 && selectedMember[0]) {
        return moyeobang.getAccountStateBymemberId(accountId, selectedMember[0])
      }
    },
    enabled: selectedMember.length==1 && selectedMember !== undefined && accountId !== undefined,// 개인별
  });

  // get 멤버별&전체 카테고리별 소비 비율 
  const {data : DataByCategory} = useSuspenseQuery({
    queryKey: ['categoryProportionList', accountId, selectedMember],
    queryFn: () => moyeobang.getComsuptionStaticByCategory(Number(accountId), selectedMember),
  });

  // get 멤버별 소비 비율 
  const {data : DataByMembers} = useSuspenseQuery({
    queryKey: ['membersProportionList', accountId],
    queryFn: () => moyeobang.getComsuptionStaticByMembers(Number(accountId)),
  });

  // console.log('소비카테고리', DataByCategory.data.data)
  // console.log('멤버별소비비율', DataByMembers.data.data)
  const sortedproportionDataByMembers = DataByMembers.data.data.sort((a,b) => {
    return Number(b.proportion)-Number(a.proportion)
  });

  const sortedproportionDataByCategory = DataByCategory.data.data.sort((a,b) => {
    return Number(b.proportion)-Number(a.proportion)
  });

  const transactionListData = useMemo(() => {
    return transactionData.data.data.slice().reverse();
  },[transactionData]);

  const accountData = isAll
    ? accountDataByGroup?.data.data 
    : accountDataByMember?.data.data;

  if (!accountData) {
    return <Spinner/>;
  }

  function onMemberClick(memberId : MemberId | null) {
    if (memberId) {
        // 해당 memberId get요청
        setIsAll(false);
        setSelectedMember([memberId])
    } else {
        // 전체 조회
        const allList = participantsInfo.map((member) => member.memberId)
        setIsAll(true);
        setSelectedMember(allList)
    }
  }  

  function handleIndexChange(index:number) {
    setIndex(index)
  }

  return (
    <>
    <div css={layoutStyle}>
        <div css={profileListStyle} >
          <AllImage
          isSelected={isAll}
          onClick={() => onMemberClick(null)}
          />
        { participantsInfo.map((profile, index) => (
            <ProfileImage 
            key={index} 
            {...profile} 
            isSelected={isAll? false : selectedMember.includes(profile.memberId) } 
            onClick={() => onMemberClick(profile.memberId)} />
        ))}
        </div>
        <div css={accountCardStyle} >
          {isAccountBalanceByGroup(accountData)  ?
            <CardSlider 
            account={accountData} 
            consumptionProportionByCategory={sortedproportionDataByCategory}
            consumptionProportionByMember={sortedproportionDataByMembers}
            dots={transactionListData.length>0 ? [0,1,2] : [0]}
            onChange={handleIndexChange}
            /> :
            <CardSlider 
            account={accountData}
            consumptionProportionByCategory={sortedproportionDataByCategory}
            dots={transactionListData.length>0 ? [0,1] : [0]}
            onChange={handleIndexChange}
            />
          }
        </div>
        <>
        {index===0 && <div css={transactionListStyle}>
          { transactionListData.length >0 ? 
            transactionListData.map((tran, index) => 
                <TransactionCard key={index} {...tran} /> 
            )
          : 
            <div css={emptyTransactionStyle}>
              <img src={sadBangBang} alt="" />
              아직 결제내역이 없습니다
            </div>
            }
          </div>
        }
        {index===1 && <div css={chartListStyle}>
          { sortedproportionDataByCategory.length>0 ? 
            sortedproportionDataByCategory.map((category, index) => 
            <ChartDetailCard 
              key={index} 
              title={category.categoryName} 
              proportion={category.proportion} 
              balance={category.balance}
              />
          )
          : 
            <div css={emptyTransactionStyle}>
              <img src={sadBangBang} alt="" />
                아직 결제내역이 없습니다
            </div>
        }
        </div>
        }
        {index==2 && <div css={chartListStyle}>
          {sortedproportionDataByMembers.map((member, index) =>
          <ChartDetailCard key={index} title={member.participantInfo.memberName} proportion={member.proportion} balance={member.balance} profileImage={member.participantInfo.profileImage} colorIndex={index}/>
          )}
          </div>
        }
        </>
        </div>
    <Navbar/>
    </>
  )
}