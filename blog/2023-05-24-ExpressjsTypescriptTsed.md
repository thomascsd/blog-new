---
title: 使用TypeScript建立Express.js-使用Ts.ED
bgImageUrl: assets/images/27/27-0.jpg
description: Ts.ED 是一個強大且易於使用的 framework，可以將 TypeScipt 與 Express.js整合，並使用 Controller 的方式建立 Express.js
published: true
tags: [nodejs, express, typescript, tsed]
---

之前有寫過一篇文章[使用 TypeScript 建立 Express.js](https://thomascsd.github.io/blog/2021-02-07-ExpressjssWithTypescript)，介紹了 [routing-controllers](https://github.com/typestack/routing-controllers)，可以將 `TypeScipt` 與 `Express.js`整合，並使用 Controller 的方式建立 `Express.js`，然而發現套件更新有點緩慢，最近在該專案的[GitHub issue](https://github.com/typestack/routing-controllers/issues/900)中有人詢問是否已經停止維護，並在此 isssue 中發現了另一個相似的套件[Ts.ED](https://tsed.io/)。在研究和測試後，覺得可以將程式轉換到 Ts.ED，寫篇心得文分享。

## 建立專案

```bash
npm install -g @tsed/cli
tsed init .
```

參考[Getting started](https://tsed.io/getting-started/)，首先安裝 CLI 工具，再初始化專案。

<img class="img-responsive" loading="lazy" src="assets/images/27/27-01.png">

TS.ed 本身會與一些套件整合，可以勾選想要整合的功能，一般的選擇是 Testing、Linter、Swagger。

<img class="img-responsive" loading="lazy" src="assets/images/27/27-02.png">

接著等待安裝完相依性的套件之後，就可以開啟專案開發了。
另外因為覺得[文件](https://tsed.io/docs/configuration.html)寫得有點分散，所以這篇文章會大致說明一下，從設定 Server，再到建立 Controller，最後建立 Service 的步驟。

## 設定 Server

```typescript
@Configuration({
  httpPort: '127.0.0.1:8080',
  mount: {
    '/': [ApiController],
  },
  swagger: [
    {
      path: '/doc',
      specVersion: '3.0.1',
    },
  ],
  middlewares: ['cors', 'helmet', 'compression', 'method-override', 'json-parser'],
  views: {
    root: join(process.cwd(), '../views'),
    extensions: {
      ejs: 'ejs',
    },
  },
})
export class Server {
  @Inject()
  protected app: PlatformApplication;
}
```

一般會建立類別 `Server`，並且用`@Configuration`來設定 Server 的行為，可參考[文件 Configuration](https://tsed.io/docs/configuration.html)，講解一下常用的設定。

- mount：設定路由，因想設為每個 API 的起始路由為 api，所以使用了 [Nested Controller](https://tsed.io/docs/controllers.html#nested-controllers)。
- middlewares：來戴入 Expression.js 的 middlewares。
- swagger：Swagger 的相關設定，例如 API 文件的路徑和規格版本。

## 啟動 Application

```javascript
import { PlatformExpress } from '@tsed/platform-express';
import Server from './server';
import dotenv from 'dotenv';
import 'reflect-metadata';

const config = dotenv.config({
  path: '.env',
});

async function bootstrap() {
  let httpPort: string | number = 8080;

  try {
    if (process.env.MODE === 'dev') {
      httpPort = '127.0.0.1:8080';
    }
    const configObj = {
      ...config.parsed,
      httpPort,
    };

    const platform = await PlatformExpress.bootstrap(Server, configObj);
    await platform.listen();
  } catch (er) {
    $log.error(er);
  }
}

bootstrap();
```

接著在`index.ts`中，呼叫`PlatformExpress.bootstrap`來啟動 `Express.js`，而`boostrap`的第一個參數就是剛剛建立`Server`物件，而一般來說，都會使用`.env`來儲存設定，所以可以將 config 物件傳入至第二個參數。並且這邊有個小技巧，可以覆寫在`Server.ts`的`Configuration`的設定，比如正式及測試所使用的 port 不相同，所以就根據正式或是測試來切換`httpPort`。

## Controller

```javascript
@Controller({
  path: '/api',
  children: [ForecastController, ContactController],
})
export class ApiController {}
```

TS.ed 支援 Nested Controller 的設定方式，因為想將所有的 API 起始路由設為 `/api`，可以使用屬性 `children`，來包含其他的 controller。

```javascript
@Controller('/contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Get('/list')
  getContacts() {
    return this.contactService.getContacts();
  }

  @Post('/save')
  saveContact(@BodyParams() contact: Contact) {
    return this.contactService.saveContact(contact);
  }

  @Post('/update')
  update(@BodyParams() contact: Contact) {
    return this.contactService.updateContact(contact);
  }
}
```

- 與`routing-controllers`相似，使用 Decorator `@Controller`來定義 Controller 設定路由，以及使用`@Get`、`@Post`來定義 Action。
- 使用`@BodyParams`來對應`request.body`。
- 再來也支援 Depenency Injection，一樣是在建構函式中宣告想注入的類別。

## Service

```javascript
@Service()
export class ForecastService {
  @Value('WEATHERBIT_API_KEY')
  apiKey!: string;

  async getDays(lat: number, lon: number) {
    const url = `${this.apiUrl}?key=${this.apiKey}&lang=zh-tw&lat=${lat}&lon=${lon}`;
    const res = await axios.get<Daily>(url);

    return res.data;
  }
}
```

- 使用`@Service`來讓 class 成為 Service，代表著這個 class 可以被注入至其他的 Service 或是 Controller 中。
- 使用`@Value`可以取得設定檔.env 內所設定的 value，這邊取得 API key。

## 啟動

<img class="img-responsive" loading="lazy" src="assets/images/27/27-03.png">

```json
"scripts": {
    "start": "node ./dist/index.js",
    "dev": "ts-node ./src/index.ts",
    "build": "tsc"
  },
```

啟動很簡單的，只要執行`index.js`即可，而我習慣在本機開發階段是使用`ts-node`啟用，如此方便使用 VSCode 來 debug。並且站台啟用後，還可以看到輸出內容上顯示執行時間，及 api 列表，能一目了然目前狀態。

## 結論

總結而言，Ts.ED 是一個強大且易於使用的 framework，並且在最新版 7.0.0 之後，不只 Express.js，還會支援 Koa、Fastify，而且與 TypeScript 整合，開發很容易，推薦給大家參考看看。
