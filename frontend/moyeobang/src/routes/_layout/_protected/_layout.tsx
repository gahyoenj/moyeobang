import {createFileRoute, Outlet, useLocation} from '@tanstack/react-router';
import HeaderWithAlarmAndQR from '@/components/common/Header/HeaderWithAlarmAndQR';
import React from 'react';
import {css} from '@emotion/react';
import {useState} from 'react';
import PayModal from '@/components/Account/QR/PayModal';
import NotificationModal from '@/components/notification/NotificationModal';
import useCurrentTravelStore from '@/store/useCurrentTravelStore';
import NotTravelModal from '@/components/Account/QR/NotTravelModal';
import useTravelDetailStore from '@/store/useTravelDetailStore';


export const Route = createFileRoute('/_layout/_protected/_layout')({
  component: Header,
});

const layoutStyle = css`
  display: flex;
  flex-direction: column;
`;

export default function Header() {

  const [isQROpen, setIsQROpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  
  const {pathname} = useLocation();
  const {accountId} = pathname==='/' ? useCurrentTravelStore() : useTravelDetailStore();
  // useTravelDetailStore()의 accountId 0일리 없음.

  const hideHeader =
    pathname.includes('/detail') ||
    pathname.includes('/settle') ||
    pathname === '/profile' ||
    pathname.includes('resultByReceipt');
  function handleAlarmClick() {
    setIsAlarmOpen(prev => !prev);
  }

  function handleQRClick() {
    setIsQROpen(prev => !prev);
  }

  return (
    <>
      {!hideHeader && (
        <HeaderWithAlarmAndQR
          onAlarmClick={handleAlarmClick}
          onQRClick={handleQRClick}
          isBack={pathname === '/account' || pathname === '/travelLog'}
        />
      )}

      <div css={layoutStyle}>
        {/* QR 모달이 열리면 PayModal만 렌더링하고 Outlet은 렌더링하지 않음 */}
        <>
          {isQROpen ? (
            accountId === 0 ? (
              <NotTravelModal onClickOutside={handleQRClick} />
            ) : (
              <PayModal onXClick={handleQRClick} />
            )
          ) : undefined}
        </>

        {/* Alarm 모달이 열리면 NotificationModal만 렌더링하고 Outlet은 렌더링하지 않음 */}
        {isAlarmOpen && <NotificationModal onClose={handleAlarmClick} />}

        {/* QR 또는 Alarm 모달이 열리지 않았을 때만 Outlet 렌더링 */}
        {!isQROpen && !isAlarmOpen && <Outlet />}
      </div>
    </>
  );
}
