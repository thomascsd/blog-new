---
title: draxt.js-簡化存取檔案的小幫手
published: true
---

Node.js 處理檔案我個人覺得不是很方便，有時候會覺得卡卡的。之前有發現 Node.js 套件[draxt.js](https://github.com/ramhejazi/draxt)，它封裝了[glob](https://github.com/isaacs/node-glob)和[fs-extra](https://github.com/jprichardson/node-fs-extra)這兩個套件，並提供類似 jQuery 的語法，讓檔案的處理變簡單了。

因為我的 Blog 是分成兩個專案，一個是開發使用，一個是實際 Blog 的網站，而我使用 nuxt.js 建立 Blog 的心得，可以參考之前的[文章](/blog/2018-06-23-NuxtjsAndNuxtent)。之前的複製檔案都是用手動，所以想寫個小程式幫助複製檔案，剛好趁這個機會練習使用 draxt.js 這個套件。

## 原始碼

```javascript
const fs = require('fs');
const path = require('path');
const util = require('util');
const $ = require('draxt');
const consola = require('consola');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

(async () => {
  const rootPath = path.join(process.cwd(), '..');
  const blogDistPath = `/thomascsd.github.io/`;
  let $blogSrc = await $('./dist/**');
  const $blogDist = await $('.' + blogDistPath + '**', {
    cwd: rootPath,
  });

  $blogDist
    .filter((node) => (node.isDirectory() && node.baseName.indexOf('.') === -1) || node.isFile())
    .each(async (node) => {
      consola.info(`step1-1:刪除thomascsd.github.io內的檔案，name:${node.pathName}`);
      await node.remove();
    });

  consola.info(`step2:api.js的localhost更換成thomascsd.github.io`);
  const $api = $blogSrc
    .filter((node) => node.baseName.indexOf('app.') !== -1 && node.extension === 'js')
    .first();

  let content = await readFileAsync($api.pathName);
  content = content.toString().replace(/http:\/\/localhost:3200/i, 'https://thomascsd.github.io');
  await writeFileAsync($api.pathName, content);

  const blogPath = path.join(rootPath, blogDistPath);

  $blogSrc = await $('./dist');
  $blogSrc.each(async (node) => {
    consola.info(`step3:復製檔案至thomascsd.github.io內的檔案，name:${node.pathName}`);

    try {
      await node.copy(blogPath);
    } catch (err) {
      consola.error(err);
    }
  });
})().catch((err) => consola.error(err));
```

## 程式說明

```javascript
const fs = require('fs');
const path = require('path');
const util = require('util');
const $ = require('draxt');
const consola = require('consola');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

(async () =>{

}
```

一開始戴入所需的套件，這邊有用 util.promisify 將原本是 callback 型式的 readFile 及 writeFile，轉換成 Promise 的型式。

因為 draxt.js 的方法都是設計成回傳 Promise 物件，可以使用 async/await 的語法，所以這裡用 async 的 IIFE 將檔案操作的邏輯包起來。關於 Promise，可以參考我的上一篇的[文章](/blog/2018-08-12-ExampleOfPromise)。

```javascript
const rootPath = path.join(process.cwd(), '..');
const blogDistPath = `/thomascsd.github.io/`;
let $blogSrc = await $('./dist/**');
const $blogDist = await $('.' + blogDistPath + '**', {
  cwd: rootPath,
});
```

jQuery 是使用 CSS Selector 來選擇元素，而 draxt.js 是使用 glob pattern 選取檔案或目錄，關於 glog pattern 可以參考[文件](<https://en.wikipedia.org/wiki/Glob_(programming)>)。

### 第一步刪除 thomascsd.github.io 內的檔案

```javascript
$blogDist
  .filter((node) => (node.isDirectory() && node.baseName.indexOf('.') === -1) || node.isFile())
  .each(async (node) => {
    consola.info(`step1-1:刪除thomascsd.github.io內的檔案，name:${node.pathName}`);
    await node.remove();
  });
```

先用 filter 將包含.的目前都過濾掉，因為像是.git 的目錄不能希望刪除，並且也有提供**each**的方法，將 thomascsd.github.io 目錄下的子目錄及檔案都刪除。

### 第二步 api.js 的 localhost 更換成 thomascsd.github.io

```javascript
const $api = $blogSrc
  .filter((node) => node.baseName.indexOf('app.') !== -1 && node.extension === 'js')
  .first();

let content = await readFileAsync($api.pathName);
content = content.toString().replace(/http:\/\/localhost:3200/i, 'https://thomascsd.github.io');
await writeFileAsync($api.pathName, content);
```

因為 app.js 的檔名會包含雜湊值，所以使用**filter**取得檔名包含 app 及副檔名為 js 的檔案，最後讀取 app.js 內容，將 localhost 替換成 thomascsd.github.io 後，再寫回 app.js。

### 第三步複製檔案至 thomascsd.github.io 目錄

```javascript
const blogPath = path.join(rootPath, blogDistPath);

$blogSrc = await $('./dist');
$blogSrc
.each(async (node) => {
consola.info(`step3:複製檔案至thomascsd.github.io內的檔案，name:${node.pathName}`);

try {
await node.copy(blogPath);
} catch (err) {
consola.error(err);
}
```

這邊很單純的，將目錄 dist 複製至目錄 thomascsd.github.io，這樣即完成所有的步驟了，最後輸入`node deploy.js`即完成。

## 結論

個人是覺得這個套件簡化了處理檔案的一些煩瑣的操作，推薦給大家處理檔案的另外一種選擇。這次原始碼在[這裡](https://github.com/thomascsd/thomascsd-blog/blob/master/deploy.js)。
