---
title: 使用VSCode偵錯Node.js及Angular的小技巧
published: true
---

使用 Angular 後就迷上了 TypeScript，我有建立一個小專案叫做[angular-express-starter](https://github.com/thomascsd/angular-express-starter)，Server 及 Client 端都是使用 TypeScript 建立的，而 Client 端是使用 Angular CLI，然後 Server 端是使用 Express.js。

因為 Node.js 在>8.0 以上原生支援 async/await，並且專案中
也會使用 sequelize.js，所以新增 tsconfig.server.json，並且 target 會指定為**ES6**：

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "../out-tsc/server",
    "baseUrl": "",
    "target": "es6"
  }
}
```

而 Client 端是由 Angular CLI 建立的，並且 tsconfig.json 的 tartget 是指定**ES5**：

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "baseUrl": "src",
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "es5",
    "typeRoots": ["node_modules/@types", "node_modules/typescript/lib"],
    "lib": ["es2016", "dom"]
  }
}
```

偵錯時需要使用 ts-node 來啟用 Node.js，而 ts-node 有個參數**project**可以指定 tsconfig.json 的路徑，在 npm script 可以這樣設定：

```
"start": "ts-node --project server ./server/app.ts"
```

## Node.js 的除錯

其實 VSCode 已經內建 Node.js 偵錯

<img class="img-responsive" src="assets/images/03/03-1.png" alt="nodejs debug">

如上圖示所示，選擇「偵錯」>「新增組態」，再選擇「Node.js: 啟動程式」即可。

因為我是使用 ts-node 來啟用 Node.js，需要傳入額外參數來指定 tscofig.json 的路徑，但是下列設定會發生錯誤，因為不支援二階參數：

```json
   {
      "name": "ts-node",
      "type": "node",
      "request": "launch",
      "args": ["${workspaceRoot}/server/index.ts"],
      "runtimeArgs": ["--nolazy", "-r", "ts-node/register", "-p server"],
      "sourceMaps": true,y
      "cwd": "${workspaceRoot}",
      "protocol": "inspector",
      "env": {
        "NODE_ENV": "dev"
      }
```

所以需要換個方式改寫，先建立一個命名為 tshook.js 的 js 檔，內容如下：

```javascript
require('ts-node').register({
  project: 'server/tsconfig.json',
});
```

直接在 tshook.js 中執行 ts-node，然後再指定 tsconfig.json 的路徑。lauch.json 改為下列：

```json
{
  "name": "ts-node",
  "type": "node",
  "request": "launch",
  "args": ["${workspaceRoot}/server/index.ts"],
  "runtimeArgs": ["--nolazy", "-r", "${workspaceRoot}/tshook.js"],
  "sourceMaps": true,
  "cwd": "${workspaceRoot}",
  "protocol": "inspector",
  "env": {
    "NODE_ENV": "dev"
  }
}
```

按下 F5 或是綠色播放鍵即可進入偵錯模式，就很像 Visual Studio 偵錯.Net 的程式一樣。

<img class="img-responsive" src="assets/images/03/03-2.png" alt="ng debug">

## Angular 偵錯

參考官方文件[Chrome Debugging with Angular CLI](https://github.com/Microsoft/vscode-recipes/tree/master/Angular-CLI)，有幾點需要注意：

1.Angular CLI 需要**1.3**以上。

2.[Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)套件需要**3.1.4**以上。

> 需注意的是要偵錯時需先用`npm start`啟用 Angular 應用程式，之後就可以按 F5 或是綠色播放鍵進入偵錯模式。

## 結論

1.使用 VSCode 偵錯 Node.js 就很像 Visual Studio 偵錯 .Net 程式一樣，按下 F5 就會啟動應用程式。

2.偵錯 Angular 應用程式，需要執行 ng serve 啟動 Angular，然後 VSCode 偵錯程式。
