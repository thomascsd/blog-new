---
title: 於Angular中，建立Library的心得
bgImageUrl: assets/images/10/10-0.jpg
published: true
---

在 Angular CLI 6.0 以上就可以直接建立 Library，而 Library 的用途可以將自已建立的元件發佈至 NPM，或是專案一些共同的元件拆分出去。

## 建立 Library

```
ng new ngx-lib-demo
ng g library shared-comp
```

先使用 Angular CLI 建立範例專案，再來用上列的指令，建立 Library。有時會覺得記住 CLI 的參數很麻煩，會使用[Angular Console](https://angularconsole.com/)幫忙建立。

<img class="img-responsive" loading="lazy" src="assets/images/10/10-01.gif">

```
ng g c header --project=shared-comp
```

接下來，在 Library 中建立 component，這邊是建立 header component，也可以使用 Angular Console 建立。

<img class="img-responsive" loading="lazy" src="assets/images/10/10-2.png">

如上圖，我們所建立 library 會在目錄 projects 下，例如這次我建立的 shared-comp，並且與一般的 Angular 專案不同，component 位於 lib 目錄下。

```javascript
//public_api.ts
export * from './lib/header/header.component';
export * from './lib/shared-comp.module';
```

接著，在 public_api.ts 中 export 我們所建立的 header component。

<img class="img-responsive" loading="lazy" src="assets/images/10/10-3.png">

```javascript
//app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedCompModule } from 'shared-comp';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SharedCompModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```html
<!--app.component.html-->
<lib-header></lib-header>
<div>Hello</div>
```

使用指令`ng build shared-comp`建置完 library 後，再來就可以在 Angular 應用程式中，匯入我們建立在 library 中的 component。

## 發佈至 npm

```
ng build shared-comp --prod
cd dist/shared-comp
npm publish
```

要如何將我們建立的 conpont 部署至 npm 呢?輸入上列指令即可，最後輸入 npm publish，即可完成發佈的程序。

```json
"scripts": {
"build:lib": "ng build shared-comp --prod",
"deploy": "cd dist/shared-comp && npm publish"
}
```

但是每次都這樣打也很麻煩，所以就將這些指令寫成上面的 npm script。

## 升級需注意的心得

我發現從 Angular 5 升級至 Angular6/7 時，除了輸入`ng update`外，還需另外調整一些設定才行，也可以參考這篇官方的[文章](https://github.com/angular/angular-cli/wiki/stories-create-library#note-for-upgraded-projects)

- tsconfig.json：需調整 paths 的路徑，路徑調整至 dist/project-name，不然會發現找不到 package 的錯誤。

- tsconfig.app.json：需要移除 baseUrl。

## 結論

Angular CLI 是很強大的工具，輸入一些命令，即可產生 Application 或是 Library，現在還可以搭配 Angular Console，程式開發變得很方便，
