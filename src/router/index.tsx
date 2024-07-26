// 外部库导入
import CircularProgress from '@mui/material/CircularProgress';
import { Suspense, useCallback } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, useRoutes } from 'react-router-dom';

import CreateUser from '@/pages/home/createUser';
import ValidateUser from '@/pages/home/validateUser';
// 绝对路径导入（假设以`@`开头的路径是通过别名配置的绝对路径）
import { Sidebar } from '@/pages/menu';

// 类型导入（通常放在相应的导入语句附近，但如果你想要遵循某种规则将它们分开，也可以将所有类型导入放在一起）
import type { routerConfigType } from './routerConfigType';

const routeConfig: routerConfigType[] = [
  {
    path: '/*',
    auth: ['', 'USER', 'ADMIN', 'DIRECTIOR', 'DOCTOR'],
    children: [
      {
        path: '',
        auth: ['', 'USER', 'ADMIN', 'DIRECTIOR', 'DOCTOR'],
        element: <Navigate to="register" replace />,
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

  // 添加登录路由
  {
    path: 'login',
    element: (
      <Suspense fallback={<CircularProgress size="40" />}>
        <ValidateUser />
      </Suspense>
    ),
  },

  // 添加注册路由
  {
    path: 'register',
    element: (
      <Suspense fallback={<CircularProgress size="40" />}>
        <CreateUser />
      </Suspense>
    ),
  },

  {
    path: '404',
    element: <div>路径错误,用户未登录或用户权限不够</div>,
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
