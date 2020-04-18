---
title: SVG與Angular
bgImageUrl: assets/images/13/13-0.jpg
published: true
---

處理 SVG 已經是前端常常會遇到的事情，現在很多頁面上的圖片都是用 SVG 來取代，而 SVG 的優點這裡就不多述說。這邊提供我處理 SVG 的一些心得。

## icon 資源

想要免費並且可以編輯的 icon 資源，我尋找了很久，最後發現[iconify.design](https://iconify.design/)這個網站，它的 GitHub 星星數雖不是很多，但很符合我的需求。

<img class="img-fluid" src="assets/images/13/13-01.png">

例如搜索「search」會出現很多相關的 icon。

<img class="img-fluid" src="assets/images/13/13-02.png">

當選擇所想要的 icon 時，可以使用 HTML 來呈現

<img class="img-fluid" src="assets/images/13/13-03.png">

或是使用原始的 SVG 來呈現也可以，我個人是比較喜歡用原始的 SVG 來呈現，如此可進行一些客制化操作。

## 與 Angular 整合

AngularV8.0 之後支援`tempalteUrl`可以是 SVG，而不用是 HTML。可以參考[Using svg files as component templates with Angular CLI](https://levelup.gitconnected.com/using-svg-files-as-component-templates-with-angular-cli-ea58fe79b6c1)。

<iframe width="100%" height="450" frameborder="0" src="https://stackblitz.com/edit/ngx-svg-demo?embed=1&file=src/app/svg-title/svg-title.component.svg"></iframe>

如以上的範例，SVG 中可以加上 Angular 語法：`<text x="45" y="80" fill="#fff">{{title}}</text>`，成為動態的 SVG。

另外也可以註冊事件，使用 Angular 語法：`(click)="resetTitle()"`，如同範例，點擊 SVG 的圖型後，文字會重設為 Angular。

## 實現 hover

<img class="img-fluid" src="assets/images/13/13-04.gif">

有時會需要 hover 時改變 SVG 背景顏色，就像上圖所示。

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  aria-hidden="true"
  focusable="false"
  width="3em"
  height="3em"
  style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"
  preserveAspectRatio="xMidYMid meet"
  viewBox="0 0 24 24"
>
  <path
    d="M4 6h2v2H4zm0 5h2v2H4zm0 5h2v2H4zm16-8V6H8.023v2H18.8zM8 11h12v2H8zm0 5h12v2H8z"
    fill="#626262"
    class="icon"
  />
</svg>
```

```css
.icon:hover {
  fill: #2980b9;
}
```

這時只需要將定義的 class`.icon`放在 path 上`<path class="icon" />`即可，有試過放在 svg 上不會起作用，並且設定顏色時，需用 svg 的屬性 fill 在行。

以上這三點是我最近處理 SVG 的心得，分享大家參考看看。
