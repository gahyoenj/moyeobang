/** @jsxImportSource @emotion/react */
import React, {useEffect, useState} from 'react';
import {css} from '@emotion/react';
import {colors} from '@/styles/colors';
import {useSwipeable} from 'react-swipeable';
import {useTravelLogContext} from '@/contexts/TravelLog';
import useTravelDetailStore from '@/store/useTravelDetailStore';
import PlusBtn from '@/components/common/btn/PlustBtn';
import DaySchedules from './DaySchedules';
import PlusSelf from '@/components/travelLog/PlusSelf/PlusSelf';
import ScheduleMapSearch from '@/components/travelLog/PlusSelf/Map/ScheduleMapSearch';
import sadBangBang from '@/assets/icons/sadBangbang.png';
import bangBang from '@/assets/icons/bangBang.png';

// travelLogListLayout을 390px 너비로 가로 스크롤 없이 설정
const travelLogListLayout = css`
  height: 473px;
  width: 390px; /* 390px로 고정 */
  position: fixed;
  bottom: 0px;
  border-top-right-radius: 45px;
  border-top-left-radius: 45px;
  background-color: ${colors.white};
  display: flex;
  flex-direction: row;
  overflow-x: hidden; /* 가로 스크롤 없앰 */
  overflow-y: auto; /* 세로 스크롤 허용 */

  /* 세로 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox에서 스크롤바 숨김 */
  -ms-overflow-style: none; /* Internet Explorer에서 스크롤바 숨김 */

  /* Chrome, Safari, Edge에서 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const noTravelDateStyle = css`
  min-width: 390px; /* DaySchedule의 너비를 390px로 맞춤 */
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease-out;
  font-size: 24px;
  font-family: 'semibold';
  color: ${colors.lightBlack};

  #no-travel-date {
    font-family: 'semibold';
    font-size: 20px;
    color: ${colors.lightBlack};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 50px;
  }
  img {
    width: 150px;
    height: 150px;
  }
`;

const predictedBudgetStyle = css`
  min-width: 390px; /* DaySchedule의 너비를 390px로 맞춤 */
  font-size: 22px;

  #budget-title {
    font-family: 'medium';
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 40px 0;
    font-size: 24px;
    text-decoration: underline;
    text-underline-offset: 10px;
  }

  img {
    width: 60px;
    height: 60px;
  }

  #total-budget-info {
    width: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: 2px solid ${colors.third};
    border-radius: 45px;
    padding: 10px;
    font-family: 'semibold';
  }
  #total-budget-info-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
`;

export default function TravelLogList() {
  const {
    scheduleDayNum,
    setScheduleDayNum,
    currentIndex,
    setCurrentIndex,
    showPlusSelf,
    handleShowPlusSelf,
    showMapSearch,
    handleShowMapSearch,
    searchLocation,
    setSearchLocation,
    handleSearchLocation,
    travelDates,
    travelSchedules,
  } = useTravelLogContext();

  const [totalBudget, setTotalBudget] = useState<number>();

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setCurrentIndex((prevIndex: number) => {
        const newIndex = Math.min(prevIndex + 1, travelDays); // travelSchedules.length -> travelDays
        setScheduleDayNum(newIndex + 1); // 새로운 스케줄 번호 설정 (1부터 시작)
        // console.log('[*] 오른쪽', newIndex);

        return newIndex;
      });
    },
    onSwipedRight: () => {
      setCurrentIndex((prevIndex: number) => {
        const newIndex = Math.max(prevIndex - 1, 0);
        setScheduleDayNum(newIndex + 1); // 새로운 스케줄 번호 설정 (1부터 시작)
        // console.log('[*] 왼쪽', newIndex);

        return newIndex;
      });
    },
  });
  useEffect(() => {
    const newTotalBudget = travelSchedules.reduce((total, schedule) => {
      const dayBudget = schedule.daySchedules.reduce((sum, daySchedule) => {
        return sum + (daySchedule.budget ?? 0);
      }, 0);
      return total + dayBudget;
    }, 0);

    setTotalBudget(newTotalBudget);
    // console.log(totalBudget);
  }, [travelSchedules]);

  const travelDays = travelDates.length;

  const travelLogLayout = css`
    display: flex;
    width: ${`${(travelDays + 1) * 390}px`};
    transform: ${`translateX(-${currentIndex * 390}px)`};
    transition: transform 0.3s ease-out;
  `;

  return (
    <div css={travelLogListLayout}>
      <div css={travelLogLayout} {...handlers}>
        {travelDays > 0 &&
          travelDates.map((date, index) => {
            // console.log('[*] date', date);

            return (
              <div key={`travel-log-list-${index}`}>
                <DaySchedules date={date} dayNum={index + 1} />
              </div>
            );
          })}

        {travelDays > 0 ? (
          <div css={predictedBudgetStyle}>
            <div id="budget-title">모여방이 추측한 예산은?</div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '90px',
              }}
            >
              <div id="total-budget-info">
                <img src={bangBang} alt="bangBang" />
                <div id="total-budget-info-text">
                  <div>{travelDates.length}일 전체 예산</div>
                  <div style={{color: colors.fifth}}>
                    {totalBudget ? totalBudget.toLocaleString() : ''}원
                  </div>
                </div>
                <img src={bangBang} alt="bangBang" />
              </div>
            </div>
          </div>
        ) : (
          <div css={noTravelDateStyle}>
            <div id="no-travel-date">
              <img src={sadBangBang} alt="sadBangBang" />
              <span>여행 기간이 설정되지 않았습니다.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
