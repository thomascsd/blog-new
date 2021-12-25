---
title: 使用 Angular Static Generator - Scully 建立Blog的心得記錄
bgImageUrl: assets/images/15/15-0.jpg
published: true
---

一直以來 Angular 缺 Static Site Generator，像是 Vue.js 有 Nuxt.js，而 React.js 也有 Gatsby.js，終於 Angular 也出了 Static Site Generator - [Scully](https://scully.io)，並且我的 Blog 從最早的 Jekyll，之後是用 Nuxt.js，現在要用 Scully 第三次改寫，因為我對 Angular 還是比較熟悉的原故，建立 Blog 的過程心程分享給大家參考看看

## 起手式

```
ng new blog-demo
```

首先是用 Angular CLI 建立基本的版型。

```
ng add @scullyio/init
```

<img class="img-responsive" loading="lazy" src="assets/images/16/16-1.png">

接著參考[官方文件](https://scully.io/docs/getting-started/)，輸入上方指令，將 Scully 加入 Angular 專案，並產生 scully.{your project}.config.ts。

```
ng generate @scullyio/init:blog
```

再來就是建立 Blog 模組，輸入上列指命，就會產生基本的檔案。

<img class="img-responsive" loading="lazy" src="assets/images/16/16-2.png">

如上圖所示，主要會建立 Blog 目錄 - 存放 markdown 格式的文章，以及 BlogComponent - 顯示文章。這時再套上主題樣式就成為基本的 Blog 了。但是還要再加上下列的功能，才會是比較完整的 Blog。

## 程式碼著色功能

[Scully](https://scully.io)是使用 Plugin 的機制來擴充功能，除了[內建](https://scully.io/docs/scully-provided-plugins/)之外，也有其他人所寫的 Plugin，而程式碼著色功能使用內建的 Plugin - MD。

```javascript
import { ScullyConfig, setPluginConfig } from '@scullyio/scully';

setPluginConfig('md', { enableSyntaxHighlighting: true });

export const config: ScullyConfig = {
...
}
```

在 scully.{your project name}.config.ts 中加上以上的設定，設定`enableSyntaxHighlighting: true`啟用程式碼著色功能。

<img class="img-responsive" loading="lazy" src="assets/images/16/16-3.png">

但是只有設定到一半，因為 css 還沒戴入，所以程式碼就是預設的文字顏色。

```
npm install highlight.js
```

因為 Plugin - MD 是使用 highlight.js 來著色程式碼，所以另外安裝 highlight.js，接著再取得我們所需要的 css。

<img class="img-responsive" loading="lazy" src="assets/images/16/16-4.png">

在 angular.json 裡的 styles 加上自已所喜好的樣式 css。

<img class="img-responsive" loading="lazy" src="assets/images/16/16-5.png">

這樣就 OK 了，程式碼有顏色了。

## 留言系統

一般說來，都希望在文章下方放置留言區塊，和讀者有互動，並且我想要比較簡單，可以與 GitHub issue 整合的，最後終於找到了[utterances](https://utteranc.es/)。

<img class="img-responsive" loading="lazy" src="assets/images/16/16-6.png">

按照網站上的步驟設定後，能將產生的 Script 放在想要顯示的地方，但是 script 放到 Angular html template 的話，script 會被過瀘掉，所以要動態插入 script。

```javascript
import { Component, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
  preserveWhitespaces: true,
})
export class BlogComponent implements OnInit {

  constructor(
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document
  ) {}

  ngOnInit() {
    const s = this.renderer2.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://utteranc.es/client.js';
    s.setAttribute('repo', 'thomascsd/thomascsd.github.io');
    s.setAttribute('issue-term', 'pathname');
    s.setAttribute('theme', 'github-light');
    s.setAttribute('crossorigin', 'anonymous');
    s.text = ``;
    this.renderer2.appendChild(this.document.querySelector('#comments'), s);
  }
```

使用 renderer2 來動態產生 script 元素，最後插入想要顯示的地方。

<img class="img-responsive" loading="lazy" src="assets/images/16/16-7.png">

## 分頁功能

```javascript
  constructor(
    private scullyService: ScullyRoutesService,
  ) {
  }

  private loadData() {
    const pageSize = 10;

    this.links$ = zip(this.scullyService.available$, this.route.queryParams).pipe(
      map(([routes, params]) => {
        this.page = parseInt(params.page || 1, 10); // 取得QueryString的頁數

        const items = routes
          .filter((route) => !!route.title)
          .reverse()
          .slice((this.page - 1) * pageSize, this.page * pageSize); // 使用slice來切割Arrary

        items.forEach((route) => (route.date = this.blogService.getPostDateFormRoute(route.route)));

        this.itemCount = items.length;

        return items;
      })
    );
  }

  previous() {
    let pageNum = this.page - 1;

    if (pageNum === 0) {
      pageNum = 1;
    }

    this.router.navigate(['/'], { queryParams: { page: pageNum }, replaceUrl: true });
  }

  next() {
    this.router.navigate(['/'], { queryParams: { page: this.page + 1 }, replaceUrl: true });
  }
```

隨著文章愈來愈多，所以就會想要有分頁的功能，運用 Scully 現成的 API，就可以輕鬆實現。如上列的程式碼，使用`ScullyRoutesService`的`available$`即可取得目前可使用的文章路由物件。

<img class="img-responsive" loading="lazy" src="assets/images/16/16-8.png">

而所謂的可使用就是文章 markdown 設定`published: true`。接著使用 Array 的`slice`，就可以根據 QueryString 所傳入頁數來切割 Array。

## CLI 指令

完整的指令可以參考[文件](https://scully.io/docs/scully-cmd-line/)，我這邊列出幾個常用的。

- scanRoutes：`npx scully --scan`，當新增路由時，例如：新增一篇文章，需要執行這個指令，來找到新的路由。

- watch：`npx scully --watch`，啟用 watch 模式，在開發階段很有幫助，可以立即看到修改的成果。

<img class="img-responsive" loading="lazy" src="assets/images/16/16-9.png">

- serve：`npx scully serve`，啟用 Scully Server，與`ng serve`相似，但不同點在於不會 build 專案。

- scully: `scully`，如果不加上任何參數的話，Scully 根據路由就會產生靜態檔案，並將靜態檔案預設放在`dist/static`下，所以很適合與`ng build --prod`一併使用。

```
  "scripts": {
    "ng": "ng",
    "start": "ng serve -o",
    "build": "ng build --prod && npm run scully",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e",
    "deploy": "node deploy.js",
    "scully": "scully",
    "scully:scan": "npx scully --scan",
    "scully:watch": "npx scully --watch",
    "scully:serve": "npx scully serve"
  },
```

並且為了方便，我將這些常用的指令放在 npm scripts 中。

## 結論

靠著 cli 的幫助，可以很快地建立 Blog 樣板，但我覺得這個只是開始，有些功能都還需求調整。而 Scully 目前在 1.0Beta 版，應該很快就到 1.0 正式版，加上之後 Plugins 愈來愈多的話，以後可以值得期待。

原始碼：[https://github.com/thomascsd/blog-new](https://github.com/thomascsd/blog-new)
