# vscode 插件需要：

- Stylelint
- Prettier
- ESLint

# start

yarn install 或 npm install 安装依赖
yarn dev 或 npm run dev 开始开发

# 开发流程

每次开发时，首先拉取最新 dev 分支，其中[remote]为远程分支名

git pull [remote] dev
然后 checkout -b 签出新分支，分支名命名要求如下： [type]-[name]-[id] [type]为 feat, fix，docs 等，可与 commit 一致 [name]为当前提交内容的简要总结 [id]为分支提交人员的姓名缩写，如 xm（小明）

完成开发后，提交并 push 对应分支

# 提交规范

commit 时，git 会自动调用 hook 进行代码检查，检查代码是否规范，提交指令是否规范。

git commit -m "[type]: 提交说明"
其中[type]类型如下所示，且[type]后冒号为半角英文“:”

      [
        'feat', // 添加新功能
        'fix', // 修复bug
        'docs', // 修改文档
        'style', // 不影响代码含义的更改 (比如格式化代码)
        'refactor', // 重构已有代码（非新增功能或修bug）
        'perf', // 提高性能的代码更改
        'test', // 添加或修改测试
        'revert', // 用于撤销以前的commit
        'chore', // 对构建或者辅助工具的更改
      ],
