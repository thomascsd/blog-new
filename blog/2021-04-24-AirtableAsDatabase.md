---
title: 將AirTable做為資料庫的心得
bgImageUrl: assets/images/19/19-0.png
published: true
---

當開始寫自已的 Side Project 時，常常遇到問題是，不知道要將資料寫入至那裡?最初是使用[restdb](https://restdb.io/)，優點：很好串接，有 UI 介面很好設定，但是只能有 2 個免費的。
之後尋找了一些解決方案，發現[AirTable](https://airtable.com/)符合我的需求。

- 優點： -有 UI 介面，可以很方便設定欄位。
- 欄位支援很多的類型，連自動編號的類型也有。 -使用 CSV，直接匯入。 -缺點： -每秒可接受的 Request 數有限制，現在每秒最多是 5 個 Request，如果是一般小的 Side Project，這個限制還可以接受。

## 串接方式

首先要串接至 AirTable 需要 ApiKey ，可以參考[文件](https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-)，接著取得 Base ID，如下圖所示，點選 Help > API documetation。

<img class="img-responsive" loading="lazy" src="assets/images/19/19-1.png">

在文件中就可以找到呼叫 API 時，需要的 Base ID。並且也可以看到官方的 JavaScript API client，但是我覺得官方的不好用，會使用其他的 Libary 來串接。

<img class="img-responsive" loading="lazy" src="assets/images/19/19-2.png">

### 使用 API Client

尋找及測試 2 個套件後，最後我選擇了[async-airtable](https://github.com/GV14982/async-airtable)，這個套件最主要是 Wrapper Libary，將 AirTable API 包裝成容易呼叫的形式，並因為是使用 TypeScript 開發的，而且到最近都有更新，所有決定採用了。

```javascript
import AsyncAirtable from 'asyncairtable';
import { AirtableRecord, SelectOptions } from 'asyncairtable/lib/@types';
import { Service, Inject, Token } from 'typedi';
import { BaseModel } from '../models/BaseModel';

@Service()
export class DataService {
  async getDatas<T extends BaseModel>(
    baseId: string,
    tableName: string,
    options?: SelectOptions
  ): Promise<T[]> {
     ........
  }

  async saveData<T extends BaseModel>(baseId: string, tableName: string, model: T) {
    .........
  }

  async updateData<T extends BaseModel>(baseId: string, tableName: string, model: T) {
    .........
  }

async deleteData<T extends BaseModel>(baseId: string, tableName: string, model: T) {
    ..........
  }

}

```

另外有寫一個泛型類別將這些包裝起來，定義了新增、修改、刪除及查詢的方法，希望所有的 Model 都是使用相同的方式來存取資料。

## 取得資料

```javascript
// BaseModel.ts
export interface BaseObj extends Record<string, unknown> {
  id?: string;
}

export class BaseModel implements BaseObj {
  [x: string]: unknown;
  id?: string;
}
```

接著再建立 BaseModel class，將做為所有 Model 的基礎類別，`T extends BaseModel`，以及繼承`Record<string, unknown>`來做為轉換成`AirTableRecord`的準備。

> Recored<key, value>是 TypeScript 內建的 Helper，它的定義如下：

```javascript
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

> 就是可以快速宣告 key/value 組合的型別，之前可能需要這樣宣告：

```javascript
interface Options {
  [key: string]: string;
}
```

> 現在只要這麼寫

```javascript
type Options = Record<string, string>.
```

```
{
  id: 'recYFjxxUF7EWAhH5',
  fields: {
    name: 'thomas123',
    email: 't@sample.com',
    mobile: '0999123456'
    },
  createdTime: '2021-04-17T10:18:47.000Z'
}
```

AirtTable 回傳的資料格式如上，id 是自動建立的唯一 key 值，而`fields`就是所定義的欄位，而我的目標就是將`fields`這塊抽出來。

```javascript
async getDatas<T extends BaseModel>(
    baseId: string,
    tableName: string,
    options?: SelectOptions
  ): Promise<T[]> {
    const airtable = this.getAirTableClient(baseId);
    const records: AirtableRecord[] = await airtable.select(tableName, options);

    const body = records
      .map((o: AirtableRecord) => {
        const fields = o.fields;
        fields.id = o.id;
        return fields;
      })
      .map(fields => {
        const obj: Record<string, unknown> = { ...fields };
        return obj;
      }) as T[];

    return body;
  }
```

綄合上述的程式，取得資料的地方，使用 2 個`Map`來轉換`T[]`：

- 第 1 個`Map`是要將 fields 屬性抽出，並將唯一值指派至`fields`上。
- 第 2 個`Map`是為了轉成`T[]`，建立一個物件，使用 [spread operator](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/Spread_syntax) 複製`fields`至物件中，最後轉型成`T[]`。

## 新增資料

```javascript
async saveData<T extends BaseModel>(baseId: string, tableName: string, model: T) {
    const airtable = this.getAirTableClient(baseId);
    const body = await airtable.createRecord(tableName, model);

    return body;
  }
```

新增就很單純，將 Model 物件傳入 `createRecord`方法即可在 AirtTable 新增一筆資料。

## 更新資料

```javascript
async updateData<T extends BaseModel>(baseId: string, tableName: string, model: T) {
    const airtable = this.getAirTableClient(baseId);
    const tmpModel = { ...model };
    const id = tmpModel.id;
    delete tmpModel.id;
    const body = await airtable.updateRecord(tableName, {
      id: id as string,
      fields: tmpModel,
    });

    return body;
  }
```

更新和新增類似，會多傳入唯一鍵值 id ，執行`updateRecord`即可完成，而這邊`delete tmpModel.id`的目的是，id 是自動產生的，所以不需要傳入至 AirTable。

## 結論

雖然還有其他的儲存資料的解決方案，比如使用 Google sheets，或是使用其它的雲端免費方案，但使用 AirTable 一陣子後，有符合我的期待，目前使用蠻滿意的。
有將這些程式包成 [npm package]()，大家可以參考看看。

原始碼的位置：[https://github.com/thomascsd/stools](https://github.com/thomascsd/stools)
