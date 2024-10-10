import {css} from '@emotion/react';
import defalutSky from '@/assets/images/defaultSky.jpg';
import React, {useState} from 'react';
import {colors} from '@/styles/colors';
import settingIcon from '@/assets/icons/settingIcon.png';
import {useRouter, useNavigate} from '@tanstack/react-router';
import Btn from '../common/btn/Btn';
import ExitTravel from './ExitTravel';
import inviteIcon from '@/assets/icons/inviteIcon.png';
import blackPaperIcon from '@/assets/icons/blackPaperIcon.png';
import ConfirmQuiz from '../quiz/ConfirmQuiz';
import CreateTravel from './CreateTravel.tsx';
// import TravelSummaryModal from '../travelSummary/travelSummaryModal.tsx';
import TravelSummaryModal from '../travelSummary/TravelSummaryModal';

const overlayStyle = css`
  width: 100%; /* 흰색 박스 크기 */
  height: 100%; /* 흰색 박스 크기 */
  background-color: rgba(255, 255, 255, 0.7); /* 흰색 배경 + 70% 투명도 */
  border-radius: 10px; /* 모서리 둥글게 */
  position: absolute; /* 부모 요소 안에서 절대 위치 */
  top: 0; /* 상단부터 채우기 */
  left: 0; /* 왼쪽부터 채우기 */
  z-index: 1; /* 배경 이미지보다 위에 오도록 설정 */
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const titleStyle = css`
  max-width: 200px;
  font-size: 24px;
  font-family: 'bold';
  color: ${colors.fifth};
  margin-bottom: 15px;
  white-space: nowrap; /* 텍스트를 한 줄로 표시 */
  overflow: hidden; /* 넘치는 텍스트를 숨김 */
  text-overflow: ellipsis; /* 넘치는 텍스트를 ...으로 표시 */
`;

const participantsStyle = css`
  font-size: 15px;
  font-family: 'semibold';
  margin-bottom: 15px;
`;

const dateStyle = css`
  font-size: 15px;
  font-family: 'semibold';
  color: ${colors.strongGray};
  margin-bottom: 15px;
`;

const locationStyle = css`
  width: 290px;
  font-size: 20px;
  font-family: 'semibold';
  white-space: nowrap; /* 텍스트를 한 줄로 표시 */
  overflow: hidden; /* 넘치는 텍스트를 숨김 */
  text-overflow: ellipsis; /* 넘치는 텍스트를 ...으로 표시 */
`;

const settingIconStyle = css`
  position: absolute; /* 부모 요소 안에서 절대 위치 */
  top: 16px; /* 위쪽으로 16px 간격 */
  right: 16px; /* 오른쪽으로 16px 간격 */
  z-index: 10;
  img {
    width: 24px;
    height: 24px;
  }
`;

const settingButtonStyle = css`
  display: flex;
  z-index: 10;
  flex-direction: column;
  align-self: flex-end;
  margin-top: 20px;
`;

const reportIconStyle = css`
  position: absolute; /* 부모 요소 안에서 절대 위치 */
  top: 15px; /* 위쪽으로 16px 간격 */
  right: 75px; /* 오른쪽으로 16px 간격 */
  z-index: 10;
  img {
    width: 26px;
    height: 26px;
  }
`;

const exitModalStyle = css`
  z-index: 20;
`;

const quizButtonStyle = css`
  position: absolute; /* 부모 요소 안에서 절대 위치 */
  top: 16px; /* 위쪽으로 16px 간격 */
  right: 45px; /* 오른쪽으로 16px 간격 */
  z-index: 10;
  img {
    width: 24px;
    height: 24px;
  }
`;

interface TravelCardProps {
  travelId?: number;
  travelName: string;
  startDate: string | Date;
  endDate: string | Date;
  travelPlaceList: string[];
  participantsCount: number;
  participantsInfo?: ParticipantInfo[];
  quizQuestion: string;
  quizAnswer: string;
  onClick?: () => void;
  activeTab?: string;
  travelImg: string | null;
  accountId?: number;
}

export default function TravelCard({
  travelId,
  travelName,
  startDate,
  endDate,
  travelPlaceList,
  participantsInfo,
  participantsCount,
  quizQuestion,
  quizAnswer,
  accountId,
  onClick,
  travelImg,
  activeTab,
}: TravelCardProps) {
  const [settingButtonClick, setSettingButtonClick] = useState<boolean>(false);
  const [inviteModal, setInviteModal] = useState<boolean>(false);
  const [exitModal, setExitModal] = useState<boolean>(false);
  const [travelSummaryModal, setTravelSummaryModal] = useState<boolean>(false);
  // const navigate = useNavigate();
  const [editModal, setEditModal] = useState<boolean>(false);
  // const {nowTravelData} = useTravelContext(); // useTravelContext로 데이터 가져오기

  // travelImg 있으면 보여주고 아니면 default 값
  const cardStyle = css`
    display: flex;
    flex-direction: column;
    width: 328px;
    height: 158px;
    border-radius: 10px;
    background-image: url(${travelImg ? travelImg : defalutSky});
    background-size: cover;
    position: relative;
    padding: 16px;
    margin: 16px 0;
    overflow: hidden;
    box-sizing: border-box;
  `;

  const formatDate = (date: string | Date) => {
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    // date가 string이면 그대로 사용, Date이면 YYYY-MM-DD로 변환
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return date;
  };

  const clickSettingButton = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 전파를 막아 카드 클릭이 발생하지 않도록 설정
    setSettingButtonClick(prev => !prev);
  };

  const clickInviteButton = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 전파를 막음
    setInviteModal(true);
  };

  const clickSummaryButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    // console.log('Modal open with:', {
    //   travelName,
    //   startDate,
    //   endDate,
    //   travelPlaceList,
    // });
    setTravelSummaryModal(true);
  };

  const closeSummaryModal = () => {
    setTravelSummaryModal(false);
  };

  const handleExitModalOpen = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 전파를 막음
    // console.log('나가기클릭');
    // console.log(travelId);
    setExitModal(true);
    setSettingButtonClick(prev => !prev);
  };

  const closeExitModalOpen = () => {
    setExitModal(false);
  };

  const closeQuizModal = () => {
    setInviteModal(false);
  };

  const goSettingPage = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 전파를 막음
    // console.log('세팅페이지');
    // navigate({to: '/profile'});
    // setTravelData(title, startDate, endDate, place);
    setEditModal(true);
    setSettingButtonClick(prev => !prev);
  };

  const closeEditModal = () => {
    setEditModal(false);
  };

  return (
    <>
      <div css={cardStyle} onClick={onClick}>
        <div css={overlayStyle}>
          <h2 css={titleStyle}>{travelName}</h2>
          <p css={participantsStyle}>{participantsCount}명과 함께</p>
          <p css={dateStyle}>
            {formatDate(startDate)} ~ {formatDate(endDate)}
          </p>
          <p css={locationStyle}>{travelPlaceList.join(', ')}</p>
        </div>
        <div css={settingIconStyle}>
          <img src={settingIcon} onClick={clickSettingButton} />
        </div>
        <div css={quizButtonStyle} onClick={clickInviteButton}>
          <img src={inviteIcon} />
        </div>
        {activeTab === 'past' && (
          <div css={reportIconStyle} onClick={clickSummaryButton}>
            <img src={blackPaperIcon} />
          </div>
        )}

        {settingButtonClick && (
          <div css={settingButtonStyle}>
            <Btn
              buttonStyle={{style: 'blue', size: 'small'}}
              onClick={goSettingPage}
            >
              수정
            </Btn>
            <Btn
              buttonStyle={{style: 'red', size: 'small'}}
              onClick={handleExitModalOpen}
            >
              나가기
            </Btn>
          </div>
        )}
      </div>
      {exitModal && travelId !== undefined && (
        <div css={exitModalStyle}>
          <ExitTravel
            travelTitle={travelName}
            onClose={closeExitModalOpen}
            travelId={travelId}
          />
        </div>
      )}

      {inviteModal && travelId !== undefined && (
        <div>
          <ConfirmQuiz
            onClose={closeQuizModal}
            travelId={travelId}
            quizQusetion={quizQuestion}
            quizAnswer={quizAnswer}
          />
        </div>
      )}

      {editModal && (
        <div>
          <CreateTravel
            onClose={closeEditModal}
            isEditMode={true}
            travelId={travelId}
            initialData={{
              travelName: travelName,
              startDate: formatDate(startDate),
              endDate: formatDate(endDate),
              travelPlaceList: travelPlaceList,
              quizQuestion: quizQuestion,
              quizAnswer: quizAnswer,
              selectedImage: travelImg,
            }}
          />
        </div>
      )}

      {travelSummaryModal && (
        <div>
          <TravelSummaryModal
            travelId={travelId}
            travelName={travelName}
            startDate={formatDate(startDate)}
            endDate={formatDate(endDate)}
            travelPlaceList={travelPlaceList}
            participantsInfo={participantsInfo || []}
            onClose={closeSummaryModal}
            accountId={accountId || 0}
          />
        </div>
      )}
    </>
  );
}
