import { ApolloClient, ApolloLink, gql, HttpLink, InMemoryCache } from '@apollo/client';
import { print } from 'graphql';
import jwt_decode from 'jwt-decode';

const httpLink = new HttpLink({ uri: 'http://localhost:7001/graphql' });
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
// 判断是否在登录或注册 如果登录注册则不需要加请求头
const requestURL = ['/', '/login'];
let isInclude = requestURL.includes(window.location.pathname);

const authLink = new ApolloLink((operation, forward) => {
  // 获取现有的token
  const token = localStorage.getItem('accessToken');
  // 如果存在并且没有过期，则将其添加到请求头中
  if (token && !isInclude) {
    const decoded: Decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.setItem('accessToken', '');
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
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken && refreshToken !== '') {
    const decoded: Decoded = jwt_decode(refreshToken);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.setItem('refreshToken', '');
      localStorage.setItem('role', '');
      localStorage.setItem('username', '');
      window.location.href = '/login';
    } else {
      // 如果refreshtoken没过期
      // 查询 refreshToken
      const query = print(RefreshToken);
      const response = await fetch('http://localhost:7001/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      const { accessToken: access, refreshToken: refresh } = json.data.refreshToken;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
    }
  }
};
// @ts-ignore
const errorLink = new ApolloLink((operation, forward) => {
  if (isInclude) {
    return forward(operation);
  }
  return forward(operation).map((response) => {
    if (response.errors) {
      const refreshToken = localStorage.getItem('refreshToken');
      // 检查 refreshToken 是否存在，如果不存在，则跳转到登录页面
      if (refreshToken === '') {
        localStorage.setItem('role', '');
        localStorage.setItem('username', '');
        window.location.href = '/login';
        return response;
      }
      // 如果 refreshToken 存在，则刷新 token 并重试
      return refreshAuthToken()
        .then(() => {
          const token = localStorage.getItem('accessToken');
          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              Authorization: `Bearer ${token}`,
            },
          }));
          return forward(operation);
        })
        .catch(() => {
          console.error('Failed to refresh auth token');
        });
    }

    return response;
  });
});

const refresh = async () => {
  let refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken && refreshToken !== '') {
    const decoded: Decoded = jwt_decode(refreshToken);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      refreshToken = '';
      localStorage.setItem('refreshToken', '');
      localStorage.setItem('role', '');
      localStorage.setItem('username', '');
      window.location.href = '/login';
    }

    const query = print(RefreshToken);
    await fetch('http://localhost:7001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
        const { accessToken: access, refreshToken: refresh } = data.data.refreshToken;
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
      });
  }
};
const refreshToken = localStorage.getItem('refreshToken');
if (!isInclude && refreshToken && refreshToken !== '')
  setInterval(refresh, 14 * 60 * 1000);
export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
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