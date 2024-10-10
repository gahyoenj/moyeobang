/** @jsxImportSource @emotion/react */
import React, {useState} from 'react';
import {useRouter} from '@tanstack/react-router';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import moyeobang from '@/services/moyeobang';
import {css} from '@emotion/react';
import {colors} from '@/styles/colors';
import {useTravelLogContext} from '@/contexts/TravelLog';
import {getCategoryTag} from '@/util/getCategoryTags';
import useTravelDetailStore from '@/store/useTravelDetailStore';
import Btn from '@/components/common/btn/Btn';
import blueBlankCheck from '@/assets/icons/blueBlankCheck.png';
import blueCheck from '@/assets/icons/blueCheck.png';
import hamburgerBtn from '@/assets/icons/hamburgerButton.png';
import informationBtn from '@/assets/icons/information.png';
import MessagePopup from '@/components/common/messagePopup/MessagePopup';

const scheduleCardLayout = (scheduleImg: string) => css`
  width: 380px;
  display: flex;
  align-items: center;
  margin: 5px 0;
  border-radius: 10px;
  box-shadow:
    0 3px 3px rgba(0, 0, 0, 0.2),
    0 -3px 3px rgba(0, 0, 0, 0.2);
  padding: 5px 0;
  position: relative;
  ::after {
    content: '';
    background-image: url(${scheduleImg});
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.15;
    border-radius: 10px;
    z-index: -1;
  }
`;

const checkBoxStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 60px;
  margin: 5px;
  position: relative;
  z-index: 5;
`;

const scheduleLetterLayout = css`
  box-sizing: border-box;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: 'semibold';
`;

const oneLineStyle = css`
  display: flex;
  gap: 10px;
`;

const scheduleLetterStyle = css`
  width: 286px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const memoStyle = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: 230px;
`;

const budgetInputStyle = css`
  height: 30px;
  width: 125px;
  border-radius: 45px;
  border: 2px solid ${colors.third};
  font-size: 20px;
  font-family: 'semibold';
  color: ${colors.strongGray};
  text-align: center;

  &:focus {
    border-color: ${colors.second};
    outline: none;
  }
`;

const scheduleTitleStyle = css`
  font-family: 'semibold';
  font-size: 24px;
  img {
    width: 30px;
    height: 30px;
  }
`;

export default function PlusSelfSchedule({
  schedule,
  scheduleNum,
  dragHandleProps,
  dayNum,
}: {
  schedule: DaySchedule;
  scheduleNum: number;
  dragHandleProps: any;
  dayNum: number;
}) {
  const queryClient = useQueryClient();
  const getTimeFromSchedule = (scheduleTime: string) => {
    return scheduleTime.split('T')[1].slice(0, 5); // "T" 이후의 시간 부분에서 앞 5글자만 추출 ("HH:MM")
  };

  const [budget, setBudget] = useState<number | string>(schedule.budget || ''); // 초기값을 schedule의 predictedBudget으로 설정

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const updatedBudget = parseInt(e.target.value, 10);
    setBudget(updatedBudget);
  };

  const handleBudgetFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setBudget(''); // 클릭 시 값 비우기
  };

  const {mutate: postChangeScheduleBudget} = useMutation({
    mutationFn: ({scheduleId, budget}: {scheduleId: Id; budget: number}) =>
      moyeobang.postChangeScheduleBudget(scheduleId, budget),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['travelSchedules']});
    },
  });
  const handleBudgetBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (budget === '') {
      setBudget(schedule.budget || '');
    }
    // [todo] 예산 수정하는 api 연결하기
    if (typeof budget === 'number' && typeof schedule.scheduleId === 'number') {
      postChangeScheduleBudget({
        scheduleId: schedule.scheduleId,
        budget: budget,
      });
      // console.log('전송할 예산:', budget);
    }
  };

  const handleBudgetClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const router = useRouter();
  const handleDetailClick = (
    e: React.MouseEvent<HTMLDivElement>,
    transactionId: Id
  ) => {
    e.stopPropagation();
    router.navigate({to: `/account/${transactionId}/detail`});
  };

  // [todo] 완료 여부
  const {travelSchedules, setTravelSchedules, scheduleEdit, setScheduleEdit} =
    useTravelLogContext();
  const {travelId} = useTravelDetailStore();

  const {mutate: patchTravelScheduleCompletion} = useMutation({
    mutationFn: (scheduleId: Id) =>
      moyeobang.patchTravelScheduleCompletion(scheduleId),
    onSuccess: async () => {
      // API 요청이 성공한 후 fetchQuery로 최신 데이터 요청
      try {
        const data = await queryClient.fetchQuery({
          queryKey: ['travelSchedules'],
          queryFn: () => moyeobang.getTravelSchedules(travelId),
        });
        // console.log('[*] 변경 completed 데이터', data.data.data.schedules);
        // 최신 데이터로 Context 업데이트
        setTravelSchedules(data.data.data.schedules);
      } catch (error) {
        // console.error('Error fetching travel schedules:', error);
      }
    },
  });

  // API 미적용, UI만 보여주기
  const toggleCompletion = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    patchTravelScheduleCompletion(schedule.scheduleId as Id);
  };

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<JSX.Element | string | null>(
    null
  );

  const difference = schedule.matchedTransaction
    ? (schedule.budget || 0) - schedule.matchedTransaction.totalPrice
    : 0;
  const differenceColor = difference < 0 ? colors.customRed : colors.customBlue;

  const handleInfoClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    let message = null;

    if (schedule.matchedTransaction) {
      message = (
        <div>
          예상비용보다{' '}
          <span style={{color: differenceColor}}>{Math.abs(difference)}원</span>{' '}
          사용했나방
        </div>
      );
    }
    setPopupMessage(message);
    setShowPopup(prev => !prev);
  };

  const {handleShowPlusSelf} = useTravelLogContext();
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleShowPlusSelf();
    setScheduleEdit(schedule.scheduleId);
  };

  return (
    <div
      css={scheduleCardLayout(schedule.scheduleImg || '')}
      onClick={handleClick}
    >
      {/* 체크리스트 완료 여부 */}
      <div css={checkBoxStyle}>
        <img
          src={schedule.completion === 'COMPLETE' ? blueCheck : blueBlankCheck}
          alt="체크리스트"
          style={{width: '30px', height: '30px', margin: '5px'}}
          onClick={toggleCompletion}
        />
        <span
          style={{
            fontSize: '12px',
            marginBottom: '5px',
            color: colors.lightBlack,
          }}
        >
          {schedule.matchedTransaction?.paymentTime
            ? getTimeFromSchedule(schedule.matchedTransaction.paymentTime)
            : getTimeFromSchedule(schedule.scheduleTime || '')}
        </span>
      </div>

      {/* 일정 카드 */}
      <div css={scheduleLetterLayout}>
        <div css={scheduleLetterStyle}>
          {/* 일정 이름 */}
          <div css={scheduleTitleStyle}>
            {scheduleNum}. {schedule.scheduleTitle}{' '}
            <img
              src={
                getCategoryTag(schedule.scheduleLocation?.category || '').icon
              }
              alt="category"
            />
          </div>

          {/* 메모 */}
          {schedule.memo !== '' ? (
            <div css={oneLineStyle}>
              <span>메모 : </span> <span css={memoStyle}>{schedule.memo}</span>
            </div>
          ) : null}

          {/* 결제 비용인지 예상 비용인지 보여줌 */}
          {schedule.matchedTransaction ? (
            <>
              {/* 결제 비용 보여주기 */}
              <div css={oneLineStyle}>
                <span>결제 비용 : </span>
                <span style={{color: colors.fifth}}>
                  {schedule.matchedTransaction.totalPrice.toLocaleString()}원
                </span>
                <div style={{position: 'relative'}}>
                  <img
                    src={informationBtn}
                    alt="information"
                    onClick={handleInfoClick}
                    style={{width: '18px', height: '18px', cursor: 'pointer'}}
                  />
                  {showPopup && popupMessage && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '120%',
                        left: '50%',
                        transform: 'translateX(-80%)', // 팝업을 중앙 정렬
                        width: 'max-content', // 텍스트에 맞게 너비 조정
                      }}
                    >
                      <MessagePopup>{popupMessage}</MessagePopup>
                    </div>
                  )}
                </div>
              </div>
              {/* 정산된 인원 보여주기 */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    정산 참여자 :{' '}
                    {schedule.matchedTransaction.participantsInfo.length}명
                  </div>
                  <Btn
                    buttonStyle={{size: 'sotiny', style: 'blue'}}
                    onClick={e =>
                      schedule.matchedTransaction &&
                      handleDetailClick(
                        e as unknown as React.MouseEvent<HTMLDivElement>,
                        schedule.matchedTransaction.transactionId
                      )
                    }
                  >
                    상세보기
                  </Btn>
                </div>
                {/* [todo] 향후에는 zustand에서 participantsInfo[].length와 동일하다면 전체 프로필을 보여주고*/}
                {/* 다른 경우에는 해당 인원의 프로필만 보여주기 */}
                {/* <div>{schedule.matchedTransaction.participantsInfo.length}</div> */}
                {/* <div>
                  {schedule.matchedTransaction.participantsInfo.map(
                    (participant: ParticipantInfo, index: number) => (
                      <img
                        key={index}
                        src={participant.profileImage}
                        alt={`${participant.memberName}'s profile`}
                        style={{
                          width: '40px',
                          height: '40px',
                          marginTop: '5px',
                          marginRight: '5px',
                          borderRadius: '45px',
                          border: `2px solid ${colors.third}`,
                        }}
                      />
                    )
                  )}
                </div> */}
              </div>
            </>
          ) : (
            <div css={oneLineStyle} style={{alignItems: 'center'}}>
              <span>예상 비용</span>
              <span>
                <input
                  style={{marginRight: '5px'}}
                  type="text"
                  value={budget}
                  onClick={handleBudgetClick}
                  onChange={handleBudgetChange}
                  onFocus={handleBudgetFocus}
                  onBlur={handleBudgetBlur}
                  css={budgetInputStyle}
                />
                원
              </span>
              <div style={{position: 'relative'}}>
                <img
                  src={informationBtn}
                  alt="information"
                  onClick={handleInfoClick}
                  style={{width: '18px', height: '18px', cursor: 'pointer'}}
                />
                {showPopup && popupMessage && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '120%',
                      left: '50%',
                      transform: 'translateX(-80%)', // 팝업을 중앙 정렬
                      width: 'max-content', // 텍스트에 맞게 너비 조정
                    }}
                  >
                    <MessagePopup>{popupMessage}</MessagePopup>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 카드 이동 */}
        <div style={{width: '34px', textAlign: 'center'}}>
          <img
            src={hamburgerBtn}
            alt="일정 카드 이동"
            style={{width: '16px'}}
            {...dragHandleProps}
          />
        </div>
      </div>
    </div>
  );
}
