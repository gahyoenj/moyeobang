// // 쿠키로 시도
// import axios from 'axios';
// import {getCookie, removeCookie, setCookie} from './cookie';
// // axios 인스턴스를 반환하는 함수

// const instance = axios.create({
//   baseURL: import.meta.env.VITE_BASEURL + '/api',
//   headers: {'Content-Type': 'application/json'},
//   timeout: 4000,
// });

// // 요청 인터셉터 설정
// instance.interceptors.request.use(
//   async config => {
//     const accessToken = getCookie('accessToken');
//     if (accessToken) {
//       config.headers['Authorization'] = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

// // 응답 인터셉터 설정
// instance.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;
//     const refreshToken = getCookie('refresh-token');
//     console.log('refreshToken', refreshToken);

//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       if (!refreshToken) {
//         console.error('No refresh token available');

//         return Promise.reject(error);
//       }

//       try {
//         const refreshToken = getCookie('refresh-token');
//         const response = await instance.get(`/reissue/token`, {
//           headers: {Authorization: `Bearer ${refreshToken}`},
//         });

//         if (response) {
//           console.log('response', response);
//           const newAccessToken = response.data.accessToken;
//           console.log('newAccessToken', newAccessToken);
//           setCookie('accessToken', newAccessToken, 900);

//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           return instance(originalRequest);
//         }
//       } catch (refreshError) {
//         console.error('Failed to refresh access token:', refreshError);
//         removeCookie('accessToken');
//         removeCookie('refreshToken');
//         window.location.href = '/entrance';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default instance;

// // 다시 sessionStorage로 시도, 성공 버전
// // import axios from 'axios';
// // import {getCookie, removeCookie, setCookie} from './cookie';
// // // axios 인스턴스를 반환하는 함수

// // const instance = axios.create({
// //   baseURL: import.meta.env.VITE_BASEURL + '/api',
// //   headers: {'Content-Type': 'application/json'},
// //   timeout: 4000,
// // });

// // // 요청 인터셉터 설정
// // instance.interceptors.request.use(
// //   async config => {
// //     const accessToken = localStorage.getItem('accessToken');

// //     if (accessToken) {
// //       config.headers['Authorization'] = `Bearer ${accessToken}`;
// //     }
// //     return config;
// //   },
// //   error => {
// //     return Promise.reject(error);
// //   }
// // );

// // // 응답 인터셉터 설정
// // instance.interceptors.response.use(
// //   response => response,
// //   async error => {
// //     const originalRequest = error.config;
// //     const refreshToken = getCookie('refreshToken');
// //     if (
// //       error.response &&
// //       error.response.status === 401 &&
// //       !originalRequest._retry
// //     ) {
// //       originalRequest._retry = true;

// //       if (!refreshToken) {
// //         console.error('No refresh token available');

// //         return Promise.reject(error);
// //       }

// //       try {
// //         const refreshToken = localStorage.getItem('refreshToken');
// //         const response = await instance.get(`/reissue/token`, {
// //           headers: {Authorization: refreshToken},
// //         });

// //         if (response) {
// //           console.log('response', response);
// //           const newAccessToken = response.data.accessToken;
// //           localStorage.setItem('accessToken', newAccessToken);

// //           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
// //           return instance(originalRequest);
// //         }
// //       } catch (refreshError) {
// //         console.error('Failed to refresh access token:', refreshError);
// //         localStorage.removeItem('accessToken');
// //         localStorage.removeItem('refreshToken');
// //         window.location.href = '/entrance';
// //       }
// //     }
// //     return Promise.reject(error);
// //   }
// // );

// // export default instance;

// 쿠키로 시도
import axios from 'axios';
import {getCookie, removeCookie, setCookie, logout} from './cookie';
// axios 인스턴스를 반환하는 함수

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASEURL + '/api',
  headers: {'Content-Type': 'application/json'},
  timeout: 4000,
});

// 요청 인터셉터 설정
instance.interceptors.request.use(
  async config => {
    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refresh_token');
    // console.log('[*] 요청 인터셉터 설정', refreshToken);
    // console.log('[*] accessToken', accessToken);
    // console.log('[*] refreshToken', getCookie('refresh_token'));

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    // console.log('[*] 요청 인터셉터 설정 에러', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // console.log('[*] 응답 인터셉터 설정');
    const refreshToken = getCookie('refresh_token');
    // console.log('refreshToken', refreshToken);
    // console.log('[*] 응답 인터셉터 error', error);

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // console.log('[*] 재시도 중', error.response);

      originalRequest._retry = true;

      if (!refreshToken) {
        console.error('No refresh token available');
        // console.log('[*] 리프레시 토큰 없음, 로그인 페이지로 이동');
        window.location.href = '/entrance';
        return Promise.reject(error);
      }

      try {
        const refreshToken = getCookie('refresh_token');
        // console.log('[*] refreshToken 통해 accessToken 재발급', refreshToken);
        const response = await instance.post(`/reissue/token`, {
          headers: {Authorization: `Bearer ${refreshToken}`},
        });

        if (response) {
          // console.log('response', response);
          const newAccessToken = response.data.accessToken;
          // console.log('newAccessToken', newAccessToken);
          setCookie('accessToken', newAccessToken, 900);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Failed to refresh access token:', refreshError);
        // sessionStorage.clear()
        // localStorage.clear()
        logout()
        window.location.href = '/entrance';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
