# 冲棋联机版

一个支持本地双人和互联网房间对战的四乘四冲棋小游戏。

## 本地启动

需要 Node.js 20 或更高版本。

```bash
pnpm install
pnpm start
```

浏览器访问 <http://localhost:3000>。不要直接双击 `index.html`，直接打开文件时只能使用本地双人模式。

## 联机流程

1. 玩家一点击“创建房间”，复制邀请链接。
2. 玩家二打开链接并点击“加入房间”。
3. 玩家一执黑先手，玩家二执白。
4. 刷新页面后会使用当前标签页保存的凭据自动重连。
5. 重新开局需要双方都点击“重新开始”。

房间和棋局保存在服务器内存中。双方离线超过 30 分钟后房间会被清理，服务器重启也会清空房间。

## 测试

```bash
pnpm test
```

## Render 部署

创建一个 Node.js Web Service：

- Build Command：`pnpm install`
- Start Command：`pnpm start`
- Health Check Path：`/health`

服务会监听 Render 提供的 `PORT`，网页和 Socket.IO 使用同一个域名。
