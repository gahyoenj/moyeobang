import React, {useEffect} from 'react';
import {createRootRoute, Outlet} from '@tanstack/react-router';
// import {TanStackRouterDevtools} from '@tanstack/router-devtools';
import {ConnectAccountProvider} from '@/contexts/ConnectAccount';
import {setupForegroundNotificationHandler} from '@/services/notificationService';

export const Route = createRootRoute({
  component: () => {
    useEffect(() => {
      setupForegroundNotificationHandler(); // 포그라운드 메시지 수신 설정
    }, []);

    return (
        <ConnectAccountProvider>
          <Outlet />
          {/* <TanStackRouterDevtools /> */}
        </ConnectAccountProvider>
    );
  },
});
