---
title: Ts.ED 設定 middleware
bgImageUrl: assets/images/34/34-00.png
description: iddleware 分為 Global middleware 和 Endpoint middleware 兩種。而 Gobal middleware，另一種是 Endpoint middleware，它使用@UseBefore裝飾器(decorator)設定在 Controller 上。我認為這種方式更符合我當前的專案需求。
published: true
---

之前的文章介紹過 Ts.ED，它是一個建構在 express.js 或是 koa.js 之上，並添加許多便利功能的 TypeScript 框架。最近在設定自訂 middleware 時，我發現了一個不錯的作法，特此記錄下來。

根據[官方文件](https://tsed.dev/docs/middlewares.html)，middleware 分為 Global middleware 和 Endpoint middleware 兩種。而 Gobal middleware 需在 `Server`上的 `@Configuration`  中透過 `middlewares` 屬性設定。然而，我按照文件範例將自訂 middleware 加入 `middlewares` 後，發現 middleware 並未如預期般觸發。

另一種是 Endpoint middleware，它使用 `@UseBefore` 裝飾器(decorator)設定在 Controller 上。我認為這種方式更符合我當前的專案需求。

這是因為我的專案採用了類似 sub-controller 的架構：先建立一個基礎 `ApiController`（路由設為 `/api`），而其他 `Controller` 都設定）在它之下。

因此，解決方案是直接在 `ApiController` 上使用 `@UseBefore`，並傳入自訂的 middleware。這樣一來，所有使用 `/api` 路徑的子路由都能自動套用此 middleware。

```typescript
@UseBefore(ApiKeyMiddleware)
@Controller({
  path: '/api',
  children: [
    ImageFileController,
    ForecastController,
    CountyController,
    MemberController,
  ],
})
export class ApiController {}
```
