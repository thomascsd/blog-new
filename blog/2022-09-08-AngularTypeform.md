---
title: Angular TypeForm - 強型別Form的心得
bgImageUrl: assets/images/25/25-0.jpg
description: Angular v14 中最重要的 2 個功能，除了 Single Component 之外，就是 Typeform 了，而 Typeform 也就是在建立 Form 功能時，終於可以套用型別，方便開發及除錯，是期待很久的功能
published: true
---

在 Angular v14 中最重要的 2 個功能，除了 Single Component 之外，就是 Typeform 了，而 Typeform 也就是在建立 Form 功能時，終於可以套用型別，方便開發及除錯，是期待很久的功能。
查詢[官方文件](https://angular.tw/guide/typed-forms)可以發現，範列都是使用從建立 'FormGroup'，再建立 'FormControl' 的方式。

<img class="img-responsive" loading="lazy" src="assets/images/25/25-01.png">

本人還是比較偏好用 `FormBuilder` 來建立 FormGroup，所以分享一下用 `FromBuilder` 建立的心得。

## 使用方式

```javascript
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, NgForm, Validators, UntypedFormBuilder } from '@angular/forms';
```

首先使用 Angular CLI 來將之前建立的小專案升級至 V.14，如上，升級後原本的程式會自動轉換成 `UntypedFormGroup` 、 `UntypedFormBuilder`。

```javascript
import { FormGroup, NgForm, Validators, FormBuilder, FormControl } from '@angular/forms';

interface MemberForm {
  id?: FormControl<string>;
  name: FormControl<string>;
  email: FormControl<string>;
  mobile: FormControl<string>;
  birthday: FormControl<string>;
  account: FormControl<string>;
  password: FormControl<string>;
}
```

接著替換成 `FormGroup`、 `FormBuilder`，並且建立使用於 `FormBuilder` 上的 interface。

```javascript
group: FormGroup<MemberForm>;
```

接著在 `FormGroup` 中使用已建立的 `MemberForm`。

```javascript
  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.group = this.fb.nonNullable.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      mobile: new FormControl('', Validators.required),
      birthday: new FormControl('', Validators.required),
      account: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

  }

```

之後像之前 v.13 的一樣寫法，使用 'group' 方式來建立 `FormGroup` ，因為每個屬性都是必填，所以設定 `Validators.required` 。

```javascript
class Member extends BaseModel {
  name = '';
  email = '';
  mobile = '';
  birthday = '';
  password = '';
}

interface MemberForm {
  id?: FormControl<string>;
  name: FormControl<string>;
  email: FormControl<string>;
  mobile: FormControl<string>;
  birthday: FormControl<string>;
  account: FormControl<string>;
  password: FormControl<string>;
}
```

一般說來，每個 Form 都會有相對應的 Model，也就是類型，比如上面程式碼中的 `Member`。而 `FormGroup` 也會建立都是相同屬性的類型，比如上面程式碼的 `MemberForm` ，如此就會重覆建立。

```javascript
import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type Unpacked<T> = T extends Array<infer U> ? U : T;

export type ToForm<OriginalType> = {
  [key in keyof OriginalType]: OriginalType[key] extends Array<any>
    ? FormArray<
        Unpacked<OriginalType[key]> extends object
          ? FormGroup<ToForm<Unpacked<OriginalType[key]>>>
          : FormControl<Unpacked<OriginalType[key]> | null>
      >
    : OriginalType[key] extends object
    ? FormGroup<ToForm<OriginalType[key]>>
    : FormControl<OriginalType[key] | null>;
};
```

可以參考文章[搶先體驗強型別表單（Strict Typed Reactive Forms）](https://fullstackladder.dev/blog/2022/05/15/angular-14-strict-typed-reactive-forms/)，就可以方便轉換。

```javascript
import { ToForm } from '../utils/toForm';

group: FormGroup<ToForm<Member>>;
```

只需改成 `FormGroup<ToForm<Member>>` 即可。

## [class-validator](https://github.com/typestack/class-validator)

因為驗證是每個 Form 都是必須會需要做的行為，所以會使用 `class-validator` 來共同驗證，之前有接觸過 `class-validator` 這個套件，是用 decorator 的方式，在物件的屬性上設定所要驗證的格式，之前都是在 Node.js 上來使用，不過 Angular 上使用的話，需要整合一下。

```javascript
import {
  IsNotEmpty,
  IsEmail,
  IsMobilePhone,
  ValidationOptions,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { plainToClassFromExist } from 'class-transformer';
import { BaseModel } from './baseModel';

const options: ValidationOptions = { message: '填寫正式資料' };

export class Member extends BaseModel {
  @IsNotEmpty({
    message: '姓名需填寫',
  })
  name = '';

  @IsNotEmpty({
    message: 'Email需填寫',
  })
  @IsEmail()
  email = '';

  @IsNotEmpty({
    message: '手機需填寫',
  })
  @IsMobilePhone(
    'zh-TW',
    {
      strictMode: false,
    },
    {
      message: '手機需填寫',
    }
  )
  mobile = '';

  birthday: string;

  @IsNotEmpty(options)
  @MinLength(6, options)
  @MaxLength(12, options)
  @Matches(/[a-zA-Z\d]/g, options)
  account = '';

  @IsNotEmpty(options)
  @MinLength(6, options)
  @MaxLength(12, options)
  @Matches(/[a-zA-Z\d]/g, options)
  password = '';

  constructor(data?: any) {
    super();
    plainToClassFromExist(this, data);
  }
}
```

`class-validator` 預設已經定義一些常用的驗證方式，例如是否必填、Email 或是手機驗證，直接套用在類別上的屬性即可，可以參考[文件](https://github.com/typestack/class-validator#validation-decorators)。

```javascript
import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { validateSync } from 'class-validator';

export function utilValidator<T extends {}>(model: T, prop: string): ValidatorFn {
  return (control): ValidationErrors | null => {
    let invalid = false;

    model[prop] = control.value;

    const errors = validateSync(model, {
      skipMissingProperties: true,
    });

    if (errors && errors.length) {
      const propError = errors.filter((e) => e.property == prop);

      if (propError.length > 0) {
        const msg = propError.map(({ constraints }) => Object.values(constraints).join(', '));
        invalid = true;

        return { hasError: invalid && (control.dirty || control.touched), msg };
      }
    }

    return null;
  };
}
```

為了要將 'class-validator' 和 'FormGroup' 、'FormControl' 整合，本人建立了共同方法，首先使用 `validateSync` 來驗證 model，接著取得特定屬性的錯誤訊息。

```html
<div class="text-danger" *ngIf="group.controls.name.errors?.hasError">
  {{ group.controls.name.errors?.msg }}
</div>
```

而如果有錯誤的話，固定回傳格式為 `{ hasError: true, msg }`，所以頁面上只需判斷 `hasError === true`即可。

<img class="img-responsive" loading="lazy" src="assets/images/25/25-02.png">

並且因為是強型別的關系，在 html 上也有程式碼提示的幫助。

## 結論

一直以來，TypeForm 就是榜上有名的希望實作的功能，對於開發及除錯的幫助很大，我將以前的小專案改為 TypeForm 的方式嘗試看看，這是小小的心得分享。
