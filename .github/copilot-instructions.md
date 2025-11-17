## 快速導覽（給 AI 協助開發者）

這個專案是一個使用 Angular (v13) + Scully 的靜態部落格站台。主要內容分成兩部分：

- 前端：`src/app`（典型的 Angular 組件、module、service）
- 內容：`/blog` 資料夾放 markdown 檔案（Scully 將其轉為靜態路由）

**重點檔案**（常需參考）

- `package.json`：啟動、建置與 scully 指令（`npm start`, `npm run build`, `npm run scully`, `npm run scully:watch`）
- `scully.blog-new.config.ts`：Scully 設定（`projectRoot`, `outDir`, routes、sitemap plugin 設定）
- `src/app/core/blog.service.ts`：blog 相關 helper（例如：從路徑解析日期等）
- `src/app/home/home.component.ts`：首頁顯示文章清單的邏輯，使用 `ScullyRoutesService` 與 `BlogService`
- `deploy.js` 與 `azure-pipelines.yml`：部署流程（CI / 發佈相關）
- `assets/scully-routes.json`：已產生路由快照，方便本地檢查

架構與資料流（精簡）

- Markdown 檔（`/blog/*.md`）含 YAML front-matter（例：`title`, `published`, `description`, `bgImageUrl`），Scully 的 `contentFolder` 會建立 `/blog/:slug` 路由。
- 建置時先執行 `ng build --configuration production`，接著執行 `scully` 來產生靜態頁面（見 `package.json` 的 `build` script）。
- 前端在運行時會透過 `@scullyio/ng-lib` 的 `ScullyRoutesService` 取得可用路由（例如在 `HomeComponent` 中會 zip `available$` 與 `queryParams` 來建立頁面清單）。

專案約定與實作細節

- Markdown 檔名採 `YYYY-MM-DD-Slug.md`；front-matter 常見欄位如 `title`, `published`, `description`, `bgImageUrl`。
- 英文頁面會被放在 `/en/...` 路徑下；程式中常以 route 字串判斷是否為英語路由（例如 `HomeComponent` 先過濾 `route.title` 再依路徑排除 `/en`）。
- 用到的 Scully plugin：sitemap（已在 `scully.blog-new.config.ts` 設定）、puppeteer（已載入）。RSS plugin 曾出現但註解中未啟用。

建置／開發常用指令（PowerShell）

```
npm install
npm start                # ng serve
npm run scully           # 執行 scully（需先 build 或使用 scully:watch）
npm run scully:watch     # watch 模式
npm run scully:serve     # 在本機 serve scully 產物
npm run build            # production build + scully（同 package.json）
npm test                 # 執行單元測試
npm run lint             # lint
node deploy.js           # 部署腳本（專案特定）
```

實作提示與可改動位置（針對 AI 編輯者）

- 若新增 blog route（例如多語系），需修改 `scully.blog-new.config.ts` 的 `routes` 或 plugin 設定。
- 對於文章列表（`src/app/home/home.component.ts`）：
  - 路由過濾邏輯在 `map()` 裡面操作 `routes`，`BlogService.getPostDateFormRoute(route.route)` 用來從路徑解析日期。
  - 路由過濾邏輯在 `map()` 裡面操作 `routes`，`BlogService.getPostDateFormRoute(route.route)` 用來從路徑解析日期。
  - 英文路由判斷已集中在 `BlogService.isEnglishRoute(route: string): boolean`，所有元件應呼叫此 helper 而非直接使用 `indexOf` / `includes`。已為該 helper 撰寫單元測試（見 `src/app/core/blog.service.spec.ts`）。
- 若改動前端的路由或 slug 規則，務必要同步更新 Scully 設定與 `assets/scully-routes.json`（或重新產生 scully）。

注意事項 / 限制

- Angular 版本為 13，請使用相容的 TypeScript 與套件版本（見 `package.json`）。
- 部署流程非純 Netlify — 有自訂 `deploy.js` 與 `azure-pipelines.yml`，在修改 CI 腳本前請先確認目的平台。
- RSS plugin 曾被註解掉；若要啟用請檢查相容的 plugin 版本與 `postRenderers` 設定。

範例檔案快速連結（建議閱讀）

- `scully.blog-new.config.ts` — Scully 主要設定
- `package.json` — script 與依賴
- `src/app/core/blog.service.ts` — 解析日期、slug 的 helper
- `src/app/home/home.component.ts` — 列表與分頁邏輯示例

語系判斷補充（`isEnglishRoute`）

- 已在 `BlogService` 中新增 `isEnglishRoute(route: string): boolean` 以集中管理英文路由判斷邏輯。判斷規則：

  - 若路徑以 `/en` 開頭（不分大小寫），視為英文路由。
  - 或整段路徑僅包含 ASCII 英文字母、數字、連字號與斜線，視為英文路由。

- 範例：在 `HomeComponent` 使用：

  ```ts
  items = items.filter((route) => !this.blogService.isEnglishRoute(route.route));
  ```

- 測試與遷移建議：
  1. 在原始碼 (`src/`) 搜尋 `indexOf('en')`、`includes('en')`、`startsWith('/en')` 等直接字串判斷並替換為 `BlogService.isEnglishRoute()`。

2.  為新增或修改的呼叫點補上單元測試（範例已在 `src/app/core/blog.service.spec.ts`）。
3.  本機執行 `npm test` 與 `npm run build` 驗證變更後行為（建議在 PR 前確認）。

如果你希望我把某一部分展開（例如：自動修正 `HomeComponent` 的語系判斷、建立測試範例、或產生 CI 步驟範本），告訴我要優先處理哪一項，我會接著執行。
