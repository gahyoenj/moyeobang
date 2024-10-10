/** @jsxImportSource @emotion/react */
import React, {useState} from 'react';
import {useRouter} from '@tanstack/react-router';
import {css} from '@emotion/react';
import {colors} from '@/styles/colors';
import QuizInput from '../common/Inputs/QuizInput';
import Btn from '../common/btn/Btn';
import CloseButton from '@/assets/icons/closeButton.png';
import {useMutation} from '@tanstack/react-query';
import moyeobang from '@/services/moyeobang';
import IsCorrectQuiz from './IsCorrectQuiz';
import useMyInfo from '@/store/useMyInfoStore';

interface QuizComponentProps {
  question: string;
  travelId: number;
  travelName: string;
}

// 모달 스타일
const modalOverlayStyle = css`
  position: fixed;
  top: 0;
  left: 50;
  /* width: 100%; */
  width: 390px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const modalContentStyle = css`
  position: relative;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 290px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center; /* 기본적으로 중앙 정렬 */
`;

const travelTitleStyle = css`
  font-family: 'bold';
  font-size: 24px;
  color: ${colors.fifth};
  margin-bottom: 10px;
  margin-top: 20px;
`;

const descripitionStyle = css`
  font-family: 'semibold';
  font-size: 20px;
  margin-bottom: 5px;
`;

const quizStyle = css`
  margin-top: 20px;
  text-align: left; /* quizStyle div만 왼쪽 정렬 */
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 수평으로 왼쪽 정렬 */
`;

const englishStyle = css`
  font-family: 'englishbold';

  font-size: 24px;
`;

const textStyle = css`
  margin-left: 10px; /* "Q"와 질문 사이 간격 추가 */
  font-family: 'semibold';
  font-size: 20px;
`;

const quizInputStyle = css`
  margin-left: -20px; /* 필요시 마진 조정 */
  margin-bottom: 10px;
  padding: 0; /* QuizInput 컴포넌트 자체의 padding이 있을 경우 조정 */
  display: flex;
  justify-content: flex-start; /* 왼쪽 정렬 */
  width: 80%; /* 필요한 경우 전체 너비로 설정 */
`;

const buttonStyle = css`
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
  font-size: 16px;
`;

const closeButtonStyle = css`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  cursor: pointer; /* 클릭할 수 있게 커서 변경 */
`;

const detailStyle = css`
  font-family: 'medium';
  font-size: 16px;
  margin-bottom: 10px;
  color: ${colors.lightBlack};
`;

export default function QuizComponent({
  question,
  travelId,
  travelName,
}: QuizComponentProps) {
  const [answer, setAnswer] = useState(''); // 입력된 답을 관리할 상태
  const router = useRouter(); // TanStack Router 사용
  const [isCorrect, setIsCorrect] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  //[todo] memberId 주스탄드에서 꺼내기!!
  // const memberId: number = 2;
  const {memberId} = useMyInfo();

  // [todo] 퀴즈 제출 api 연결
  const {mutate: postQuiz} = useMutation({
    mutationFn: ({
      travelId,
      answer,
      memberId,
    }: {
      travelId: number;
      answer: string;
      memberId: number;
    }) => moyeobang.postQuiz(travelId, {answer}, memberId),
    onSuccess: response => {
      // console.log('response', response);
      const {data} = response.data;
      setConfirmModal(true);
      if (data === true) {
        setIsCorrect(true);
        // alert('정답입니다! 여행을 함께하세요!')
        // router.navigate({to: '/'}); // 홈으로 리다이렉트
      } else {
        // alert('오답입니다. 다시 시도하세요.')
        setIsCorrect(false);
      }
    },
    onError: () => {
      alert('퀴즈 제출에 실패했습니다.');
    },
  });

  // close 버튼 클릭 시 홈으로 이동
  const handleClose = () => {
    router.navigate({to: '/'}); // 홈으로 리다이렉트
  };

  const onsubmitQuiz = (travelId: Id, answer: string, memberId: number) => {
    postQuiz({travelId, answer, memberId});
    setAnswer('');
  };

  const closeIsCorrectQuiz = () => {
    setConfirmModal(false);
  };

  return (
    <>
      <div css={modalOverlayStyle}>
        <div css={modalContentStyle}>
          <img src={CloseButton} css={closeButtonStyle} onClick={handleClose} />
          <p css={travelTitleStyle}>{travelName}</p>
          <p css={descripitionStyle}>여행에 초대되셨습니다</p>
          <p css={detailStyle}>퀴즈를 풀고 여행을 함께 해보세요!</p>
          <div css={quizStyle}>
            <span css={englishStyle}>Q</span>
            <span css={textStyle}>{question}</span>
          </div>
          <div css={quizStyle}>
            <span css={englishStyle}>A</span>
            <div css={quizInputStyle}>
              <QuizInput
                placeholder="여행 퀴즈 답을 입력하세요"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
              />
            </div>
          </div>
          <div css={buttonStyle}>
            <Btn
              buttonStyle={{style: 'blue', size: 'middle'}}
              onClick={() => onsubmitQuiz(travelId, answer, memberId)}
            >
              여행참여
            </Btn>
          </div>
        </div>
      </div>

      {confirmModal && (
        <IsCorrectQuiz isCorrect={isCorrect} onClose={closeIsCorrectQuiz} />
      )}
    </>
  );
}
