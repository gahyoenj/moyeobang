// 푸시 알림 처리하는 서비스워커

importScripts(
  'https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js'
);

self.addEventListener('install', _ => {
  // console.log('fcm sw install...');
  self.skipWaiting();
});

self.addEventListener('activate', _ => {
  // console.log('fcm service worker가 실행되었습니다.');
});

const firebaseConfig = {
  apiKey: 'AIzaSyDypWGdlW3XCYCFKKiqeQsC8ZTVK6KIH3w',
  authDomain: 'moyeobang-d1dec.firebaseapp.com',
  projectId: 'moyeobang-d1dec',
  storageBucket: 'moyeobang-d1dec.appspot.com',
  messagingSenderId: '843044088485',
  appId: '1:843044088485:web:598d60eb3abcbd8646bb4c',
  measurementId: 'G-1NPCHWL974',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(messaging, payload => {
  // console.log('[백그라운드 알림]', payload.data); // 푸시알림 콘솔 확인용
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.content,
    icon: payload.data.icon,
    data: {
      url: payload.fcmOptions.link, // 알림 클릭시 이동할 URL
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 이벤트 처리
self.addEventListener('notificationclick', event => {
  event.notification.close(); // 알림 닫기

  // 알림에서 설정한 URL로 이동
  const clickActionUrl = event.notification.data.url;
  if (clickActionUrl) {
    event.waitUntil(self.clients.openWindow(clickActionUrl));
  }
});

// firebase-messaging-sw.js

self.addEventListener('install', event => {
  // console.log('Service Worker 설치 완료.');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // console.log('Service Worker 활성화 완료.');
});

self.addEventListener('fetch', event => {
  // console.log('Service Worker에서 fetch 요청을 처리하고 있습니다.');
  event.respondWith(fetch(event.request));
});

// self.addEventListener('push', function (event) {
//   let payload;

//   try {
//     payload = event.data.json(); // 푸시 데이터 JSON으로 파싱
//     console.log('JSON으로 파싱된 데이터:', payload);
//   } catch (error) {
//     console.error('푸시 데이터 파싱 오류:', error);
//     return; // 파싱 실패 시 종료
//   }

//   // 데이터가 객체인지 확인
//   if (typeof payload !== 'object') {
//     console.error('푸시 데이터가 객체가 아닙니다:', payload);
//     return;
//   }

//   const title = payload.title || '기본 타이틀';
//   const options = {
//     body: payload.content || '기본 메시지 내용입니다.',
//     icon: payload.icon || '/default-icon.png',
//     data: {
//       url: payload.url || '/', // URL이 없다면 기본값 설정
//     },
//   };

//   console.log('알림 제목:', title);
//   console.log('알림 옵션:', options);

//   // 알림 표시
//   try {
//     event.waitUntil(self.registration.showNotification(title, options));
//   } catch (notificationError) {
//     console.error('알림 표시 오류:', notificationError);
//   }
// });

self.addEventListener('push', function (event) {
  let payload;

  try {
    payload = event.data.json(); // 푸시 데이터 JSON으로 파싱
    // console.log('JSON으로 파싱된 데이터:', payload);
  } catch (error) {
    console.error('푸시 데이터 파싱 오류:', error);
    return; // 파싱 실패 시 종료
  }

  // 데이터가 유효한지 확인하고 알림을 표시
  const title = payload.data.title;
  const options = {
    body: payload.data.content,
    icon: payload.data.icon,
    data: {
      url: payload.data.url,
    },
  };

  // console.log('알림 제목:', title);
  // console.log('알림 옵션:', options);

  // title과 body가 있는 경우에만 알림 표시
  if (title && options.body) {
    try {
      event.waitUntil(self.registration.showNotification(title, options));
    } catch (notificationError) {
      console.error('알림 표시 오류:', notificationError);
    }
  } else {
    console.warn('알림 제목 또는 내용이 없어 알림을 표시하지 않습니다.');
  }
});

// 알림 클릭 시 이벤트 처리
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const clickActionUrl = event.notification.data.url;
  if (clickActionUrl) {
    event.waitUntil(self.clients.openWindow(clickActionUrl));
  }
});
