import React, {useState, useEffect} from 'react';
import PublicRequest from './PublicRequest'; // 기존 컴포넌트
import HurryNotification from './HurryNotification'; // 새로운 알림 컴포넌트
import TimeNotification from './TimeNotification'; // 새로운 알림 컴포넌트
import {css} from '@emotion/react';
import HeaderWithXButton from '../common/Header/HeaderWithXbutton';
import sadBangbang from '@/assets/icons/sadBangbang.png';
import axios from 'axios';

interface NotificationData {
  title: string;
  content: string;
  action?: string; // 알림의 유형을 구분할 필드
}

const layoutStyle = css`
  margin-top: 50px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
`;

const emptyMessageStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-item: center;
  font-family: 'semibold';
  font-size: 24px;
  // color: gray;
  margin-top: 210px;

  img {
    width: 200px;
  }
`;

export default function NotificationModal({onClose}: {onClose: () => void}) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]); // 알림 저장 상태

  // //푸시알림테스트
  // const FCM_SERVER_KEY =
  //   'BFg_yRn7AVZukoSqRrEcdS-OA-5O8xtZFRad4q7Y7ZteODNuCTrgTbAnp588LN94b6UzY-TZ7jSvnwdSCRDQxNU'; // Firebase 콘솔에서 가져온 서버 키
  // const DEVICE_TOKEN =
  //   'fN1Br2JC3HKeA1EqvcKXd3:APA91bEkT7afk4-55crPuuJbkFEqqJw4Ce2FA4v4bWKK3QwPglgrIO5qzbj3JnlzFsEJd03-a6GZMMhVD3e9mjA1g7VpGKLjY-fhdbTBM3p_dHfWzuUnTHTz4inH1DeoC1fVXkuLElRi'; // 수신할 디바이스의 FCM 토큰

  // const sendPushNotification = async () => {
  //   const payload = {
  //     to: DEVICE_TOKEN,
  //     notification: {
  //       title: '잔액 알림',
  //       body: 'This is a test push notification from React.',
  //     },
  //     data: {
  //       url: 'https://example.com',
  //     },
  //   };

  //   try {
  //     const response = await axios.post(
  //       'https://fcm.googleapis.com/fcm/send',
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `key=${FCM_SERVER_KEY}`,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );
  //     console.log('Push notification sent:', response.data);
  //   } catch (error) {
  //     console.error('Error sending push notification:', error.response?.data);
  //   }
  // };

  // useEffect(() => {
  //   sendPushNotification();
  // }, []);

  // 로컬 스토리지에서 알림을 불러오는 함수
  useEffect(() => {
    const savedNotifications = sessionStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications)); // 로컬 스토리지에서 알림을 불러옴
    }
  }, []);

  // // 더미 알림 생성 함수
  // useEffect(() => {
  //   const dummyNotifications = [
  //     {
  //       title: '공금 입금 요청',
  //       content: '공금 50000원을 입금 요청했습니다.',
  //       action: 'deposit_request',
  //     },
  //     {
  //       title: '여행 공금 입금 요청',
  //       content: '공금 50000원을 입금 요청했습니다.',
  //       action: 'hurry_notification',
  //     },
  //     {
  //       title: '잔액 알림',
  //       content: '잔액이 200000원 남았습니다.',
  //       action: 'balance_check',
  //     },
  //   ];

  //   // 일정 시간마다 더미 알림 추가
  //   const intervalId = setInterval(() => {
  //     const randomNotification =
  //       dummyNotifications[
  //         Math.floor(Math.random() * dummyNotifications.length)
  //       ];

  //     setNotifications(prevNotifications => {
  //       const updatedNotifications = [...prevNotifications, randomNotification];
  //       localStorage.setItem(
  //         'notifications',
  //         JSON.stringify(updatedNotifications)
  //       ); // 로컬 스토리지에 저장
  //       return updatedNotifications;
  //     });
  //   }, 3000); // 3초마다 알림 추가

  //   // cleanup
  //   return () => clearInterval(intervalId);
  // }, []);

  // 알림 유형에 따라 컴포넌트 렌더링
  const renderNotificationComponent = (
    notification: NotificationData,
    index: number
  ) => {
    // action 또는 title을 기반으로 알림 유형을 구분하여 렌더링
    if (notification.action === 'deposit_request') {
      return (
        <PublicRequest
          key={index}
          message={notification.content}
          accountId={1234}
          amount={200000}
        />
      );
    } else if (notification.content.includes('입금을 요청했어요.')) {
      return <HurryNotification key={index} message={notification.content} />;
    } else if (notification.title.includes('잔액 알림')) {
      return <TimeNotification key={index} message={notification.content} />;
    }
  };

  return (
    <div css={layoutStyle}>
      <HeaderWithXButton onXClick={onClose} />
      {notifications.length > 0 ? (
        notifications.map((notification, index) =>
          renderNotificationComponent(notification, index)
        )
      ) : (
        <div css={emptyMessageStyle}>
          <img src={sadBangbang} />
          <p>아직 알림이 없습니다</p>
        </div>
      )}
    </div>
  );
}
