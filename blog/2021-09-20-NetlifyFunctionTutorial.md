---
title: Netlify functions 初體驗記錄
bgImageUrl: assets/images/22/22-0.jpg
published: true
---

一直以來斷斷續續接獨 Servless funcion 的服務，從 FireBase 到 Azure 都有，但是一些原因，而覺得沒有符合我的需求，直到前一陣子，我嘗試使用 [Netlify functions](https://www.netlify.com/products/functions/) ，發現簡單易用，並且也整合 CI/CD ，如果想整合至舊有專案也是挻方便的，就想寫篇文章做個記錄。

<img class="img-responsive" loading="lazy" src="assets/images/22/22-08.png">

查看了文件之後，發現是將 AWS Lambda 包裝起來，另外免費版的話，提供一個月 125,000 的 Request 數，總共可以執行 100 小時，以一個小專案或是 Side Project 算是足夠了。

## 開始

這次是範例是將概有的 Side Project [form-builder-demo](https://github.com/thomascsd/form-builder-demo) 整合進 Netlify function。

```
npm install netlify-cli -g
```

首先安裝 Netlify CLI，後續可以在本機上除錯或是在本機上啟用網站。

```
npm install @netlify/functions
```

之後會用 TypeScript 來開發，所以需要安裝 `@netlify/functions`。

```
netlify init

```

之後為了要和 GitHub 的專案整合，整合至 CI/CD，所以執行 `netlify init`。

<img class="img-responsive" loading="lazy" src="assets/images/22/22-01.png">

```
[build]
  functions = "functions"
  publish = "dist"
```

執行完後，會一起建立 netlify.toml ，設定值就是剛剛執行`Netlify init`  所詢問問題的答案，用來設定 Netlify functions 的。

- functions：設定存放 Netlify function 的目錄，預設是在 /netlify/functions。
- command：設定建置時，要執行的指令，我是設定 'npm run build' 。
- publish：設定建置後檔案的位置，我是用預設的 dist。

## 開發

```javascript
import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World' }),
  };
};

export { handler };
```

可以參考[文件](https://docs.netlify.com/functions/build-with-typescript/)，程式格式如上所示，但是關於用去沒有說明很清楚，所以來彙整一下。

<img class="img-responsive" loading="lazy" src="assets/images/22/22-02.png">

- event：定義如上圖所示，可以從 node_modules\@netlify\functions\src\function\event.d.ts 中找到，如同了包裝 Request 類似。
- boby：與 Express 一樣使用 body 取得 post 來的資訊。
- queryStringParameters：使用此屬性取得 QueryString 資訊。

- response：如同程式自我描述般的，回傳 `statusCode` 及 `body`，應 `body`需為字串，所使用 `JSON.stringify` 將物件轉成字串。

<img class="img-responsive" loading="lazy" src="assets/images/22/22-03.png">

如果有開發過 Serverless function 程式的人，應該都知道，都是會一支 Api 一支檔案，這邊另外有些共用的程式，我再建立 Services 的目錄。

## Netlify dev

<img class="img-responsive" loading="lazy" src="assets/images/22/22-04.png">

執行 `netlify dev`，就可以在本機除錯或是在本機啟動，如上圖啟動 Port 為 8888 的本機 Server ，並且判斷到前端是用 Angular 來開發，跟著執行 ng serve，也同時啟動 Angular Live Development Server，一整個開發的爽快感。

## etlify 站台設定

<img class="img-responsive" loading="lazy" src="assets/images/22/22-05.png">

一開始的`netlify init` 的設定，就會與 GitHub 連結，當程式 push 至 GitHub 後，即會自動部署至 Netlify。

<img class="img-responsive" loading="lazy" src="assets/images/22/22-06.png">

另外我將資料寫入至 AirTable，所以需要設定環境變數。

<img class="img-responsive" loading="lazy" src="assets/images/22/22-07.png">

最後可以在 Functions 頁籤，看到這次所設定的 function 的清單。

## 結論

除了可以將 SPA 的站台部署至 Netlify 上，並且後端功能使用 Netlify function，加上搭配 Netlify CI/CD 之後，覺得開發及部署一氣合成。
