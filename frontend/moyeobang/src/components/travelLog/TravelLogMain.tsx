import React, {useEffect} from 'react';
import {css} from '@emotion/react';
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {useTravelLogContext} from '@/contexts/TravelLog';
import useTravelDetailStore from '@/store/useTravelDetailStore';
import moyeobang from '@/services/moyeobang';
import TravelLogList from '@/components/travelLog/travelLogList/TravelLogList';
import Navbar from '@/components/common/navBar/Navbar';
import PlusBtn from '@/components/common/btn/PlustBtn';
import PlusSelf from '@/components/travelLog/PlusSelf/PlusSelf';
import ScheduleMapSearch from '@/components/travelLog/PlusSelf/Map/ScheduleMapSearch';
import TravelMainMap from './travelLogList/TravelMainMap';

const travelLogMainLayout = css`
  height: 100vh;
  position: relative;
`;

const plusStyle = css`
  position: fixed;
  bottom: 90px;
  right: 25px;
  width: 48px;
  height: 48px;
  z-index: 10; /* 다른 요소 위에 위치하도록 설정 */
`;

export default function TravelLogMain() {
  const {travelId} = useTravelDetailStore();
  const {
    travelDates,
    scheduleDayNum,
    travelSchedules,
    setTravelSchedules,
    showMapSearch,
    showPlusSelf,
    handleShowPlusSelf,
  } = useTravelLogContext();

  const queryClient = useQueryClient();

  // [todo] 여행 일정 조회
  const {data: travelSchedulesData} = useSuspenseQuery({
    queryKey: ['travelSchedules', travelId],
    queryFn: async () => {
      const schedules = await moyeobang.getTravelSchedules(travelId);
      // console.log('[*] 여행 일정 조회 성공', schedules);
      return schedules;
    },
    staleTime: 0, // 캐시를 새로고침할 때마다 무효화
  });

  // travelSchedulesData가 업데이트되면 상태를 설정
  useEffect(() => {
    if (travelSchedulesData) {
      setTravelSchedules(travelSchedulesData.data.data.schedules);
    }
  }, [travelSchedulesData, setTravelSchedules]);

  // 상태가 업데이트된 후의 travelSchedules를 확인
  useEffect(() => {
    // console.log('[*] 바뀌나 travelSchedules', travelSchedules);
  }, [travelSchedules]);

  return (
    <>
      <div css={travelLogMainLayout}>
        {/* 여행 일정 지도 */}
        <TravelMainMap />

        {/* Day별 여행 일정 리스트, 가로 스크롤 시 다음 Day 일정으로 넘어감 */}
        <TravelLogList />

        <Navbar />
      </div>
      {scheduleDayNum && scheduleDayNum <= travelDates.length && (
        <div css={plusStyle}>{<PlusBtn onClick={handleShowPlusSelf} />}</div>
      )}
      {showPlusSelf && <PlusSelf />}
      {showMapSearch && <ScheduleMapSearch />}
    </>
  );
}
