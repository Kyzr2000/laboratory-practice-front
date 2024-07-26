module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended', // 确保已经包含了这一行
    // 其他可能的扩展
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'simple-import-sort',
    // 其他插件
  ],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    // 禁用 'React' must be in scope when using JSX 的规则
    'react/react-in-jsx-scope': 'off',
    // 其他规则...
  },
  settings: {
    react: {
      version: 'detect', // 自动检测 React 版本
    },
  },
};
