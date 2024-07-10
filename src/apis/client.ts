import {
  ApolloClient,
  ApolloLink,
  gql,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { print } from "graphql";
import jwt_decode from "jwt-decode";

const httpLink = new HttpLink({ uri: "http://localhost:7001/graphql" });
interface Decoded {
  exp: number;
}
// graphql操作
const RefreshToken = gql`
  mutation RefreshToken($refreshToken: JWT!) {
    refreshToken(token: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;

const requestURL = ["/register", "/login"];


const authLink = new ApolloLink((operation, forward) => {
  // 判断是否在登录或注册 如果登录注册则不需要加请求头
  // 这个判断isInclude的代码如果卸载函数外面
  // 那么它只会在项目启动时执行一次，而不是每次发送graphql请求就执行
  // 这会导致不能正确添加accessToken到请求头中
  //  这个问题可能是我使用的jwt-token实现方式与预设的不同的原因
  //  为此我将isInclude判断逻辑移动到了函数内部
  let isInclude = requestURL.includes(window.location.pathname);
  // 获取现有的token
  const token = localStorage.getItem("accessToken");
  // 如果存在并且没有过期，则将其添加到请求头中
  if (token && !isInclude) {
    const decoded: Decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.setItem("accessToken", "");
      return forward(operation);
    } else {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  return forward(operation);
});

const refreshAuthToken = async () => {
  // 获取refreshToken
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken && refreshToken !== "") {
    const decoded: Decoded = jwt_decode(refreshToken);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.setItem("refreshToken", "");
      localStorage.setItem("role", "");
      localStorage.setItem("username", "");
    } else {
      // 如果refreshtoken没过期
      // 查询 refreshToken
      const query = print(RefreshToken);
      const response = await fetch("http://localhost:7001/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: {
            refreshToken: `${refreshToken}`,
          },
        }),
      });
      // 解析响应
      const json = await response.json();
      // 更新accessToken
      const { accessToken: access, refreshToken: refresh } =
        json.data.refreshToken;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
    }
  }
};
// @ts-ignore
const errorLink = new ApolloLink((operation, forward) => {
  // 判断是否在登录或注册 如果登录注册则不需要加请求头
  let isInclude = requestURL.includes(window.location.pathname);
  if (isInclude) {
    return forward(operation);
  }
  return forward(operation).map((response) => {
    if (response.errors) {
      const refreshToken = localStorage.getItem("refreshToken");
      // 检查 refreshToken 是否存在，如果不存在，则跳转到登录页面
      if (refreshToken === "") {
        localStorage.setItem("role", "");
        localStorage.setItem("username", "");
        return response;
      }
      // 如果 refreshToken 存在，则刷新 token 并重试
      return refreshAuthToken()
        .then(() => {
          const token = localStorage.getItem("accessToken");
          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              Authorization: `Bearer ${token}`,
            },
          }));
          return forward(operation);
        })
        .catch(() => {
          console.error("Failed to refresh auth token");
        });
    }

    return response;
  });
});

const refresh = async () => {
  let isInclude = requestURL.includes(window.location.pathname);
  if (isInclude) return;
  let refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken && refreshToken !== "") {
    const decoded: Decoded = jwt_decode(refreshToken);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      refreshToken = "";
      localStorage.setItem("refreshToken", "");
      localStorage.setItem("role", "");
      localStorage.setItem("username", "");
    }

    const query = print(RefreshToken);
    await fetch("http://localhost:7001/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          refreshToken: `${refreshToken}`,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const { accessToken: access, refreshToken: refresh } =
          data.data.refreshToken;
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
      });
  }
};
setInterval(refresh, 14 * 60 * 1000);


export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  // ApolloLink.from([...])是一个工厂函数，它接收一个链接数组并返回一个新的复合链接，
  // 这个链接会按顺序依次调用链中的每个链接。这意味着请求会从第一个链接开始传递，直到最后一个链接，响应则相反，从最后一个链接开始回溯到第一个链接。
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions: {
    watchQuery: {
      notifyOnNetworkStatusChange: true,
    },
    query: {
      notifyOnNetworkStatusChange: true,
    },
  },
});

