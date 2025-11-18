---
title: 在asp.net MVC上使用vue.js需注意的事項
published: true
tags: [vuejs, asp-net, mvc]
---

最近開始使用 vue.js 在公司的專案上，並且專案是用 asp.net mvc 來開發的，所以發現在.cshtml 上無法使用 vue.js 的需要注意的小地方。

第 1 個是@click 之類的事件綁定簡寫方式，因為會和原本的 Razor 語法衝突，所以需要使用完整的寫法。

下列的語法會發生錯誤

```html
<button @click=""></button>
```

應該用完整的語法

```html
<button v-on:click=""></button>
```

第 2 個是 attribure 的資料綁定的簡寫方式，像是要指定圖片的路徑時，可以寫成這樣

```html
<img :src="defaultUrl" />
```

但是當執行格式化文件時，冒號(:)會不見，這就產生莫名的 bug，當初尋找原因就花了 1 個小時，所以要寫成下列語法就 OK 了。

```html
<img v-bind:src="defaultUrl" />
```
