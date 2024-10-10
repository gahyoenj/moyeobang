import {createFileRoute, Outlet, useNavigate} from '@tanstack/react-router';
import {getCookie} from '@/util/cookie';
import React, {useEffect} from 'react';

// 로그인 된 사용자 아닐시 entrance로 이동
// 로그인 여부를 확인하는 함수
const isAuthenticated = () => {
  // console.log('accessToken', getCookie('accessToken'));

  return Boolean(getCookie('accessToken'));
};

export const Route = createFileRoute('/_layout/_protected')({
  component: Protected,
});

function Protected() {
  const navigate = useNavigate();

  // [todo] 주석 풀기
  useEffect(() => {
    const isLogin = isAuthenticated();
    if (!isLogin) {
      navigate({to: '/entrance', replace: true});
    }
  }, [navigate]);

  return <Outlet />;
}
