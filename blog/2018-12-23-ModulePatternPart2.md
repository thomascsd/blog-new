---
title: 談談JavaScript Module part2
bgImageUrl: /images/08/08-0.jpg
---

這篇會繼續上篇的主題：Module，這篇會講述ES6（ES2015）Module寫法，而上一篇是[談談JavaScript Module part1](https://thomascsd.github.io/module-pattern)。

## Module建立

```javascript
export const message = 'Hello';

export function doSomeThing {
}

export class Util{
} 
```

ES2015 Module是以檔案為基礎，也就是1個檔案視為1個Module，在檔案內需要被外面引用的function、class還是變數，使用**export**關鍵字輸出，

## Module戴入

```javascript
import { message ] from './util.js';
```

有export就有import，使用**import**關鍵字戴入剛剛所定義的function、class或是變數，之後用from指定所戴入的檔案是那一個，路徑是相對路徑。

```javascript
export default const message  = 'hello';

import message from './util.js';

```

如果在export的地方，加上default關鍵字時，import不需加上大括號。

```javascript
export default const message  = 'hello';

expot function doSomeThing() {
}

import message, { doSomeThing} from './util.js';

```

也可以兩者混用。

## Dynamic import

```javascript
import('./my-module.js')
  .then((module) => {
    // Do something with the module.
  });
```

有時候會希望動能戴入Module，這時import變成了function，而回傳值是Promise。

```javascript
let module = await import('./my-module.js');
```

因回傳值是Promise，所以支援await關鍵字。

## 程式實作

### 瀏覽器的支援

<img class="img-responsive" src="/images/09/09-1.png">

根據caniuse的結果，現在全部的瀏覽器都有支援ES2015 Module，可以不用使用Webpack、Parcel之類的Module loader，直接使用原生語法就好了，但實務上還是需要Webpack之類的工具，幫忙將js打包、壓縮。

### 原生的寫法
```html
<script type="module" src="./index.js" />
```

跟一般戴入script不同的地方在於，需指定type="module"來告訴瀏覽器用Module的形式戴入script。範例原始碼在[這裡](https://github.com/thomascsd/es-module-import)。

### 戴入第三方套件需注意的地方

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script type="module" src="./scripts/index.js"></script>
```

```javascript
const $ = window.jQuery;
```

是用CDN的方式將jQuery戴入，在index.js中需指派$ = window.jQuery，因為在Module中無法取得全域變數，所以換個方式，用window.jQuery取得jQuery物件。

## 結論

現在幾乎每個瀏覽器都支援原生戴入Module，說不定未來不用任何工具，就可以開發Web Application。





