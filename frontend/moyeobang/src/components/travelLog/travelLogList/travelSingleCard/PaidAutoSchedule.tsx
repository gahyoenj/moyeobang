import React from 'react';
import {css} from '@emotion/react';
import {colors} from '@/styles/colors';
import {useRouter} from '@tanstack/react-router';
import {DraggableProvidedDragHandleProps} from 'react-beautiful-dnd';
import Btn from '@/components/common/btn/Btn';
import blueCheck from '@/assets/icons/blueCheck.png';
import hamburgerBtn from '@/assets/icons/hamburgerButton.png';

const scheduleCardLayout = css`
  width: 380px;
  display: flex;
  align-items: center;
  margin: 5px 0;
  border-radius: 10px;
  box-shadow:
    0 3px 3px rgba(0, 0, 0, 0.2),
    0 -3px 3px rgba(0, 0, 0, 0.2);
  padding: 5px 0;
  background-color: white;
`;

const checkBoxStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 60px;
  margin: 5px;
  background-color: ${colors.white};
  position: relative;
  z-index: 5;
`;

const scheduleLetterLayout = css`
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: 'semibold';
`;

const scheduleLetterStyle = css`
  width: 286px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const oneLineStyle = css`
  display: flex;
  gap: 10px;
`;

export default function PaidAutoSchedule({
  schedule,
  scheduleNum,
  dayNum,
  dragHandleProps,
}: {
  schedule: DaySchedule;
  scheduleNum: number;
  dayNum: number;
  dragHandleProps: any;
}) {
  const getTimeFromSchedule = (scheduleTime: string) => {
    // console.log('[*] scheduleTime', scheduleTime);

    return scheduleTime.split('T')[1].slice(0, 5); // "T" 이후의 시간 부분에서 앞 5글자만 추출 ("HH:MM")
  };

  const router = useRouter();
  const handleDetailClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    transactionId: Id
  ) => {
    e.stopPropagation();
    router.navigate({to: `/account/${transactionId}/detail`});
  };

  return (
    <div css={scheduleCardLayout}>
      <div css={checkBoxStyle}>
        <img
          src={blueCheck}
          alt="체크리스트"
          style={{width: '30px', height: '30px', margin: '5px'}}
        />
        <span
          style={{
            fontSize: '12px',
            marginBottom: '5px',
            color: colors.lightBlack,
          }}
        >
          {getTimeFromSchedule(schedule.unmatchedTransaction?.paymentTime || '')}
        </span>
      </div>
      <div css={scheduleLetterLayout}>
        <div css={scheduleLetterStyle}>
          <div style={{fontSize: '24px'}}>
            {scheduleNum}. {schedule.unmatchedTransaction?.paymentName}
          </div>
          <div css={oneLineStyle}>
            <span>결제 비용</span>{' '}
            <span style={{color: colors.fifth}}>
              {' '}
              {schedule.unmatchedTransaction?.totalPrice.toLocaleString()}원
            </span>
          </div>
          <div>
            {/* 정산된 인원 보여주기 */}
            <div>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                }}
              >
                <div>정산 참여자 : {schedule.unmatchedTransaction?.participantsInfo.length}명</div>
                <Btn
                  buttonStyle={{size: 'sotiny', style: 'blue'}}
                  onClick={e => {
                    handleDetailClick(e, schedule.unmatchedTransaction?.transactionId || 0);
                  }}
                >
                  상세보기
                </Btn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <img
          style={{width: '16px', cursor: 'grab'}}
          src={hamburgerBtn}
          alt="일정 이동 버튼"
          {...dragHandleProps} // 여기서 dragHandleProps 적용
        />
      </div>
    </div>
  );
}
