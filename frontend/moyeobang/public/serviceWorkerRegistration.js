import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
// FCM 관련 코드는 주석 처리 또는 제거
// import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDypWGdlW3XCYCFKKiqeQsC8ZTVK6KIH3w',
  authDomain: 'moyeobang-d1dec.firebaseapp.com',
  projectId: 'moyeobang-d1dec',
  storageBucket: 'moyeobang-d1dec.appspot.com',
  messagingSenderId: '843044088485',
  appId: '1:843044088485:web:598d60eb3abcbd8646bb4c',
  measurementId: 'G-1NPCHWL974',
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      // Firebase 서비스 워커 등록
      const firebaseRegistration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js', // 이 경로에 서비스 워커 파일을 둡니다
        {scope: '/firebase-cloud-messaging-push-scope'}
      );
      // console.log(
      //   'Firebase Service Worker 등록 성공:',
      //   firebaseRegistration.scope
      // );
      // FCM 토큰 관련 코드 주석 처리
      /*
      if (!sessionStorage.getItem('fcmToken')) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log(permission);
          // FCM 토큰 가져오기
          const currentToken = await getToken(messaging, {
            vapidKey:
              'BGVbiPhLWWxijrc2jfn9lTyDs-kcSfSinb2bUmEoDXSc8ljx6sWtur9k82vmjBLND06SSeb10oq-rw7zmzrpoPY',
          });
          if (currentToken) {
            console.log('FCM Token:', currentToken);
            sessionStorage.setItem('fcmToken', currentToken);
          } else {
            console.warn(
              'FCM 토큰을 가져올 수 없습니다. 권한이 없거나 문제가 발생했습니다.'
            );
          }
        } else {
          console.log('알림 권한 허용 X');
        }
      }
      */
    } catch (error) {
      console.error('Service Worker 등록 실패:', error);
    }
  } else {
    console.warn('Service Worker not supported in this browser');
  }
}

// 서비스 워커 등록 함수 호출
registerServiceWorker();
