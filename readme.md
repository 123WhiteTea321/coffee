## 小程序如何安装vant

1. 项目初始化
npm init

2. 安装vant
npm i @vant/weapp -S --production

3. 修改 app.json
将 app.json 中的 "style": "v2" 去除

4. 修改 project.config.json (使用云开发这一步才做修改)
 "packNpmManually": true,
    "packNpmRelationList": [
      {
        "packageJsonPath": "./package.json",
        "miniprogramNpmDistDir": "./miniprogram/"
      }
    ],
5. 构建npm
工具=>构建npm


npm config set registry http://registry.npmmirror.com