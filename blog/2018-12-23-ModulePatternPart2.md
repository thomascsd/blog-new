---
title: 談談JavaScript Module part2
bgImageUrl: assets/images/08/08-0.jpg
published: true
---

這篇會繼續上篇的主題：Module，這篇會講述 ES6（ES2015）Module 寫法，而上一篇是[談談 JavaScript Module part1](https://thomascsd.github.io/blog/2018-10-31-ModulePattern)。

## Module 建立

```javascript
export const message = 'Hello';

export function doSomeThing {
}

export class Util{
}
```

ES2015 Module 是以檔案為基礎，也就是 1 個檔案視為 1 個 Module，在檔案內需要被外面引用的 function、class 還是變數，使用**export**關鍵字輸出，

## Module 戴入

```javascript
import { message ] from './util.js';
```

有 export 就有 import，使用**import**關鍵字戴入剛剛所定義的 function、class 或是變數，之後用 from 指定所戴入的檔案是那一個，路徑是相對路徑。

```javascript
export default const message  = 'hello';

import message from './util.js';

```

如果在 export 的地方，加上 default 關鍵字時，import 不需加上大括號。

```javascript
export default const message  = 'hello';

expot function doSomeThing() {
}

import message, { doSomeThing} from './util.js';

```

也可以兩者混用。

## Dynamic import

```javascript
import('./my-module.js').then((module) => {
  // Do something with the module.
});
```

有時候會希望動能戴入 Module，這時 import 變成了 function，而回傳值是 Promise。

```javascript
let module = await import('./my-module.js');
```

因回傳值是 Promise，所以支援 await 關鍵字。

## 程式實作

### 瀏覽器的支援

<img class="img-responsive" loading="lazy" src="assets/images/09/09-1.png">

根據 caniuse 的結果，現在全部的瀏覽器都有支援 ES2015 Module，可以不用使用 Webpack、Parcel 之類的 Module loader，直接使用原生語法就好了，但實務上還是需要 Webpack 之類的工具，幫忙將 js 打包、壓縮。

### 原生的寫法

```html
<script type="module" src="./index.js" />
```

跟一般戴入 script 不同的地方在於，需指定 type="module"來告訴瀏覽器用 Module 的形式戴入 script。範例原始碼在[這裡](https://github.com/thomascsd/es-module-import)。

### 戴入第三方套件需注意的地方

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script type="module" src="./scripts/index.js"></script>
```

```javascript
const $ = window.jQuery;
```

是用 CDN 的方式將 jQuery 戴入，在 index.js 中需指派\$ = window.jQuery，因為在 Module 中無法取得全域變數，所以換個方式，用 window.jQuery 取得 jQuery 物件。

## 結論

現在幾乎每個瀏覽器都支援原生戴入 Module，說不定未來不用任何工具，就可以開發 Web Application。
