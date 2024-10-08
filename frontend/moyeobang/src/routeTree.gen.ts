/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LayoutImport } from './routes/_layout'
import { Route as PosIndexImport } from './routes/pos/index'
import { Route as HotelIndexImport } from './routes/hotel/index'
import { Route as AirportIndexImport } from './routes/airport/index'
import { Route as LayoutProtectedImport } from './routes/_layout/_protected'
import { Route as LayoutEntranceIndexImport } from './routes/_layout/entrance/index'
import { Route as LayoutProtectedLayoutImport } from './routes/_layout/_protected/_layout'
import { Route as LayoutEntranceSuccessIndexImport } from './routes/_layout/entrance/success/index'
import { Route as LayoutProtectedLayoutTravelLogIndexImport } from './routes/_layout/_protected/_layout/travelLog/index'
import { Route as LayoutProtectedLayoutAccountConnectIndexImport } from './routes/_layout/_protected/_layout/accountConnect/index'
import { Route as LayoutProtectedLayoutAccountIndexImport } from './routes/_layout/_protected/_layout/account/index'
import { Route as LayoutProtectedLayoutQuizTravelIdImport } from './routes/_layout/_protected/_layout/quiz/$travelId'
import { Route as LayoutProtectedLayoutProfileMemberNameImport } from './routes/_layout/_protected/_layout/profile/$memberName'
import { Route as LayoutProtectedLayoutQuizInviteTravelIdImport } from './routes/_layout/_protected/_layout/quiz/invite/$travelId'
import { Route as LayoutProtectedLayoutAccountTransactionIdSettleIndexImport } from './routes/_layout/_protected/_layout/account/$transactionId/settle/index'
import { Route as LayoutProtectedLayoutAccountTransactionIdDetailLayoutImport } from './routes/_layout/_protected/_layout/account/$transactionId/detail/_layout'
import { Route as LayoutProtectedLayoutAccountTransactionIdDetailLayoutIndexImport } from './routes/_layout/_protected/_layout/account/$transactionId/detail/_layout/index'

// Create Virtual Routes

const LayoutProtectedLayoutHomeIndexLazyImport = createFileRoute(
  '/_layout/_protected/_layout/_Home/',
)()
const LayoutProtectedLayoutAccountTransactionIdDetailImport = createFileRoute(
  '/_layout/_protected/_layout/account/$transactionId/detail',
)()

// Create/Update Routes

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const PosIndexRoute = PosIndexImport.update({
  path: '/pos/',
  getParentRoute: () => rootRoute,
} as any)

const HotelIndexRoute = HotelIndexImport.update({
  path: '/hotel/',
  getParentRoute: () => rootRoute,
} as any)

const AirportIndexRoute = AirportIndexImport.update({
  path: '/airport/',
  getParentRoute: () => rootRoute,
} as any)

const LayoutProtectedRoute = LayoutProtectedImport.update({
  id: '/_protected',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutEntranceIndexRoute = LayoutEntranceIndexImport.update({
  path: '/entrance/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutProtectedLayoutRoute = LayoutProtectedLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => LayoutProtectedRoute,
} as any)

const LayoutEntranceSuccessIndexRoute = LayoutEntranceSuccessIndexImport.update(
  {
    path: '/entrance/success/',
    getParentRoute: () => LayoutRoute,
  } as any,
)

const LayoutProtectedLayoutHomeIndexLazyRoute =
  LayoutProtectedLayoutHomeIndexLazyImport.update({
    path: '/',
    getParentRoute: () => LayoutProtectedLayoutRoute,
  } as any).lazy(() =>
    import('./routes/_layout/_protected/_layout/_Home/index.lazy').then(
      (d) => d.Route,
    ),
  )

const LayoutProtectedLayoutTravelLogIndexRoute =
  LayoutProtectedLayoutTravelLogIndexImport.update({
    path: '/travelLog/',
    getParentRoute: () => LayoutProtectedLayoutRoute,
  } as any)

const LayoutProtectedLayoutAccountConnectIndexRoute =
  LayoutProtectedLayoutAccountConnectIndexImport.update({
    path: '/accountConnect/',
    getParentRoute: () => LayoutProtectedLayoutRoute,
  } as any)

const LayoutProtectedLayoutAccountIndexRoute =
  LayoutProtectedLayoutAccountIndexImport.update({
    path: '/account/',
    getParentRoute: () => LayoutProtectedLayoutRoute,
  } as any)

const LayoutProtectedLayoutQuizTravelIdRoute =
  LayoutProtectedLayoutQuizTravelIdImport.update({
    path: '/quiz/$travelId',
    getParentRoute: () => LayoutProtectedLayoutRoute,
  } as any)

const LayoutProtectedLayoutProfileMemberNameRoute =
  LayoutProtectedLayoutProfileMemberNameImport.update({
    path: '/profile/$memberName',
    getParentRoute: () => LayoutProtectedLayoutRoute,
  } as any)

const LayoutProtectedLayoutAccountTransactionIdDetailRoute =
  LayoutProtectedLayoutAccountTransactionIdDetailImport.update({
    path: '/account/$transactionId/detail',
    getParentRoute: () => LayoutProtectedLayoutRoute,
  } as any)

const LayoutProtectedLayoutQuizInviteTravelIdRoute =
  LayoutProtectedLayoutQuizInviteTravelIdImport.update({
    path: '/quiz/invite/$travelId',
    getParentRoute: () => LayoutProtectedLayoutRoute,
  } as any)

const LayoutProtectedLayoutAccountTransactionIdSettleIndexRoute =
  LayoutProtectedLayoutAccountTransactionIdSettleIndexImport.update({
    path: '/account/$transactionId/settle/',
    getParentRoute: () => LayoutProtectedLayoutRoute,
  } as any)

const LayoutProtectedLayoutAccountTransactionIdDetailLayoutRoute =
  LayoutProtectedLayoutAccountTransactionIdDetailLayoutImport.update({
    id: '/_layout',
    getParentRoute: () => LayoutProtectedLayoutAccountTransactionIdDetailRoute,
  } as any)

const LayoutProtectedLayoutAccountTransactionIdDetailLayoutIndexRoute =
  LayoutProtectedLayoutAccountTransactionIdDetailLayoutIndexImport.update({
    path: '/',
    getParentRoute: () =>
      LayoutProtectedLayoutAccountTransactionIdDetailLayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/_layout/_protected': {
      id: '/_layout/_protected'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutProtectedImport
      parentRoute: typeof LayoutImport
    }
    '/airport/': {
      id: '/airport/'
      path: '/airport'
      fullPath: '/airport'
      preLoaderRoute: typeof AirportIndexImport
      parentRoute: typeof rootRoute
    }
    '/hotel/': {
      id: '/hotel/'
      path: '/hotel'
      fullPath: '/hotel'
      preLoaderRoute: typeof HotelIndexImport
      parentRoute: typeof rootRoute
    }
    '/pos/': {
      id: '/pos/'
      path: '/pos'
      fullPath: '/pos'
      preLoaderRoute: typeof PosIndexImport
      parentRoute: typeof rootRoute
    }
    '/_layout/_protected/_layout': {
      id: '/_layout/_protected/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutProtectedLayoutImport
      parentRoute: typeof LayoutProtectedImport
    }
    '/_layout/entrance/': {
      id: '/_layout/entrance/'
      path: '/entrance'
      fullPath: '/entrance'
      preLoaderRoute: typeof LayoutEntranceIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/entrance/success/': {
      id: '/_layout/entrance/success/'
      path: '/entrance/success'
      fullPath: '/entrance/success'
      preLoaderRoute: typeof LayoutEntranceSuccessIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/_protected/_layout/profile/$memberName': {
      id: '/_layout/_protected/_layout/profile/$memberName'
      path: '/profile/$memberName'
      fullPath: '/profile/$memberName'
      preLoaderRoute: typeof LayoutProtectedLayoutProfileMemberNameImport
      parentRoute: typeof LayoutProtectedLayoutImport
    }
    '/_layout/_protected/_layout/quiz/$travelId': {
      id: '/_layout/_protected/_layout/quiz/$travelId'
      path: '/quiz/$travelId'
      fullPath: '/quiz/$travelId'
      preLoaderRoute: typeof LayoutProtectedLayoutQuizTravelIdImport
      parentRoute: typeof LayoutProtectedLayoutImport
    }
    '/_layout/_protected/_layout/account/': {
      id: '/_layout/_protected/_layout/account/'
      path: '/account'
      fullPath: '/account'
      preLoaderRoute: typeof LayoutProtectedLayoutAccountIndexImport
      parentRoute: typeof LayoutProtectedLayoutImport
    }
    '/_layout/_protected/_layout/accountConnect/': {
      id: '/_layout/_protected/_layout/accountConnect/'
      path: '/accountConnect'
      fullPath: '/accountConnect'
      preLoaderRoute: typeof LayoutProtectedLayoutAccountConnectIndexImport
      parentRoute: typeof LayoutProtectedLayoutImport
    }
    '/_layout/_protected/_layout/travelLog/': {
      id: '/_layout/_protected/_layout/travelLog/'
      path: '/travelLog'
      fullPath: '/travelLog'
      preLoaderRoute: typeof LayoutProtectedLayoutTravelLogIndexImport
      parentRoute: typeof LayoutProtectedLayoutImport
    }
    '/_layout/_protected/_layout/_Home/': {
      id: '/_layout/_protected/_layout/_Home/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof LayoutProtectedLayoutHomeIndexLazyImport
      parentRoute: typeof LayoutProtectedLayoutImport
    }
    '/_layout/_protected/_layout/quiz/invite/$travelId': {
      id: '/_layout/_protected/_layout/quiz/invite/$travelId'
      path: '/quiz/invite/$travelId'
      fullPath: '/quiz/invite/$travelId'
      preLoaderRoute: typeof LayoutProtectedLayoutQuizInviteTravelIdImport
      parentRoute: typeof LayoutProtectedLayoutImport
    }
    '/_layout/_protected/_layout/account/$transactionId/detail': {
      id: '/_layout/_protected/_layout/account/$transactionId/detail'
      path: '/account/$transactionId/detail'
      fullPath: '/account/$transactionId/detail'
      preLoaderRoute: typeof LayoutProtectedLayoutAccountTransactionIdDetailImport
      parentRoute: typeof LayoutProtectedLayoutImport
    }
    '/_layout/_protected/_layout/account/$transactionId/detail/_layout': {
      id: '/_layout/_protected/_layout/account/$transactionId/detail/_layout'
      path: '/account/$transactionId/detail'
      fullPath: '/account/$transactionId/detail'
      preLoaderRoute: typeof LayoutProtectedLayoutAccountTransactionIdDetailLayoutImport
      parentRoute: typeof LayoutProtectedLayoutAccountTransactionIdDetailRoute
    }
    '/_layout/_protected/_layout/account/$transactionId/settle/': {
      id: '/_layout/_protected/_layout/account/$transactionId/settle/'
      path: '/account/$transactionId/settle'
      fullPath: '/account/$transactionId/settle'
      preLoaderRoute: typeof LayoutProtectedLayoutAccountTransactionIdSettleIndexImport
      parentRoute: typeof LayoutProtectedLayoutImport
    }
    '/_layout/_protected/_layout/account/$transactionId/detail/_layout/': {
      id: '/_layout/_protected/_layout/account/$transactionId/detail/_layout/'
      path: '/'
      fullPath: '/account/$transactionId/detail/'
      preLoaderRoute: typeof LayoutProtectedLayoutAccountTransactionIdDetailLayoutIndexImport
      parentRoute: typeof LayoutProtectedLayoutAccountTransactionIdDetailLayoutImport
    }
  }
}

// Create and export the route tree

interface LayoutProtectedLayoutAccountTransactionIdDetailLayoutRouteChildren {
  LayoutProtectedLayoutAccountTransactionIdDetailLayoutIndexRoute: typeof LayoutProtectedLayoutAccountTransactionIdDetailLayoutIndexRoute
}

const LayoutProtectedLayoutAccountTransactionIdDetailLayoutRouteChildren: LayoutProtectedLayoutAccountTransactionIdDetailLayoutRouteChildren =
  {
    LayoutProtectedLayoutAccountTransactionIdDetailLayoutIndexRoute:
      LayoutProtectedLayoutAccountTransactionIdDetailLayoutIndexRoute,
  }

const LayoutProtectedLayoutAccountTransactionIdDetailLayoutRouteWithChildren =
  LayoutProtectedLayoutAccountTransactionIdDetailLayoutRoute._addFileChildren(
    LayoutProtectedLayoutAccountTransactionIdDetailLayoutRouteChildren,
  )

interface LayoutProtectedLayoutAccountTransactionIdDetailRouteChildren {
  LayoutProtectedLayoutAccountTransactionIdDetailLayoutRoute: typeof LayoutProtectedLayoutAccountTransactionIdDetailLayoutRouteWithChildren
}

const LayoutProtectedLayoutAccountTransactionIdDetailRouteChildren: LayoutProtectedLayoutAccountTransactionIdDetailRouteChildren =
  {
    LayoutProtectedLayoutAccountTransactionIdDetailLayoutRoute:
      LayoutProtectedLayoutAccountTransactionIdDetailLayoutRouteWithChildren,
  }

const LayoutProtectedLayoutAccountTransactionIdDetailRouteWithChildren =
  LayoutProtectedLayoutAccountTransactionIdDetailRoute._addFileChildren(
    LayoutProtectedLayoutAccountTransactionIdDetailRouteChildren,
  )

interface LayoutProtectedLayoutRouteChildren {
  LayoutProtectedLayoutProfileMemberNameRoute: typeof LayoutProtectedLayoutProfileMemberNameRoute
  LayoutProtectedLayoutQuizTravelIdRoute: typeof LayoutProtectedLayoutQuizTravelIdRoute
  LayoutProtectedLayoutAccountIndexRoute: typeof LayoutProtectedLayoutAccountIndexRoute
  LayoutProtectedLayoutAccountConnectIndexRoute: typeof LayoutProtectedLayoutAccountConnectIndexRoute
  LayoutProtectedLayoutTravelLogIndexRoute: typeof LayoutProtectedLayoutTravelLogIndexRoute
  LayoutProtectedLayoutHomeIndexLazyRoute: typeof LayoutProtectedLayoutHomeIndexLazyRoute
  LayoutProtectedLayoutQuizInviteTravelIdRoute: typeof LayoutProtectedLayoutQuizInviteTravelIdRoute
  LayoutProtectedLayoutAccountTransactionIdDetailRoute: typeof LayoutProtectedLayoutAccountTransactionIdDetailRouteWithChildren
  LayoutProtectedLayoutAccountTransactionIdSettleIndexRoute: typeof LayoutProtectedLayoutAccountTransactionIdSettleIndexRoute
}

const LayoutProtectedLayoutRouteChildren: LayoutProtectedLayoutRouteChildren = {
  LayoutProtectedLayoutProfileMemberNameRoute:
    LayoutProtectedLayoutProfileMemberNameRoute,
  LayoutProtectedLayoutQuizTravelIdRoute:
    LayoutProtectedLayoutQuizTravelIdRoute,
  LayoutProtectedLayoutAccountIndexRoute:
    LayoutProtectedLayoutAccountIndexRoute,
  LayoutProtectedLayoutAccountConnectIndexRoute:
    LayoutProtectedLayoutAccountConnectIndexRoute,
  LayoutProtectedLayoutTravelLogIndexRoute:
    LayoutProtectedLayoutTravelLogIndexRoute,
  LayoutProtectedLayoutHomeIndexLazyRoute:
    LayoutProtectedLayoutHomeIndexLazyRoute,
  LayoutProtectedLayoutQuizInviteTravelIdRoute:
    LayoutProtectedLayoutQuizInviteTravelIdRoute,
  LayoutProtectedLayoutAccountTransactionIdDetailRoute:
    LayoutProtectedLayoutAccountTransactionIdDetailRouteWithChildren,
  LayoutProtectedLayoutAccountTransactionIdSettleIndexRoute:
    LayoutProtectedLayoutAccountTransactionIdSettleIndexRoute,
}

const LayoutProtectedLayoutRouteWithChildren =
  LayoutProtectedLayoutRoute._addFileChildren(
    LayoutProtectedLayoutRouteChildren,
  )

interface LayoutProtectedRouteChildren {
  LayoutProtectedLayoutRoute: typeof LayoutProtectedLayoutRouteWithChildren
}

const LayoutProtectedRouteChildren: LayoutProtectedRouteChildren = {
  LayoutProtectedLayoutRoute: LayoutProtectedLayoutRouteWithChildren,
}

const LayoutProtectedRouteWithChildren = LayoutProtectedRoute._addFileChildren(
  LayoutProtectedRouteChildren,
)

interface LayoutRouteChildren {
  LayoutProtectedRoute: typeof LayoutProtectedRouteWithChildren
  LayoutEntranceIndexRoute: typeof LayoutEntranceIndexRoute
  LayoutEntranceSuccessIndexRoute: typeof LayoutEntranceSuccessIndexRoute
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutProtectedRoute: LayoutProtectedRouteWithChildren,
  LayoutEntranceIndexRoute: LayoutEntranceIndexRoute,
  LayoutEntranceSuccessIndexRoute: LayoutEntranceSuccessIndexRoute,
}

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof LayoutProtectedLayoutRouteWithChildren
  '/airport': typeof AirportIndexRoute
  '/hotel': typeof HotelIndexRoute
  '/pos': typeof PosIndexRoute
  '/entrance': typeof LayoutEntranceIndexRoute
  '/entrance/success': typeof LayoutEntranceSuccessIndexRoute
  '/profile/$memberName': typeof LayoutProtectedLayoutProfileMemberNameRoute
  '/quiz/$travelId': typeof LayoutProtectedLayoutQuizTravelIdRoute
  '/account': typeof LayoutProtectedLayoutAccountIndexRoute
  '/accountConnect': typeof LayoutProtectedLayoutAccountConnectIndexRoute
  '/travelLog': typeof LayoutProtectedLayoutTravelLogIndexRoute
  '/': typeof LayoutProtectedLayoutHomeIndexLazyRoute
  '/quiz/invite/$travelId': typeof LayoutProtectedLayoutQuizInviteTravelIdRoute
  '/account/$transactionId/detail': typeof LayoutProtectedLayoutAccountTransactionIdDetailLayoutRouteWithChildren
  '/account/$transactionId/settle': typeof LayoutProtectedLayoutAccountTransactionIdSettleIndexRoute
  '/account/$transactionId/detail/': typeof LayoutProtectedLayoutAccountTransactionIdDetailLayoutIndexRoute
}

export interface FileRoutesByTo {
  '': typeof LayoutProtectedRouteWithChildren
  '/airport': typeof AirportIndexRoute
  '/hotel': typeof HotelIndexRoute
  '/pos': typeof PosIndexRoute
  '/entrance': typeof LayoutEntranceIndexRoute
  '/entrance/success': typeof LayoutEntranceSuccessIndexRoute
  '/profile/$memberName': typeof LayoutProtectedLayoutProfileMemberNameRoute
  '/quiz/$travelId': typeof LayoutProtectedLayoutQuizTravelIdRoute
  '/account': typeof LayoutProtectedLayoutAccountIndexRoute
  '/accountConnect': typeof LayoutProtectedLayoutAccountConnectIndexRoute
  '/travelLog': typeof LayoutProtectedLayoutTravelLogIndexRoute
  '/': typeof LayoutProtectedLayoutHomeIndexLazyRoute
  '/quiz/invite/$travelId': typeof LayoutProtectedLayoutQuizInviteTravelIdRoute
  '/account/$transactionId/detail': typeof LayoutProtectedLayoutAccountTransactionIdDetailLayoutIndexRoute
  '/account/$transactionId/settle': typeof LayoutProtectedLayoutAccountTransactionIdSettleIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_layout': typeof LayoutRouteWithChildren
  '/_layout/_protected': typeof LayoutProtectedRouteWithChildren
  '/airport/': typeof AirportIndexRoute
  '/hotel/': typeof HotelIndexRoute
  '/pos/': typeof PosIndexRoute
  '/_layout/_protected/_layout': typeof LayoutProtectedLayoutRouteWithChildren
  '/_layout/entrance/': typeof LayoutEntranceIndexRoute
  '/_layout/entrance/success/': typeof LayoutEntranceSuccessIndexRoute
  '/_layout/_protected/_layout/profile/$memberName': typeof LayoutProtectedLayoutProfileMemberNameRoute
  '/_layout/_protected/_layout/quiz/$travelId': typeof LayoutProtectedLayoutQuizTravelIdRoute
  '/_layout/_protected/_layout/account/': typeof LayoutProtectedLayoutAccountIndexRoute
  '/_layout/_protected/_layout/accountConnect/': typeof LayoutProtectedLayoutAccountConnectIndexRoute
  '/_layout/_protected/_layout/travelLog/': typeof LayoutProtectedLayoutTravelLogIndexRoute
  '/_layout/_protected/_layout/_Home/': typeof LayoutProtectedLayoutHomeIndexLazyRoute
  '/_layout/_protected/_layout/quiz/invite/$travelId': typeof LayoutProtectedLayoutQuizInviteTravelIdRoute
  '/_layout/_protected/_layout/account/$transactionId/detail': typeof LayoutProtectedLayoutAccountTransactionIdDetailRouteWithChildren
  '/_layout/_protected/_layout/account/$transactionId/detail/_layout': typeof LayoutProtectedLayoutAccountTransactionIdDetailLayoutRouteWithChildren
  '/_layout/_protected/_layout/account/$transactionId/settle/': typeof LayoutProtectedLayoutAccountTransactionIdSettleIndexRoute
  '/_layout/_protected/_layout/account/$transactionId/detail/_layout/': typeof LayoutProtectedLayoutAccountTransactionIdDetailLayoutIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/airport'
    | '/hotel'
    | '/pos'
    | '/entrance'
    | '/entrance/success'
    | '/profile/$memberName'
    | '/quiz/$travelId'
    | '/account'
    | '/accountConnect'
    | '/travelLog'
    | '/'
    | '/quiz/invite/$travelId'
    | '/account/$transactionId/detail'
    | '/account/$transactionId/settle'
    | '/account/$transactionId/detail/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | ''
    | '/airport'
    | '/hotel'
    | '/pos'
    | '/entrance'
    | '/entrance/success'
    | '/profile/$memberName'
    | '/quiz/$travelId'
    | '/account'
    | '/accountConnect'
    | '/travelLog'
    | '/'
    | '/quiz/invite/$travelId'
    | '/account/$transactionId/detail'
    | '/account/$transactionId/settle'
  id:
    | '__root__'
    | '/_layout'
    | '/_layout/_protected'
    | '/airport/'
    | '/hotel/'
    | '/pos/'
    | '/_layout/_protected/_layout'
    | '/_layout/entrance/'
    | '/_layout/entrance/success/'
    | '/_layout/_protected/_layout/profile/$memberName'
    | '/_layout/_protected/_layout/quiz/$travelId'
    | '/_layout/_protected/_layout/account/'
    | '/_layout/_protected/_layout/accountConnect/'
    | '/_layout/_protected/_layout/travelLog/'
    | '/_layout/_protected/_layout/_Home/'
    | '/_layout/_protected/_layout/quiz/invite/$travelId'
    | '/_layout/_protected/_layout/account/$transactionId/detail'
    | '/_layout/_protected/_layout/account/$transactionId/detail/_layout'
    | '/_layout/_protected/_layout/account/$transactionId/settle/'
    | '/_layout/_protected/_layout/account/$transactionId/detail/_layout/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  LayoutRoute: typeof LayoutRouteWithChildren
  AirportIndexRoute: typeof AirportIndexRoute
  HotelIndexRoute: typeof HotelIndexRoute
  PosIndexRoute: typeof PosIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  LayoutRoute: LayoutRouteWithChildren,
  AirportIndexRoute: AirportIndexRoute,
  HotelIndexRoute: HotelIndexRoute,
  PosIndexRoute: PosIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_layout",
        "/airport/",
        "/hotel/",
        "/pos/"
      ]
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/_protected",
        "/_layout/entrance/",
        "/_layout/entrance/success/"
      ]
    },
    "/_layout/_protected": {
      "filePath": "_layout/_protected.tsx",
      "parent": "/_layout",
      "children": [
        "/_layout/_protected/_layout"
      ]
    },
    "/airport/": {
      "filePath": "airport/index.tsx"
    },
    "/hotel/": {
      "filePath": "hotel/index.tsx"
    },
    "/pos/": {
      "filePath": "pos/index.tsx"
    },
    "/_layout/_protected/_layout": {
      "filePath": "_layout/_protected/_layout.tsx",
      "parent": "/_layout/_protected",
      "children": [
        "/_layout/_protected/_layout/profile/$memberName",
        "/_layout/_protected/_layout/quiz/$travelId",
        "/_layout/_protected/_layout/account/",
        "/_layout/_protected/_layout/accountConnect/",
        "/_layout/_protected/_layout/travelLog/",
        "/_layout/_protected/_layout/_Home/",
        "/_layout/_protected/_layout/quiz/invite/$travelId",
        "/_layout/_protected/_layout/account/$transactionId/detail",
        "/_layout/_protected/_layout/account/$transactionId/settle/"
      ]
    },
    "/_layout/entrance/": {
      "filePath": "_layout/entrance/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/entrance/success/": {
      "filePath": "_layout/entrance/success/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/_protected/_layout/profile/$memberName": {
      "filePath": "_layout/_protected/_layout/profile/$memberName.tsx",
      "parent": "/_layout/_protected/_layout"
    },
    "/_layout/_protected/_layout/quiz/$travelId": {
      "filePath": "_layout/_protected/_layout/quiz/$travelId.tsx",
      "parent": "/_layout/_protected/_layout"
    },
    "/_layout/_protected/_layout/account/": {
      "filePath": "_layout/_protected/_layout/account/index.tsx",
      "parent": "/_layout/_protected/_layout"
    },
    "/_layout/_protected/_layout/accountConnect/": {
      "filePath": "_layout/_protected/_layout/accountConnect/index.tsx",
      "parent": "/_layout/_protected/_layout"
    },
    "/_layout/_protected/_layout/travelLog/": {
      "filePath": "_layout/_protected/_layout/travelLog/index.tsx",
      "parent": "/_layout/_protected/_layout"
    },
    "/_layout/_protected/_layout/_Home/": {
      "filePath": "_layout/_protected/_layout/_Home/index.lazy.tsx",
      "parent": "/_layout/_protected/_layout"
    },
    "/_layout/_protected/_layout/quiz/invite/$travelId": {
      "filePath": "_layout/_protected/_layout/quiz/invite/$travelId.tsx",
      "parent": "/_layout/_protected/_layout"
    },
    "/_layout/_protected/_layout/account/$transactionId/detail": {
      "filePath": "_layout/_protected/_layout/account/$transactionId/detail",
      "parent": "/_layout/_protected/_layout",
      "children": [
        "/_layout/_protected/_layout/account/$transactionId/detail/_layout"
      ]
    },
    "/_layout/_protected/_layout/account/$transactionId/detail/_layout": {
      "filePath": "_layout/_protected/_layout/account/$transactionId/detail/_layout.tsx",
      "parent": "/_layout/_protected/_layout/account/$transactionId/detail",
      "children": [
        "/_layout/_protected/_layout/account/$transactionId/detail/_layout/"
      ]
    },
    "/_layout/_protected/_layout/account/$transactionId/settle/": {
      "filePath": "_layout/_protected/_layout/account/$transactionId/settle/index.tsx",
      "parent": "/_layout/_protected/_layout"
    },
    "/_layout/_protected/_layout/account/$transactionId/detail/_layout/": {
      "filePath": "_layout/_protected/_layout/account/$transactionId/detail/_layout/index.tsx",
      "parent": "/_layout/_protected/_layout/account/$transactionId/detail/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
