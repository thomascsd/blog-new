---
title: 使用TypeScript建立Express.js
bgImageUrl: assets/images/18/18-0.png
published: true
---

(2021-04-26 更新)service class 注入，@Inject 改為 @Service。

Express.js 是很受歡迎的 Node.js 框架，一般看來，比較少文章介紹使用 TypeScript 建立 Express.js，所以就想寫篇使用 TypeScript 建立 Express.js 的方式，並且 Express.js 的架構是比較鬆散的，並且有發現兩個套件：[routing-controller](https://github.com/typestack/routing-controllers)及[typedi](https://github.com/typestack/typedi)，一些心得感想，請大家參考看看。

## 起手式

首先使用 npm 建立 node.js 的站台，將它命名為 webapi。

```
npm new webapi -y
```

接著安裝 Express.js 及用 TypeScript 開發所使用的套件。

```
npm install express @types/node @types/express
```

## 建立 Server

```javascript
import * as express from 'express';
```

首先使用 ESM 的語法戴入 express。

```javascript
// Server.ts
export default class Server {
  public app: express.Application;
  private distFolder = path.join(__dirname, '..', 'client');

  constructor() {
    this.app = express();
    this.config();
    this.route();
  }

  public config() {
    this.app.set('view engine', 'html');
    this.app.set('views', 'src');

    // Server static files from /dist
    this.app.get('*.*', express.static(this.distFolder));
  }

  public route() {
    this.app.get('*', (req, res, next) => {
      if (req.url.indexOf('/api') !== -1) {
        next();
      } else {
        res.sendFile(path.join(this.distFolder, 'index.html'));
      }
    });
  }

  public run(port: number) {
    this.app.listen(port, () => {
      console.log(`App run in Port: ${port}`);
    });
  }
}
```

接著我習慣建立 class，所以這邊建立名為`Server`的 class，建立了 3 個方法：

- config：是設定 Express.js。

  - `this.app.get('_.\*', express.static(this.distFolder));`：因為前端是用 SPA 的架構，所以指定靜態檔案是導向 html 的路徑。

- route：預設的路由，由於前端是 SPA 的原故，除了網址包點`api`之除，其於皆會導向 index.html。
- run：供外部程式呼叫，啟動 Web Server。

```javascript
// index.ts
import 'reflect-metadata';
import Server from './server';
const server = new Server();
const port: number = parseInt(process.env.PORT, 10) || 3000;
server.run(port);
```

再來就建立進入點 index.ts，這邊很單純的，建立 server 物件，執行 run 的方法。

## tsconfig.json

tsconfig 設定有時候覺得很麻煩，有發現一個 npm package：[tsconfigs](https://github.com/mightyiam/tsconfigs)，如此可以比較清鬆的設定。

```
{
  "compileOnSave": false,
  "compilerOptions": {
    "module": "esnext",
    "outDir": "./dist/",
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "ESNext",
    "typeRoots": ["node_modules/@types"],
    "lib": ["ESNext"]
  },
  "baseUrl": "src"
}
```

或是可以參考上方的設定方式，因為會使用 decorator ，所以將`emitDecoratorMetadata`及`experimentalDecorators`設為`true`。

## 加上架構

Express.js 的架構比較自由、鬆散，沒有規定要如何建立，這讓本人困擾了一段時間，之後參考這篇[文章](https://www.coreycleary.me/project-structure-for-an-express-rest-api-when-there-is-no-standard-way/)，所以設定以下的目錄結構。

<img class="img-responsive" loading="lazy" src="assets/images/18/18-1.png">

要如何實作 controller 架構，之後有發現 [routing-controllers](https://github.com/typestack/routing-controllers)，可以與 Express.js 整合，輕鬆實作 controller 架構。

接著也希望能夠可以在 Express.js 實現 DI(Dependency Injection)，所以使用了[typedi](https://github.com/typestack/typedi)，配合這 2 個套件如此可以實作本人覺得不錯的架構。

### routing-controllers & typedi

```
npm install routing-controllers typedi class-validator class-transformer
```

使用 npm 安裝 routing-controllers、typedi，以及相依性的 package。

```javascript
// ContactControoler.ts
import { JsonController, Get, Post, Body } from 'routing-controllers';
import { Service } from 'typedi';
import { ContactService } from '../services/ContactServices';
import { Contact } from '../models/Contact';

@Service()
@JsonController()
export class ContactController {
 constructor(private contactService: ContactService) {}

 @Get('/contact/list')
 getContacts() {
  return this.contactService.getContacts();
 }

 @Post('/contact/save')
 saveContact(@Body() contact: Contact) {
  return this.contactService.saveContact(contact);
 }

 @Post('/contact/update')
 update(@Body() contact: Contact) {
  return this.contactService.updateContact(contact);
 }
}
```

建立 controller 的方式很直覺，只要在 class 上加上 decorator `@Controller()`即可，因為是回傳 JSON，所以是使用`@JsonController()`。

路由建立的方式也是一樣，使用`@Get`、`@Post`，再傳入路由路徑即可。

而 DI 也是同樣的，在 class 上加上`@Inject()`代表著可以被注入，如同`ContactService`會在 runtime 時被建立實體。

```javascript
// Server.ts
import { useExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';

constructor() {
    useContainer(Container);
    this.app = express();
    this.config();
    this.setControllers();
  }

public setControllers() {
    useExpressServer(this.app, {
      routePrefix: 'api',
      controllers: [__dirname + '/controllers/**/*.js'],
    });
  }

```

要將 routing-controllers、typedi 與 Express.js 整合也很簡單，使用`useExpressServer`並戴入 controllers。

### Snippets

因為每次都要設定 controller 覺得很麻煩，本人有[自定義 snippets](https://gist.github.com/thomascsd/19e1814f1b89c01588fa7f9f18540b20)，來減少一些重覆輸入的程式碼。

<img class="img-responsive" loading="lazy" src="assets/images/18/18-2.gif">

## 安全性

除了上面的設定之外，最好可以於 Request 的 Header 上設定一些項目來增加網站的安全性，這時可以使用套件：[helmet](https://github.com/helmetjs/helmet)，設定方式如下。

```javascript
import * as helmet from 'helmet';
this.app.use(helmet());
```

另外可以參考這篇[文章](https://wanago.io/2020/12/14/security-express-applications-helmet-middleware/)，總共調整了那些項目。

## 結論

以上就是我花了一段時間反復測試後，覺得不錯的 Express.js 的架構，並且有建立範本[angular-express-starter](https://github.com/thomascsd/angular-express-starter) ，請大家參考看看。
