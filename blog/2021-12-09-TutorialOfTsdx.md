---
title: tsdx - 快速建立 npm 套件樣板的CLI工具
bgImageUrl: assets/images/23/23-0.jpg
description: 快速建立 npm 套件，所以在 GitHub 上尋找有沒有方便的套件，結果發現到了 tsdx，這個方便的 CLI 工具
published: true
tags: [tsdx, typescript, library, npm]
---

之前的文章[使用 TypeScript 建立 Express.js](https://thomascsd.github.io/blog/2021-02-07-ExpressjssWithTypescript)，需要快速建立 npm 套件，所以在 GitHub 上尋找有沒有方便的套件，結果發現到了 [tsdx](httptrs://github.com/jaredpalmer/tsdx)，這個方便的 CLI 工具。

## 建立

```
npx tsdx create mylib
```

按照[文件](https://tsdx.io/)的說明，直接執行`npx tsdx create <package name>`，馬上建立好從開發、測試到部署全部都設定完成的樣版，節省了很多前期整合各種套件的時間。

<img class="img-responsive" loading="lazy" src="assets/images/23/23-01.png">

所選擇的樣板是 'basic'，會建立如下圖的目錄架構。

<img class="img-responsive" loading="lazy" src="assets/images/23/23-02.png">

## 微調的項目

但是實際開發後，發現還是需要一些調整才行，以下會介紹。

### tsconfig.json

因為開發的套件[stools](https://www.npmjs.com/package/@thomascsd/stools)有使用到 DI 的機制，而使用的套件是 [typeDi](https://github.com/typestack/typedi) ，而且會用到 Decorator 的功能，因此需要在 tsconfig.json 加上以下設定。

```
"emitDecoratorMetadata": true,
"experimentalDecorators": true,
```

## 測試

<img class="img-responsive" loading="lazy" src="assets/images/23/23-03.png">

測試方面是使用 Jest ，有 React 的背景的人，應該很多都有使用過，而這是我第一次使用 Jest 來進行測試。當測試執行完畢，會直接顯示詳細的測試資訊，如同上圖，這部份有讓我有點驚艷到，就連未測試的程式行數也會顯示。

```javascript
// jest.config.js
module.exports = {
  verbose: true,
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{js,ts}', '!<rootDir>/node_modules/'],
};
```

但是還有需要調整的地方，預設是沒有加入 jest.config.js 的，而這次建立的套件[stools](https://www.npmjs.com/package/@thomascsd/stools)是運行在 node.js 環境上的，所以執行測試時會發生錯誤，所以指定`testEnvironment`為 node 即可，並且參考其他專案的設定，也一併設定需顯示測試的覆蓋度。

## 建置(build)

建置是與 Rollup 整合，當執行`npm run build` ，也就會執行`tsdx build --target node`。

<img class="img-responsive" loading="lazy" src="assets/images/23/23-05.png">

這邊也是一段指令執行完，就會產生可以部署至 npm 的相關檔案，如大部份網站的慣列，預設是放在*dist*。

<img class="img-responsive" loading="lazy" src="assets/images/23/23-04.png">

## 結論

如果想快速開發 npm package 時，使用 tsdx 已經整合各種建立套件所需的工具，所以只需將時間放在建立套件的程式上即可，減少很多前置的時間，請大家參考看看。
