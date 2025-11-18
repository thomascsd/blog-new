---
title: 6個推薦的Angular Library
bgImageUrl: assets/images/15/15-0.jpg
published: true
tags: [angular, library]
---

除了一些有名的 Library 之外，例如：Angular material，還有一些不為人知的 Library，我平常都會對有興趣的 Angular Library，加上星星加以儲藏，其中有使用過，有些覺得很不錯的想推薦給大家。

## 1. [ngx-loading](https://github.com/Zak-C/ngx-loading)

<img class="img-responsive" loading="lazy" src="assets/images/15/15-1.gif"/>

一般常常會和後端用 Ajax 溝通，這時候為了向使用者顯示還在資料處理中，會需要用 Loading 呈現。
發現[ngx-loading](https://github.com/Zak-C/ngx-loading)這個 library，方便設定及有各種的樣式。

<iframe width="100%" height="450" frameborder="0" src="https://stackblitz.com/edit/ngx-loading-blog?embed=1&file=src/app/app.component.html" ></iframe>

## 2. [ngx-sweetalert2](https://github.com/sweetalert2/ngx-sweetalert2)

要顯示 alert 或是 confirm 時，會有蠻多人推薦使用 sweetalert2，在 Angular 中可以使用[ngx-sweetalert2](https://github.com/sweetalert2/ngx-sweetalert2)，將 Angular 與 sweetalert2 整合。

<iframe width="100%" height="450" frameborder="0" src="https://stackblitz.com/edit/ngx-sweetalert2-blog?embed=1&file=src/app/app.component.html" ></iframe>

## 3.[ng-select](https://github.com/ng-select/ng-select)

我覺是目前最好用的取代 select 的 Libaray，有很多功能，例如：多選、自動完成、標韱的輸入。

<iframe width="100%" height="450" frameborder="0" src="https://stackblitz.com/edit/ngx-select-blog?embed=1&file=src/app/app.component.html" ></iframe>

## 4. [ngx-smart-modal](https://github.com/maximelafarie/ngx-smart-modal)

<img class="img-responsive" loading="lazy" src="assets/images/15/15-2.png">

說到 Dialog，除了使用 Angular component 的[Dialog](https://material.angular.io/components/dialog/overview)之外，還可以使用[ngx-smart-modal](https://github.com/maximelafarie/ngx-smart-modal)，除了一般的之外，還有巢狀 Dialog 的功能，有時候我們會需要開啟 Dialog 後，再開啟另一個 Dialog，除此之外，滿足了使用 Dialog 的各項功能需求。

<iframe width="100%" height="450" frameborder="0" src="https://stackblitz.com/edit/ngx-smart-dialog-blog?embed=1&file=src/app/app.component.html" ></iframe>

## 5.[until-destroy](https://github.com/ngneat/until-destroy)

一般說來，在 component 中，有對 Observable 進行 subcribe 的話，都會需要在 ngOnDestroy 中執行 unsubscribe。如果有很多 component 的話，每個都要這麼寫，卻時很煩人，所以我有發現[until-destroy](https://github.com/ngneat/until-destroy)，可以簡化需撰寫的程式碼。

```javascript
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { CityService } from "../city.service";
import { City } from "../models/City";

@UntilDestroy()
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  cities: City[];
  constructor(private cityService: CityService) {}

  ngOnInit() {
    this.cityService
      .getCities()
      .pipe(untilDestroyed(this))
      .subscribe(d => (this.cities = d));
  }
}
```

如同上方的程式，只需引用 UntilDestroy、untilDestroyed，不需在另外加上 Subject 或是 ngOnDestroy 之類的程式。

> `untilDestroyed`需要放在.pipe 的最後面才行，參考[RxJS: Avoiding takeUntil Leaks](https://medium.com/angular-in-depth/rxjs-avoiding-takeuntil-leaks-fb5182d047ef)

## 6.[ngx-dynamic-form-builder](https://github.com/EndyKaufman/ngx-dynamic-form-builder)

[ngx-dynamic-form-builder](https://github.com/EndyKaufman/ngx-dynamic-form-builder)是將 class-valdator 整合的 Angular library， 而 class-validator 則是驗證用的 Library，使用 decorator 設定資料驗證的規則。

我在上一篇的[文章](/blog/2020-03-13-classValidatorAndNgxDynamicFormBuilder)有介紹過。

## 結論

以上 6 個 Angular Library，除了[ng-select](https://github.com/ng-select/ng-select)外，其他的星星數都不是很多，但是卻很實用，推薦給大家參考看看。
