import React from "react"
import Btn from "@/components/common/btn/Btn"
import SettleCard from "./SettleCardByCustom";
import { useState, useEffect } from "react";
import refreshImage from '@/assets/icons/refresh.png';
import { layoutStyle, textLayoutStyle, balanceStyle, timeStyle, refreshStyle, placeStyle, remainStyle, allButtonStyle, allRefreshLayoutStyle, settleListLayoutStyle, nButtonStyle, buttonLayoutStyle } from "./settlePage";
import FinalModal from "@/components/Account/FinalModal/FinalModal";
import {format} from 'date-fns';
import {ko} from 'date-fns/locale';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import moyeobang from "@/services/moyeobang";
import PresentMoneyModal from "../PresentMoneyModal/PresentMoneyModal";
import useTravelDetailStore from "@/store/useTravelDetailStore";

export interface CustomSettle {
    participantInfo: ParticipantInfo
    money : number
    isChecked: boolean
    isDecided:boolean // 금액 확정
}

interface SettleByCustomComponenetProps {
    transactionId : TransactionId;
    paymentName: PaymentName;
    totalMoney: Money;
    createdAt: CreatedAt;
    details: SettledParticipantByCustom[];
    acceptedNumber:AcceptedNumber;
    isUpdate:boolean;
    fromUpdateReceipt:boolean;
}

// 결제 후 데이터
// money(totalMoney), transactionId, createdAt, paymentName, 와 모임통장 회원 정보 필요

export default function SettleByCustomComponent({transactionId, totalMoney, paymentName, createdAt, details, acceptedNumber, isUpdate, fromUpdateReceipt} : SettleByCustomComponenetProps) {
    const [ settleData , setSettleData ] = useState<CustomSettle[]>([]);
    const [ remainMoney, setRemainMoney ] = useState<number>(0);
    const [ isAll, setIsAll ] = useState<boolean>(true);
    const [ canSettle, setCanSettle ] = useState<boolean>(false);
    const [ isOpenFinalModal, setIsOpenFinalModal ] = useState<boolean>(false);
    const [ confirmData, setConfirmData ] = useState<CustomSettle[]>([]);
    const navigate = useNavigate({from:'/account/$transactionId/settle'});
    const queryClient = useQueryClient();
    const [isOpenPresentModal, setIsOpenPresentModal] = useState<boolean>(false);
    const [presentMoney, setPresentMoney] = useState<number>(0);
    const {travelId} = useTravelDetailStore();
    const {participantsInfo} = useTravelDetailStore();
    
    // 직접 정산 API
    const {mutate: postCustom } = useMutation({
        mutationFn: ({transactionId, travelId, data} : {transactionId: TransactionId, travelId:Id, data: PostTransactionDetailByCustom}) => moyeobang.postSettleByCustom(transactionId, travelId, data),
        onSuccess: async () => {
        await queryClient.invalidateQueries({
            queryKey: ['transactionDetail', transactionId],
            refetchType: 'all',
        });
        await navigate({to: `/account/${transactionId.toString()}/detail`});
        },
     });

        // 직접 정산 API
    const {mutate: updateCustom } = useMutation({
        mutationFn: ({transactionId, travelId, data} : {transactionId: TransactionId, travelId:Id, data: PostTransactionDetailByCustom}) => moyeobang.updateSettleByCustom(transactionId, travelId, data),
        onSuccess: async () => {
        await queryClient.invalidateQueries({
            queryKey: ['transactionDetail', transactionId],
            refetchType: 'all',
        });
        await navigate({to: `/account/${transactionId.toString()}/detail`});
        },
    });


    useEffect(()=> {
        // 새로 들어온거 details=[] 여기에 default 1/n해주기
        if (!isUpdate || fromUpdateReceipt) {

            const initialSettle = participantsInfo.map(member => {
                return {
                    participantInfo : member,
                    money :Math.floor(totalMoney/participantsInfo.length),
                    isChecked: true,
                    isDecided:false, // 초기 아무도 확정아님.
                };
            })
            setSettleData(initialSettle);
            setRemainMoney(totalMoney-Math.floor(totalMoney/participantsInfo.length)*participantsInfo.length);
        } 
        // 수정일 때 details있음.
        else if (details && details.length > 0) {

            const initialSettle = participantsInfo.map(member => {
                const prevMember = details.find((detail) => detail.participant.memberId === member.memberId);
                return {
                    participantInfo : member,
                    money : prevMember ? prevMember.money : 0,
                    isChecked: prevMember ? true : false,
                    isDecided:false, // 초기 아무도 확정아님.
                }
            });
            setSettleData(initialSettle);
            setRemainMoney(0);
        }
    }, [participantsInfo, details, totalMoney, isUpdate])

    // 모여방 남은 금액 선물하기
    useEffect(()=>{
        if (remainMoney > 0 && remainMoney < participantsInfo.length) {
            setIsOpenPresentModal(true);
            setPresentMoney(remainMoney);
            setRemainMoney(0);
        }
    }, [remainMoney])

    // 총액만큼 정산되어야 정산 가능.
    useEffect(() => {
        if ( remainMoney===0 ){
            setCanSettle(true);
        } else {
            setCanSettle(false);
        }
    }, [remainMoney, setRemainMoney, settleData])

    // 정산하기 버튼 최종확인 모달로 이동
    function handleConfirm() {
        setConfirmData(settleData
        .filter(user => user.money > 0)
        )
        setIsOpenFinalModal(true);
    }

    // 최종확인에서 확인완료 후 정산하기 
    function handleSettle() {
        const info = settleData
        .filter(user => user.money > 0) // 금액이 있는 유저
        .map(user => ({
            memberId: user.participantInfo.memberId,
            money: user.money,
        }) )
        
        const spendData : PostTransactionDetailByCustom = {
            paymentName : paymentName,
            money:totalMoney, 
            info : info,
            splitMethod : 'custom', 
            acceptedNumber: acceptedNumber,
        }

        // console.log('직접 정산 POST 데이터',spendData)
        if (isUpdate) {
            console.log('업데이트')
            updateCustom({transactionId, travelId,  data:spendData})
        } else {
            console.log('처음 post')
            postCustom({transactionId, travelId,  data:spendData})
        }
        setIsOpenFinalModal(false);
    }

    // 업데이트 onChange
    function handleUpdate(updateUser : {memberId: number, money:number, isChecked:boolean}) {

        setSettleData((prevData) => {
            // 방금 변한값으로 update
            const updateData = prevData.map((member) => (
                updateUser.memberId === member.participantInfo.memberId ?
                {...member, money:updateUser.money, isChecked:updateUser.isChecked} :
                member
            ));

            // update된거 이용해서 계산.
            const currentTotal = updateData.reduce((total, user) => total + (user.money>0? user.money : 0), 0); 
            const remain = totalMoney- currentTotal
            // 남은 금액이 음수가 되버리면 지금 넣을수 있는 최대값으로 넣어주기!
            if ( remain<0 ) {
                setRemainMoney(0);
                updateUser.money += remain;
                return updateData.map((user) =>
                    user.participantInfo.memberId === updateUser.memberId
                    ? { ...user, money: updateUser.money }
                    : user
                );
            } else {
                setRemainMoney(remain);
                return updateData; 
            }
        })
    }

    // 초기화
    function handleRefresh() {
        setSettleData((prev) => 
            prev.map((member) => (
                {...member, money:0, isDecided:false, isChecked:true}
            ))
        ); // 깊은 복사!
        setRemainMoney(totalMoney)
        setCanSettle(false); 
    }

    function handleDivide() {
        
        // 체크된 사람이면서 아직 금액측정 안된사람
        const checkedCount = settleData.filter(user => user.isChecked && user.money===0).length; 
        if (checkedCount===0) { return }
        const currentTotal = settleData.reduce((total, user) => total + (user.money>0? user.money : 0), 0); 
        const remainingAmount = totalMoney - currentTotal // 전체 금액 - 현재까지 정산된 총금액
        // 체크된 사람들이 정산할 금액
        const dutchMoney = Math.floor( remainingAmount / checkedCount);
        const realRemain = remainingAmount - (dutchMoney*checkedCount);
        setRemainMoney(realRemain); // 남은 돈 넣어주기

        setSettleData(prevData =>
            prevData.map(user => 
                user.isChecked && user.money==0 ? 
                // 소수점 버림
                {...user, money: dutchMoney, isDecided:true} :
                {...user, isDecided:true}
            )
        )
    }

    function toggleAll() {
        // 1/n 해방 눌렀는지
        const isDivide = settleData.some((member) => member.isDecided);

        if (!isDivide) {
            setSettleData((prevData) => 
                prevData.map((user) => 
                    isAll ? 
                    ( {...user, isChecked : !isAll, money:0}) :
                    ({...user, isChecked : !isAll})
                ))
            setIsAll((prev) => !prev)
        }
    };

    function handleClickOutside(canDectect:boolean) {
        if (canDectect) {
            setIsOpenFinalModal(false);
        }
    }

    function handleClosePresentModal() {
        setIsOpenPresentModal(false);
    }

    return (
        <>
        { isOpenPresentModal && <PresentMoneyModal remainMoney={presentMoney} onClose={handleClosePresentModal}/>}
        { isOpenFinalModal && 
            <FinalModal 
            onClickOutside={handleClickOutside} 
            onClick={handleSettle}
            confirmData={confirmData}
            totalMoney={totalMoney}
            /> 
        }
        <div css={layoutStyle}>
            <div css={textLayoutStyle}>
                <div css={placeStyle}>{paymentName}</div>
                <div css={balanceStyle}>
                    <div>총 금액 : {totalMoney} 원</div>
                    <div css={remainStyle}>남은 금액 : <span>{remainMoney}</span> 원</div>
                </div>
                <div css={timeStyle}>{format(createdAt, 'yyyy-MM-dd HH:mm', {locale: ko})}</div>
                <div css={allRefreshLayoutStyle}>
                <div css={allButtonStyle(isAll)} onClick = {toggleAll}>
                    { isAll ? <button>전체 해제</button> : 
                    <button>전체 선택</button>
                    }
                </div>
                <div css={refreshStyle}>초기화 
                <img 
                onClick={handleRefresh}
                src={refreshImage} 
                alt="" />
                </div>
                </div>
            </div>
            <div css={settleListLayoutStyle}>
                { settleData.map((user, index) => (
                    <SettleCard 
                    key={index}
                    memberId={user.participantInfo.memberId}
                    profileImage={user.participantInfo.profileImage}
                    memberName={user.participantInfo.memberName}
                    isChecked={user.isChecked}
                    isDecided={user.isDecided}
                    money={user.money}
                    onUpdate={handleUpdate}
                    />
                ))}
            </div>
            <div css={buttonLayoutStyle}>
                <div css={nButtonStyle}>
                    남은 금액 1/N 해방
                    <button onClick={handleDivide}>1/N</button>
                </div>
                { canSettle ? (
                    <Btn 
                    buttonStyle={{ size:'big', style:'blue'}}
                    onClick={handleConfirm}
                    >{ isUpdate ? '수정하기' : '정산하기'}
                    </Btn> 
                ) : ( 
                    <Btn 
                    buttonStyle={{ size:'big', style:'gray'}}
                    >{ isUpdate ? '수정하기' : '정산하기'}
                    </Btn>
                )
                }
            </div>
        </div>
        </>
    )
}