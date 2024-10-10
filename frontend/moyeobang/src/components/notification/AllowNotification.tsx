import React from 'react';
import {css} from '@emotion/react';
import Btn from '../common/btn/Btn';
import {colors} from '@/styles/colors';
import requestPermissionAndSaveToken from '@/services/notificationService';
import useFcmStore from '@/store/useFcmStore';
import {useRouter} from '@tanstack/react-router';
import useMyInfo from '@/store/useMyInfoStore';

const modalOverlayStyle = css`
  position: fixed;
  top: 0;
  left: 50%; /* 좌우 중앙 정렬을 위한 설정 */
  transform: translateX(-50%); /* 중앙 정렬을 위해 -50% 이동 */
  max-width: 390px;
  width: 100%; /* 100%로 지정 */
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 어두운 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 101;
`;

const modalContainerStyle = css`
  width: 50%;
  padding: 30px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const questionStyle = css`
  font-family: 'semibold';
  font-size: 20px;
  color: ${colors.black};
  margin-bottom: 20px;
`;

const descriptionStyle = css`
  font-family: 'medium';
  font-size: 14px;
  color: ${colors.strongGray};
  margin-bottom: 20px;
  line-height: 1.5;
`;

const buttonContainerStyle = css`
  display: flex;
  justify-content: space-around;
  width: 100%;
  font-size: 16px;
`;

interface AllowNotificationProps {
  onClose: () => void;
}

export default function AllowNotification({onClose}: AllowNotificationProps) {
  // const handleAllowClick = async () => {
  //   // 서비스 워커가 준비된 후에 권한 요청 및 FCM 토큰 생성
  //   if (navigator.serviceWorker) {
  //     const registration = await navigator.serviceWorker.ready;
  //     console.log('Service Worker 준비 완료:', registration);
  //     await requestPermissionAndSaveToken(); // 권한 요청 및 FCM 토큰 생성
  //   } else {
  //     console.error('Service Worker is not ready.');
  //   }
  //   onClose();
  // };
  const router = useRouter();
  const {setIsFcmToken} = useFcmStore();
  const {memberId} = useMyInfo();
  const handleAllowClick = async () => {
    // console.log('승인');
    try {
      // "승인" 버튼 클릭 시 푸시 알림 권한을 요청하고 FCM 토큰을 받아옴
      // console.log(memberId);
      await requestPermissionAndSaveToken(setIsFcmToken, memberId);
      // router.navigate({to: '/accountConnect'});
      onClose();
      // console.log('Notification permission granted and token saved.');
    } catch (error) {
      console.error('Error requesting permission or saving token:', error);
    }
  };

  return (
    <div css={modalOverlayStyle}>
      <div css={modalContainerStyle}>
        <h3 css={questionStyle}>
          &apos;모여방&apos;에서 푸시알림을 보내고자 합니다
        </h3>
        <p css={descriptionStyle}>
          경고, 사운드, 아이콘 배지가 알림에 포함될 수 있습니다. 설정에서 이를
          구성할 수 있습니다.
        </p>
        <div css={buttonContainerStyle}>
          <Btn buttonStyle={{style: 'red', size: 'middle'}}>허용 안함</Btn>
          <Btn
            buttonStyle={{style: 'blue', size: 'middle'}}
            onClick={handleAllowClick}
            // onClick={onClose}
          >
            승인
          </Btn>
        </div>
      </div>
    </div>
  );
}
