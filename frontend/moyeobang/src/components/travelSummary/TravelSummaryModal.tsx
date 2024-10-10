import React, {useEffect, useState} from 'react';
import {useSwipeable} from 'react-swipeable';
import {css} from '@emotion/react';
import {colors} from '@/styles/colors';
import HeaderWithXButton from '../common/Header/HeaderWithXbutton';
import ConsumptionSummary from './ConsumptionSummary';
import ImgSummary from './ImgSummary';
import MapComponent from './MapComponent'; // 지도 컴포넌트 임포트
import dayjs from 'dayjs';
import 'dayjs/locale/ko'; // 한국어 요일을 위해 한국어 로케일 임포트
import weekday from 'dayjs/plugin/weekday'; // 요일 계산을 위한 플러그인
import updateLocale from 'dayjs/plugin/updateLocale'; // 요일 출력 수정용 플러그인
import {useSuspenseQuery} from '@tanstack/react-query';
import moyeobang from '@/services/moyeobang';
import {last} from '@tanstack/react-router/dist/esm/utils';

const modalOverlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  z-index: 100;
`;

const modalContentStyle = css`
  padding: 10px 20px;
  flex-grow: 1;
  text-align: center;

  p {
    font-family: 'semibold';
    font-size: 13px;
  }
`;

const titleStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-family: 'semibold';
  text-align: center;

  span {
    margin-bottom: 0;
    display: inline;
  }

  margin-bottom: 5px;
`;

const travelNameStyle = css`
  color: ${colors.fifth};
  border: 3px solid ${colors.customBlue};
  border-radius: 20px;
  padding: 5px 10px;
`;

const blackTextStyle = css`
  font-family: 'semibold';
  font-size: 32px;
  color: ${colors.black};
`;

const travelPlaceStyle = css`
  font-family: 'semibold';
  font-size: 32px;
  color: ${colors.third};
`;

const modalTitleStyle = css`
  margin-top: 40px;
  margin-bottom: 10px;
`;

const mapContainerStyle = css`
  margin: 20px 0;
`;

const dotContainerStyle = css`
  display: flex;
  justify-content: center;
  margin-top: 0; /* 불필요한 마진을 없앰 */
  /* margin-top: 20px; */
  /* margin-bottom: 10px; */
`;

const dotStyle = (isActive: boolean) => css`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${isActive ? colors.fifth : colors.gray};
  margin: 0 5px;
`;

const slideStyle = css`
  max-width: 390px;
`;

dayjs.extend(weekday);
dayjs.extend(updateLocale);

dayjs.locale('ko'); // 여기서 한국어 로케일을 설정

// 한국어 요일 설정
dayjs.updateLocale('ko', {
  weekdays: ['일', '월', '화', '수', '목', '금', '토'],
});

interface TravelSummaryProps {
  travelId?: number;
  travelName: string;
  startDate: string;
  endDate: string;
  travelPlaceList: string[];
  participantsInfo: ParticipantInfo[];
  accountId: number;
  onClose: () => void;
}

export default function TravelSummaryModal({
  travelId,
  travelName,
  startDate,
  endDate,
  travelPlaceList,
  participantsInfo,
  accountId,
  onClose,
}: TravelSummaryProps) {
  // const {travelName, startDate, endDate, travelPlaceList} =
  //   useTravelDetailStore();
  const [currentSlide, setCurrentSlide] = useState(0); // 슬라이드 상태
  const slideCount = 2; // 슬라이드 개수
  const memberIds = participantsInfo.map(p => p.memberId);
  type SelectedMember = MemberId[];
  const [selectedMember] = useState<SelectedMember>(memberIds);

  // get 멤버별&전체 카테고리별 소비 비율
  const {data: DataByCategory} = useSuspenseQuery({
    queryKey: ['categoryProportionList', accountId, selectedMember],
    queryFn: () =>
      moyeobang.getComsuptionStaticByCategory(
        Number(accountId),
        selectedMember
      ),
  });

  // get 멤버별&전체 카테고리별 소비 비율
  const {data: DataByMembers} = useSuspenseQuery({
    queryKey: ['membersProportionList', accountId],
    queryFn: () => moyeobang.getComsuptionStaticByMembers(Number(accountId)),
  });

  //get 모임통장 잔액조회
  const {data: AccountMoneyData} = useSuspenseQuery({
    queryKey: ['accountByGroup', accountId],
    queryFn: () => moyeobang.getAccountState(Number(accountId)),
  });

  //여행 일정 조회
  const {data: TravelSchedulesData} = useSuspenseQuery({
    queryKey: ['travelSchedules', travelId],
    queryFn: () => moyeobang.getTravelSchedules(Number(travelId)),
  });


  // console.log(TravelSchedulesData?.data.data.schedules);
  const locationList =
    TravelSchedulesData?.data.data.schedules
      .flatMap(schedule => schedule.daySchedules) // daySchedules 배열을 평탄화
      .filter(daySchedule => daySchedule.scheduleLocation) // scheduleLocation이 존재하는 것만 필터링
      .map(daySchedule => ({
        lat: daySchedule.scheduleLocation?.latitude ?? 0,
        lng: daySchedule.scheduleLocation?.longitude ?? 0,
      })) || [];

  const imgSummary =
    TravelSchedulesData?.data.data.schedules
      .flatMap(schedule => schedule.daySchedules)
      .filter(daySchedule => daySchedule.scheduleImg) // scheduleImg가 있는 항목만 필터링
      .map(daySchedule => ({
        imgUrl: daySchedule.scheduleImg || '', // scheduleImg 필드 추출
        locationName: daySchedule.scheduleLocation?.title || 'Unknown Location', // scheduleLocation에서 장소 이름 추출
      })) || [];

  const slides = [
    <ConsumptionSummary
      key="consumptionSummary"
      categoryData={DataByCategory?.data.data || []}
      memberData={DataByMembers?.data.data || []}
      totalMoney={AccountMoneyData?.data.data.totalAmount}
      totalConsumption={AccountMoneyData?.data.data.totalSpent}
    />,
    <ImgSummary key="imgSummary" scheduleImg={imgSummary} />,
  ]; // 슬라이드에 표시할 컴포넌트들

  const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD (dddd)');
  const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD (dddd)');

  // Swipeable 설정
  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentSlide(prevSlide => (prevSlide + 1) % slideCount),
    onSwipedRight: () =>
      setCurrentSlide(prevSlide => (prevSlide - 1 + slideCount) % slideCount),
    trackMouse: true, // 마우스도 지원
  });
  useEffect(() => {
    // console.log('여행이름', travelName);
  });

  return (
    <div css={modalOverlayStyle}>
      <HeaderWithXButton onXClick={onClose} />
      <div css={modalContentStyle}>
        <div css={modalTitleStyle}>
          <div css={titleStyle}>
            <span css={travelNameStyle}>{travelName}</span>
            <span css={blackTextStyle}>의</span>
          </div>
          <span css={travelPlaceStyle}>{travelPlaceList.join(' & ')}</span>
          <span css={blackTextStyle}> 여행 요약</span>
        </div>

        <p>{`${formattedStartDate} ~ ${formattedEndDate}`}</p>

        {/* 첫 번째 슬라이드일 때만 지도 보여주기 */}
        {currentSlide === 0 && (
          <div css={mapContainerStyle}>
            <MapComponent
              locationList={locationList}
              travelPlaceList={travelPlaceList}
            />
          </div>
        )}

        {/* 슬라이드 영역 */}
        <div css={slideStyle} {...handlers}>
          {slides[currentSlide]}
        </div>

        {/* 동그라미로 슬라이드 위치 표시 */}
        <div css={dotContainerStyle}>
          {slides.map((_, index) => (
            <div
              key={index}
              css={dotStyle(currentSlide === index)}
              onClick={() => setCurrentSlide(index)} // 슬라이드 변경 (사용자가 클릭할 경우)
            />
          ))}
        </div>
      </div>
    </div>
  );
}
