import {createLazyFileRoute} from '@tanstack/react-router';
import React, {useState, useEffect} from 'react';
import {css} from '@emotion/react';
import TravelCard from '@/components/travelHome/TravelCard';
import {colors} from '@/styles/colors';
import bangbang from '@/assets/icons/bangBang.png';
import sadBangbang from '@/assets/icons/sadBangbang.png';
import TwoBtn from '@/components/common/btn/TwoBtn'; // TwoBtn 컴포넌트 임포트
import plusButton from '@/assets/icons/plusButton.png';
import CreateTravel from '@/components/travelHome/CreateTravel.tsx';
import useModalStore from '@/store/useModalStore';
import NoTravel from '@/components/travelHome/NoTravel';
import useTravelDetailStore from '@/store/useTravelDetailStore';
import {useRouter} from '@tanstack/react-router';
import {useSuspenseQuery} from '@tanstack/react-query';
import moyeobang from '@/services/moyeobang';
import AllowNotification from '@/components/notification/AllowNotification';
import useCurrentTravelStore from '@/store/useCurrentTravelStore';
import useFcmTStore from '@/store/useFcmStore';
import useMyInfo from '@/store/useMyInfoStore';
import {includes} from 'lodash';

// const memberName: MemberName = '진우바오';

const memberData: Member = {
  memberId: 1,
  memberName: '진우바오',
  profileImage: 'https://example.com/images.jpg',
  accountNumber: '123456789123', // 모여방과 연결된 계좌
};

const containerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;

  /* height: 100%; */
`;

const containerListStyle = (hasCurrentTrips: boolean) => css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: ${hasCurrentTrips ? '320px' : 'calc(100vh - 320px)'};
  overflow-y: auto;
  // margin-top: 20px;
  // padding-top: 10px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const descriptionStyle = css`
  display: flex;
  align-items: center;
  margin-top: 100px;
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 35px;
  white-space: nowrap;
`;

const nickNameTextContainer = css`
  display: flex;
  flex-direction: column;
`;

const nickNameStyle = css`
  font-family: 'surround';
  font-size: 34px;
  margin-bottom: 10px;
`;

const textStyle = css`
  font-family: 'surround';
  font-size: 34px;
  display: inline-block;
`;

const textBlueStyle = css`
  font-family: 'surround';
  font-size: 32px;
  color: ${colors.fifth};
  display: inline-block;
  margin-left: 5px;
`;

const profileImageStyle = css`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px solid ${colors.gray};
  margin-left: 15px;
`;

const buttonStyle = css`
  margin-top: 30px;
  padding-bottom: 10px;
  background-color: white;
`;

const noTravelStyle = css`
  display: flex;
  align-items: center; /* 세로축 정렬을 중앙으로 설정 */
  margin-top: 130px;
  margin-left: 5px;
  margin-bottom: 100px;
`;

const noTravelTextStyle = css`
  font-family: 'semibold';
  font-size: 20px;
  color: ${colors.lightBlack};
`;

const sadIconStyle = css`
  width: 40px;
  height: 40px;
  margin-left: 5px; /* 텍스트와 아이콘 사이의 간격 추가 */
`;

const plusStyle = css`
  position: fixed; /* 또는 absolute, 부모 요소에 따라 다름 */
  bottom: 48px; /* 하단에서 25px 위 */
  right: 25px; /* 오른쪽에서 25px 떨어진 위치 */
  width: 48px;
  height: 48px;
  z-index: 50; /* 다른 요소 위에 위치하도록 설정 */
`;

//[todo] 멤버 아이디 주스탄드에서 꺼내오기!!!
// const memberId: number = 4;

function Index() {
  const {isModalOpen, openModal, closeModal} = useModalStore();
  const {setTravelData} = useTravelDetailStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const {isfcmToken} = useFcmTStore();
  const [pushNotification, setPushNotification] =
    useState<boolean>(!isfcmToken); // [todo]추후 수정해야함.... 승인 허용 했는지 함수 로직 필요
  const {setCurrentTravelData} = useCurrentTravelStore();

  const {memberId, memberName, profileImage} = useMyInfo();

  const {data: travelData} = useSuspenseQuery({
    queryKey: ['travelList', memberId],
    // memberId는 Zustand에서 가져오기!
    queryFn: () => {
      return moyeobang.getTravelList(memberId); // [*todo] 일단은 4번 회원 데이터 조회
    },
  });
  const data = travelData?.data.data;

  // console.log(data);

  // 날짜에서 시간 부분을 제거하는 함수
  const normalizeDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const today = normalizeDate(new Date());
  // console.log(today);

  // 날짜를 변환한 후 비교
  const upcomingTrips = (data as unknown as Travel[])
    .filter((item: Travel) => normalizeDate(new Date(item.startDate)) > today)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    ); // 시작 날짜 순으로 오름차순 정렬
  const pastTrips = (data as unknown as Travel[])
    .filter((item: Travel) => normalizeDate(new Date(item.endDate)) < today)
    .sort(
      (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    ); // 종료 날짜 순으로 내림차순 정렬
  const currentTrips = (data as unknown as Travel[]).filter(
    (item: Travel) =>
      normalizeDate(new Date(item.startDate)) <= today &&
      normalizeDate(new Date(item.endDate)) >= today
  );

  // activeTab에 따라 표시할 여행 결정
  let tripsToDisplay;
  if (activeTab === 'upcoming') {
    tripsToDisplay = upcomingTrips;
  } else if (activeTab === 'past') {
    tripsToDisplay = pastTrips;
  } else {
    tripsToDisplay = currentTrips; // 필요에 따라 현재 진행 중인 여행
  }

  // 여행이 하나도 없을 때
  const noTripsAvailable =
    currentTrips.length === 0 &&
    upcomingTrips.length === 0 &&
    pastTrips.length === 0;

  const router = useRouter();
  const clickTravelCard = (travel: Travel) => {
    // console.log('Clicked travel:', travel.travelId); // 어떤 여행이 클릭되었는지 확인
    setTravelData({
      travelId: travel.travelId,
      travelName: travel.travelName,
      travelImg: travel.travelImg,
      startDate: travel.startDate,
      endDate: travel.endDate,
      travelPlaceList: travel.travelPlaceList,
      accountId: travel.accountId,
      accountNumber: travel.accountNumber,
      participantsInfo: travel.participantsInfo,
    }); // 상태 저장

    router.navigate({
      to: `/travelLog`,
    });
  };

  const goSettingPage = () => {
    router.navigate({
      to: `/profile/${memberName}`,
    });
  };

  const closePush = () => {
    setPushNotification(false);
  };

  useEffect(() => {
    if (currentTrips.length > 0) {
      // currentTrips 데이터 중 필요한 값들을 저장
      const travelInfo = currentTrips.map(trip => ({
        travelId: trip.travelId,
        travelName: trip.travelName,
        accountNumber: trip.accountNumber,
        accountId: trip.accountId,
        startDate: trip.startDate,
        endDate: trip.endDate,
        travelPlaceList: trip.travelPlaceList,
        travelImg: trip.travelImg,
        participantsInfo: trip.participantsInfo,
      }));

      setCurrentTravelData(travelInfo[0]); // Zustand에 저장
    }
  }, []);

  return (
    <>
      {/* <HeaderWithAlarmAndQR /> */}
      <div css={descriptionStyle}>
        <div css={nickNameTextContainer}>
          <p css={nickNameStyle}>{memberName}의</p>
          <span css={textStyle}>
            여행기록<span css={textBlueStyle}>모여방</span>
          </span>
        </div>
        <img
          src={
            !profileImage || profileImage.includes('default_profile')
              ? bangbang
              : profileImage
          }
          css={profileImageStyle}
          onClick={goSettingPage}
        />
      </div>

      {pushNotification && <AllowNotification onClose={closePush} />}

      {noTripsAvailable ? (
        <NoTravel />
      ) : (
        <>
          {/* 현재 진행 중인 여행이 있을 경우 표시 */}
          {currentTrips.length > 0 && (
            <div css={containerStyle}>
              {currentTrips.map(trip => (
                <TravelCard
                  key={trip.travelId}
                  travelId={trip.travelId}
                  travelName={trip.travelName}
                  startDate={trip.startDate}
                  endDate={trip.endDate}
                  travelPlaceList={trip.travelPlaceList}
                  participantsCount={trip.participantCount}
                  quizQuestion={trip.quizQuestion} // quizQuestion 전달
                  quizAnswer={trip.quizAnswer} // quizAnswer 전달
                  onClick={() => clickTravelCard(trip)}
                  travelImg={trip.travelImg}
                />
              ))}
            </div>
          )}

          {/* TwoBtn 컴포넌트 사용, 왼쪽엔 예정여행, 오른쪽엔 지난 여행 */}
          <div css={buttonStyle}>
            <TwoBtn
              leftText="예정여행"
              rightText="지난 여행"
              onLeftClick={() => setActiveTab('upcoming')}
              onRightClick={() => setActiveTab('past')}
            />
          </div>

          {/* 여행 카드 리스트 */}

          <div css={containerListStyle(currentTrips.length > 0)}>
            <div>
              {tripsToDisplay.length > 0 ? (
                tripsToDisplay.map((item, index) => (
                  <TravelCard
                    key={`${item.travelId}-${index}`}
                    travelId={item.travelId}
                    travelName={item.travelName}
                    startDate={item.startDate}
                    endDate={item.endDate}
                    travelPlaceList={item.travelPlaceList}
                    participantsCount={item.participantCount}
                    quizQuestion={item.quizQuestion}
                    quizAnswer={item.quizAnswer}
                    onClick={() => clickTravelCard(item)}
                    activeTab={activeTab}
                    travelImg={item.travelImg}
                    participantsInfo={item.participantsInfo}
                    accountId={item.accountId}
                  />
                ))
              ) : (
                <div css={noTravelStyle}>
                  <span css={noTravelTextStyle}>
                    {activeTab === 'upcoming' ? '예정 여행' : '지난 여행'}이
                    없습니다
                  </span>
                  <img src={sadBangbang} css={sadIconStyle} />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <img src={plusButton} css={plusStyle} onClick={openModal} />

      {isModalOpen && <CreateTravel onClose={closeModal} />}
    </>
  );
}

export const Route = createLazyFileRoute('/_layout/_protected/_layout/_Home/')({
  component: Index,
});
