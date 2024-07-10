import CircularProgress from "@mui/material/CircularProgress";
import { Suspense, useCallback } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate, useRoutes } from "react-router-dom";

import { Sidebar } from "@/pages/menu";
import Login from "@/pages/login-register/login";
import Register from "@/pages/login-register/register";
import type { routerConfigType } from "./routerConfigType";
const routeConfig: routerConfigType[] = [
  {
    path: "/",
    auth: ["", "USER", "ADMIN", "DIRECTIOR", "DOCTOR"],
    children: [
      {
        path: "",
        auth: ["", "USER", "ADMIN", "DIRECTIOR", "DOCTOR"],
        element: <Navigate to="login" replace />,
      },
      {
        path: "info",
        auth: ["", "USER", "ADMIN", "DIRECTIOR", "DOCTOR"],
        children: [
          {
            path: "test",
            auth: ["", "USER", "DIRECTIOR", "DOCTOR"],
            element: (
              <Suspense fallback={<CircularProgress size="40" />}>
                <div>概览</div>
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "login",
    auth: ["", "USER", "ADMIN", "DIRECTIOR", "DOCTOR"],
    element: (
      <Suspense fallback={<CircularProgress size="40" />}>
        <Login></Login>
      </Suspense>
    ),
  },
  {
    path: "register",
    auth: ["", "USER", "ADMIN", "DIRECTIOR", "DOCTOR"],
    element: (
      <Suspense fallback={<CircularProgress size="40" />}>
        <Register></Register>
      </Suspense>
    ),
  },
  {
    path: "index",
    auth: ["USER", "ADMIN", "DIRECTIOR", "DOCTOR"],
    element: (
      <Suspense fallback={<CircularProgress size="40" />}>
        <Sidebar />
      </Suspense>
    ),
  },
  {
    path: "404",
    element: <div>路径错误,用户未登录或用户权限不够</div>,
  },
];

// 这个MyRoutes是用来处理上面的路由表的，
// 上面路由表中有auth，MyRoutes就是用来根据auth来重新塑造一个路由表
// 新的路由表会将当前没有权限的路由的element属性值全部换成404页面
function MyRoutes() {
  const currentUserType = localStorage.getItem("role") || ""; // 如果角色未设置，默认为空字符串

  const checkAuth = (auth: string[], currentUserType: string) => {
    return auth.includes(currentUserType);
  };
  
  const transformRoutes = useCallback(
    (routeList: typeof routeConfig): RouteObject[] => {
      return routeList
        .filter((route: routerConfigType) => route.path !== undefined) // 过滤掉没有 path 的路由
        .map((route: routerConfigType): RouteObject => {
          const routeElement = { ...route };
          console.log(route.path);
          if (
            route.path !== "404" &&
            route.auth &&
            !checkAuth(route.auth, currentUserType)
          ) {
            routeElement.element = <Navigate to="/404" replace />;
          }

          if (route.children) {
            routeElement.children = transformRoutes(route.children);
          }

          return routeElement;
        });
    },
    [currentUserType] // 保证当用户类型改变时，此函数也会重新生成
  );

  const getRoutes = useRoutes(transformRoutes(routeConfig));
  console.log(getRoutes);
  return <>{getRoutes}</>;
}
export default MyRoutes;

