import CircularProgress from '@mui/material/CircularProgress';
import { Suspense, useCallback } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, useRoutes } from 'react-router-dom';

import Login from '@/pages/login';
import { Sidebar } from '@/pages/menu';

import type { routerConfigType } from './routerConfigType';

const routeConfig: routerConfigType[] = [
  {
    path: '/*',
    auth: ['', 'USER', 'ADMIN', 'DIRECTIOR', 'DOCTOR'],
    children: [
      {
        path: '',
        auth: ['', 'USER', 'ADMIN', 'DIRECTIOR', 'DOCTOR'],
        element: <Navigate to="login" replace />,
      },
      {
        path: 'info',
        auth: ['', 'USER', 'ADMIN', 'DIRECTIOR', 'DOCTOR'],
        element: (
          <Suspense fallback={<CircularProgress size="40" />}>
            <div>概览</div>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: 'index',
    auth: ['USER', 'ADMIN', 'DIRECTIOR', 'DOCTOR'],
    element: (
      <Suspense fallback={<CircularProgress size="40" />}>
        <Sidebar />
      </Suspense>
    ),
  },
  {
    path: '404',
    element: <div>路径错误,用户未登录或用户权限不够</div>,
  },
  {
    path: 'login',
    element: (
      <Suspense fallback={<CircularProgress size="40" />}>
        <Login />
      </Suspense>
    ),
  },
];

function MyRoutes() {
  const currentUserType = 'ADMIN';
  /**
   * @description: 路由配置列表数据转换
   * @param {routeConfig} routeConfig 路由配置
   */
  const transformRoutes = useCallback(
    (routeList: typeof routeConfig) => {
      const list: RouteObject[] = [];
      routeList.forEach((route: routerConfigType) => {
        if (route.path === undefined) {
          return null;
        }
        if (
          route.path !== '404' &&
          route.auth !== undefined &&
          route.auth.find((item) => item === currentUserType) === undefined
        ) {
          route.element = <Navigate to="/404" replace></Navigate>;
        }
        if (route.children) {
          route.children = transformRoutes(route.children);
        }

        list.push(route);
      });
      return list;
    },
    [currentUserType],
  );

  const getRoutes = useRoutes(transformRoutes(routeConfig));
  return <>{getRoutes}</>;
}
export default MyRoutes;
