---
title: Bulma的初體驗
bgImageUrl: assets/images/30/30-0.jpg
description: Bulma 確實是一個非常直觀且方便使用的 CSS 框架。它的開發者體驗（DX）優秀，對比 Bootstrap 有著更為簡潔的語法和設計。特別是在排版和元件設定方面，Bulma 可以來試試看
published: true
---

最近對一款 CSS 框架 - [Bulma](https://bulma.io/) 產生了興趣，發現它的開發者體驗（DX）非常出色，使用起來比 Bootstrap 更直觀。前不久，它推出了 1.0 版本，因此我想撰寫一篇心得文，稍微介紹一下。

## 使用

要引用`Bulma`，最簡單的方式，就是在頁面上使用 CDN 連結。

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.0/css/bulma.min.css" />
```

## 特點

下面列出幾個特點，對比 Bootstrap，有這些地方讓我覺得很方便使用。

- Column Layout

使用 Column 來排版，看了語法後會讓人眼睛一亮，只需使用 `columns` 及 `columns` 就會自動排版。

```html
<div class="columns">
  <div class="column"></div>
  <div class="column">
    <strong>Bulma - Blog theme</strong> by <a href="https://gonzalojs.com">Gonzalo Gutierrez</a>.
    Based on the <a href="http://jigsaw-blog-staging.tighten.co/">jigsaw-blog</a>.
  </div>
  <div class="column"></div>
</div>
```

<img class="img-responsive" loading="lazy" src="assets/images/30/30-1.png">

如上圖，預設是左右均分，看起來會有點跑版

```html
<div class="columns">
  <div class="column is-2"></div>
  <div class="column is-8">
    <strong>Bulma - Blog theme</strong> by <a href="https://gonzalojs.com">Gonzalo Gutierrez</a>.
    Based on the <a href="http://jigsaw-blog-staging.tighten.co/">jigsaw-blog</a>.
  </div>
  <div class="column is-2"></div>
</div>
```

<img class="img-responsive" loading="lazy" src="assets/images/30/30-2.png">

一樣也是有 [12 columns system](https://bulma.io/documentation/columns/sizes/#12-columns-system)，我這邊就設定 `is-8` ，將寬度設寬。

- Component 的設定

比如 [Navbar](https://bulma.io/documentation/components/navbar/) 的設定，使用的階層是比較少。

```html
<!--Bootstrap-->
<div class="collapse navbar-collapse" id="navbarSupportedContent">
  <ul class="navbar-nav mr-auto">
    <li class="nav-item" routerLinkActive="active">
      <a class="nav-link">Member</a>
    </li>
    <li class="nav-item" routerLinkActive="active">
      <a class="nav-link">List</a>
    </li>
    <li class="nav-item" routerLinkActive="active">
      <a class="nav-link">Order</a>
    </li>
  </ul>
</div>
```

```html
<!--Bluma-->
<div id="navbarBasic" class="navbar-menu">
  <div class="navbar-start">
    <a class="navbar-item" [routerLink]="['/member']">Member</a>
    <a class="navbar-item" [routerLink]="['/list']">List</a>
    <a class="navbar-item" [routerLink]="['/order']">Order</a>
  </div>
</div>
```

- is-\*的語法

這邊也是我覺得開發者體體很好的地方，如同上方的 `Column Layout` ，設定寬度使用 `is-8`、`is-2`。

```html
<input class="input is-link" type="text" placeholder="Link input" />
<input class="input is-small" type="text" placeholder="Small input" />
<div class="control">
  <input class="input is-focused" type="text" placeholder="Focused input" />
</div>
```

另外在 `input` 有很多這種的設定，如上方的 `is-link`、`is-small`、`is-focused` ，可以參考 [input 章節](https://bulma.io/documentation/form/input/)

## 參考內容

Bulma 有蠻多的資源可以參考，雖然沒有像 Bootstrap 這麼龎大，我覺得還是有不少的資源。

<img class="img-responsive" loading="lazy" src="assets/images/30/30-3.png">

- [Free Bulma Templates](https://bulmatemplates.github.io/bulma-templates/)：蠻多的免費板型可以使用，其中的[Blog 2 - Tailsaw](https://bulmatemplates.github.io/bulma-templates/templates/blog-tailsaw.html)就是我所使用的版型。

<img class="img-responsive" loading="lazy" src="assets/images/30/30-4.png">

- [Awesome Bulma](https://github.com/aldi/awesome-bulma)：大家都熟悉的 Awesome 系例，各個資源的集合。

## 結論

結論來說，Bulma 確實是一個非常直觀且方便使用的 CSS 框架。它的開發者體驗（DX）優秀，對比 Bootstrap 有著更為簡潔的語法和設計。特別是在排版和元件設定方面，Bulma 可以來試試看，並且將 Blog 也一起使用 Bulma 翻新。
