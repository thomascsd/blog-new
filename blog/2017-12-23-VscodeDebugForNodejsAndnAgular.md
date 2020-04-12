---
title: 使用VSCode偵錯Node.js及Angular的小技巧
---

使用Angular後就迷上了TypeScript，我有建立一個小專案叫做[angular-express-starter](https://github.com/thomascsd/angular-express-starter)，Server及Client端都是使用TypeScript建立的，而Client端是使用Angular CLI，然後Server端是使用Express.js。

因為Node.js在>8.0以上原生支援async/await，並且專案中
也會使用sequelize.js，所以新增tsconfig.server.json，並且target會指定為**ES6**：

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

而Client端是由Angular CLI建立的，並且tsconfig.json的tartget是指定**ES5**：
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
    "typeRoots": [
      "node_modules/@types",
      "node_modules/typescript/lib"
    ],
    "lib": [
      "es2016",
      "dom"
    ]
  }
}
```

偵錯時需要使用ts-node來啟用Node.js，而ts-node有個參數**project**可以指定tsconfig.json的路徑，在npm script可以這樣設定：

```
"start": "ts-node --project server ./server/app.ts"
```

## Node.js的除錯

其實VSCode已經內建Node.js偵錯

<img class="img-responsive" src="/images/03/03-1.png" alt="nodejs debug">

如上圖示所示，選擇「偵錯」>「新增組態」，再選擇「Node.js: 啟動程式」即可。

因為我是使用ts-node來啟用Node.js，需要傳入額外參數來指定tscofig.json的路徑，但是下列設定會發生錯誤，因為不支援二階參數：
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
所以需要換個方式改寫，先建立一個命名為tshook.js的js檔，內容如下：
```javascript
require("ts-node").register({
  project: "server/tsconfig.json",
});
```

直接在tshook.js中執行ts-node，然後再指定tsconfig.json的路徑。lauch.json改為下列：
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

按下F5或是綠色播放鍵即可進入偵錯模式，就很像Visual Studio偵錯.Net的程式一樣。

<img class="img-responsive" src="/images/03/03-2.png" alt="ng debug">

## Angular 偵錯
參考官方文件[Chrome Debugging with Angular CLI](https://github.com/Microsoft/vscode-recipes/tree/master/Angular-CLI)，有幾點需要注意：

1.Angular CLI需要**1.3**以上。

2.[Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)套件需要**3.1.4**以上。

>需注意的是要偵錯時需先用`npm start`啟用Angular應用程式，之後就可以按F5或是綠色播放鍵進入偵錯模式。


## 結論

1.使用VSCode偵錯Node.js就很像Visual Studio偵錯 .Net程式一樣，按下F5就會啟動應用程式。

2.偵錯Angular應用程式，需要執行ng serve啟動Angular，然後VSCode偵錯程式。
