import React, {useState, useEffect, useRef} from 'react';
import {css} from '@emotion/react';
import {colors} from '@/styles/colors';
import bangBang from '@/assets/icons/bangBang.png'; // 이미지 import

const podiumContainerStyle = css`
  display: flex;
  justify-content: center;
  align-items: flex-end; /* 아래쪽에 정렬 */
  height: 120px;
  margin-top: 40px;
  /* margin-bottom: 0; */
`;

const podiumStyle = (rank: number) => css`
  display: flex;
  justify-content: center;
  align-items: flex-end; /* 막대 안에 등수를 아래쪽으로 배치 */
  background-color: rgba(175, 255, 255, 0.7);
  width: 60px;
  height: ${rank === 1 ? '90px' : rank === 2 ? '60px' : '30px'};
  border: solid 1px ${colors.second};
  font-size: 16px;
  position: relative;
  /* cursor: pointer; */
  order: ${rank === 1 ? 2 : rank === 2 ? 1 : 3};
`;

const rankStyle = css`
  position: absolute;
  font-family: 'surround';
  top: 0; /* 막대의 꼭대기 아래로 위치 */
  transform: translateY(5px); /* 막대의 꼭대기와 일정 거리 */
  font-size: 14px;
`;

const nameStyle = css`
  font-size: 14px;
  font-family: 'regular';
  text-align: center;
  width: 100%;
  margin-top: 10px;
`;

const imageStyle = css`
  width: 50px;
  height: 50px;
  border-radius: 50%; /* 둥근 이미지 */
  border: 2px solid ${colors.second}; /* stroke 효과 */
  margin: 5px;
`;

const amountStyle = css`
  position: absolute;
  top: -25px; /* 막대 바로 위에 위치 */
  left: 50%;
  transform: translateX(-50%); /* 중앙 정렬 */
  color: ${colors.black}; /* 텍스트 색상 */
  padding: 5px 10px; /* 박스 안 여백 */
  border-radius: 5px; /* 둥근 모서리 */
  font-size: 12px;
  font-family: 'medium';
  white-space: nowrap; /* 긴 텍스트도 한 줄에 표시 */
  z-index: 100;
`;

const countStyle = css`
  position: absolute;
  top: -45px; /* 금액 바로 위에 위치 */
  left: 50%;
  transform: translateX(-50%); /* 중앙 정렬 */
  background-color: ${colors.lightGray}; /* 배경색 */
  color: ${colors.black}; /* 텍스트 색상 */
  padding: 5px 8px; /* 박스 안 여백 */
  border-radius: 5px; /* 둥근 모서리 */
  font-size: 12px;
  font-family: 'regular';
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 */
  white-space: nowrap; /* 긴 텍스트도 한 줄에 표시 */
  z-index: 100;
`;

const modalOverlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const modalContentStyle = css`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 60%; /* 부모 컨테이너의 너비에 맞추기 */
  text-align: center;
  overflow-x: auto; /* 가로 스크롤 가능 */
  white-space: nowrap; /* 자식 요소들을 한 줄에 배치 */
  &::-webkit-scrollbar {
    display: none; /* 스크롤바 숨기기 */
  }
`;

const participantContainerStyle = css`
  display: inline-block; /* 가로로 나열되도록 설정 */
  margin-right: 10px; /* 참가자 간 간격 */
`;

interface ParticipantInfo {
  memberId: number;
  memberName: string;
  profileImage: string;
}

interface ConsumptionByMember {
  participantInfo: ParticipantInfo;
  proportion: string;
  balance: number;
}
interface ConsumptionRankProps {
  consumptionByMember: ConsumptionByMember[];
}

export default function ConsumptionRank({
  consumptionByMember,
}: ConsumptionRankProps) {
  const [clickedParticipant, setClickedParticipant] = useState<number | null>(
    null
  ); // 클릭된 참가자 상태
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태
  const containerRef = useRef<HTMLDivElement>(null); // 컨테이너 참조 생성
  // console.log('멤버', consumptionByMember);
  // 상위 3개의 고유 금액을 추출
  const uniqueBalances = Array.from(
    new Set(consumptionByMember.map(member => member.balance))
  )
    .sort((a, b) => b - a)
    .slice(0, 3);

  // 상위 3개의 금액에 해당하는 참가자들을 추출
  const topParticipants = consumptionByMember.filter(member =>
    uniqueBalances.includes(member.balance)
  );

  // 참가자를 클릭했을 때 실행되는 함수
  const handleClick = (balance: number) => {
    setClickedParticipant(balance === clickedParticipant ? null : balance); // 클릭된 금액을 토글
    setModalIsOpen(true); // 모달 열기
  };

  // 영역 밖을 클릭했을 때 툴팁을 숨기는 함수
  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setClickedParticipant(null); // 영역 밖 클릭 시 툴팁 숨기기
      setModalIsOpen(false); // 모달 닫기
    }
  };

  // 마운트 시 전역 클릭 이벤트 리스너 추가, 언마운트 시 제거
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div css={podiumContainerStyle} ref={containerRef}>
      {uniqueBalances.map((balance, index) => (
        <div
          key={index}
          css={podiumStyle(index + 1)}
          onClick={() => handleClick(balance)} // 클릭 이벤트 추가
        >
          {/* 등수를 막대 안에 배치 */}
          <div css={rankStyle}>{index + 1}</div>
          {/* 금액을 막대 위로 표시 */}
          <div css={amountStyle}>{balance.toLocaleString()}원</div>
          {/* 해당 금액에 해당하는 참가자 수를 금액 위로 표시 */}
          <div css={countStyle}>
            {
              topParticipants.filter(
                participant => participant.balance === balance
              ).length
            }
            명
          </div>
        </div>
      ))}
      {modalIsOpen && (
        <div css={modalOverlayStyle} onClick={() => setModalIsOpen(false)}>
          <div css={modalContentStyle} onClick={e => e.stopPropagation()}>
            <h2>멤버</h2>
            {clickedParticipant !== null && (
              <div>
                {topParticipants
                  .filter(
                    participant => participant.balance === clickedParticipant
                  )
                  .map(participant => (
                    <div
                      key={participant.participantInfo.memberId}
                      css={participantContainerStyle}
                    >
                      <img
                        src={
                          participant.participantInfo.profileImage || bangBang
                        }
                        alt={participant.participantInfo.memberName}
                        css={imageStyle}
                      />
                      <div css={nameStyle}>
                        {participant.participantInfo.memberName}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
