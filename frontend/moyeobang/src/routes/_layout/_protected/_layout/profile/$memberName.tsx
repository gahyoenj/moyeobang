import {createFileRoute} from '@tanstack/react-router';
import {css} from '@emotion/react';
import {logout} from '@/util/cookie';
import useMyInfo from '@/store/useMyInfoStore';
import HeaderWithBackButton from '@/components/common/Header/HeaderWithBackButton';
import skyBackground from '@/assets/images/skyBackground.jpg';
import bangBang from '@/assets/icons/bangBang.png';
import {colors} from '@/styles/colors';
import React from 'react';
import SettingBox from '@/components/travelHome/SettingBox';
// import {useLocation} from '@tanstack/react-router';
import {useMatch, useNavigate} from '@tanstack/react-router';
import BackButton from '@/components/common/Header/ButtonIcon/BackButton';
import {useSuspenseQuery} from '@tanstack/react-query';
import moyeobang from '@/services/moyeobang';
import ProfileImage from '@/components/Account/ProfileImage/ProfileImage';

export const Route = createFileRoute(
  '/_layout/_protected/_layout/profile/$memberName'
)({
  component: profile,
});

const containerStyle = css`
  width: 100%;
  height: 100vh;
  background-image: url(${skyBackground});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
`;

const contentStyle = css`
  margin-top: 100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
`;

const profileStyle = (profileImage: string | null) => css`
  width: 130px;
  height: 130px;
  background-color: white;
  background-image: url(${profileImage ? profileImage : bangBang});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  border-radius: 50%;
  font-family: 'bold';
  font-size: 32px;
`;

const nicknameStyle = css`
  font-family: 'semibold';
  font-size: 24px;
  margin-bottom: 60px;
  margin-top: 10px;
`;

const backButtonStyle = css`
  background-color: transparent; /* 이 스타일이 우선적으로 적용됩니다 */
  z-index: 100;
  position: fixed;
  left: 0;
  margin-top: 5px;
`;

const blurStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  z-index: 1;
`;

const data: ResponseGetProfile = {
  memberId: 1,
  memberName: '진우바오',
  profileImage: 'https://example.com/images.jpg',
  accountId: 1,
  bankName: '싸피뱅크', // 일단 추가
  accountNumber: '123456789123', // 모여방과 연결된 계좌
};

export default function profile() {
  // useMatch를 사용해 URL 파라미터로 전달된 nickName 가져오기

  const {
    params: {memberName}, // URL 파라미터에서 nickName 가져오기
  } = useMatch({from: '/_layout/_protected/_layout/profile/$memberName'}); // 라우트와 매칭

  const navigate = useNavigate();

  const {
    setMemberId,
    setMemberName,
    setAccountId,
    setAccountNumber,
    setBankName,
    setProfileImage,
    accountNumber,
    profileImage,
  } = useMyInfo();
  const handleLogout = () => {
    // console.log('로그아웃');
    // 로그아웃 시 모든 상태 초기화
    // 쿠키 삭제
    logout();
    // 상태 초기화
    localStorage.clear();
    sessionStorage.clear();
    navigate({to: '/entrance'});
  };

  return (
    <>
      <div css={containerStyle}>
        <div css={backButtonStyle}>
          <BackButton />
          {/* <HeaderWithBackButton /> */}
        </div>
        <div css={contentStyle}>
          <div css={profileStyle(profileImage)}></div>
          <p css={nicknameStyle}>{memberName}</p>
          {/* Render multiple Box components */}
          <SettingBox title="정보수정" />
          <SettingBox
            title="연결계좌"
            description={accountNumber}
            updateButton="수정하기 >"
          />
          <SettingBox title="로그아웃" onClick={handleLogout} />
        </div>
        <div css={blurStyle}></div>
      </div>
    </>
  );
}
