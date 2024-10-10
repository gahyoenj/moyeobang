// 쿠키로 시도
import React, {useEffect, useState} from 'react';
import {css} from '@emotion/react';
import {
  createFileRoute,
  useNavigate,
  useLocation,
} from '@tanstack/react-router';
import {colors} from '@/styles/colors';
import bangBang from '@/assets/icons/bangBang.png';

import useMyInfo from '@/store/useMyInfoStore';
import axios from '@/util/axios';
import {getCookie, setCookie} from '@/util/cookie';
import {useQuery, useSuspenseQuery} from '@tanstack/react-query';

export const Route = createFileRoute('/_layout/entrance/success/')({
  component: LoginSuccess,
});

const layoutStyle = css`
  width: 390px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* margin: 120px 0; */

  #success-text {
    font-size: 32px;
    font-family: 'surround';
    margin: 30px;
    color: ${colors.fifth};
  }
`;

const spinnerImageStyle = css`
  width: 200px;
  height: 200px;

  /* 애니메이션 추가 */
  animation: bounce 0.7s infinite ease-in-out;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0); /* 원래 위치 */
    }
    50% {
      transform: translateY(-20px); /* 위로 20px 올라감 */
    }
  }
`;

function LoginSuccess() {
  const {
    setMemberId,
    setMemberName,
    setProfileImage,
    setBankName,
    setAccountNumber,
    setAccountId,
  } = useMyInfo();

  const navigate = useNavigate();
  const location = useLocation();
  // location 객체에서 쿼리 문자열을 가져옴

  const {data: myInfoResponse, refetch} = useQuery({
    queryKey: [],
    queryFn: () => axios.get('/user/me/profile'),
    refetchOnWindowFocus: false,
    enabled: false,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get('accessToken');
    const accessTokenExpireTime = searchParams.get('accessTokenExpireTime');
    const refreshToken = searchParams.get('refreshToken');
    const refreshTokenExpireTime = searchParams.get('refreshTokenExpireTime');
    if (accessToken) {
      setCookie('accessToken', accessToken);
      refetch();
    }
  }, [location.search]);

  useEffect(() => {
    if (myInfoResponse) {
      // console.log('myInfo', myInfoResponse);
      const myInfo = myInfoResponse?.data.data;
      setMemberId(myInfo.id);
      setMemberName(myInfo.name);
      setProfileImage(myInfo.image);
      setBankName(myInfo.bankName);
      setAccountNumber(myInfo.accountNumber);
      // 계좌 정보가 없으면 계좌 등록 페이지로 이동
      setAccountId(myInfo.accountId);
      navigate({to: '/'});
    }
  }, [myInfoResponse]);

  // 모든 쿼리 파라미터를 가져오기
  return (
    <>
      <div css={layoutStyle}>
        <div id="success-text">로그인 성공</div>
        <img css={spinnerImageStyle} src={bangBang} alt="" />
      </div>
    </>
  );
}
