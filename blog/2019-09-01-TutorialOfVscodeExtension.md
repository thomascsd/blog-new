---
title: VSCode Extension的開發心得
bgImageUrl: assets/images/12/12-0.jpg
published: true
tags: [vscode, extension, javascript]
---

[2020/08/29 更新：加上 package.json 的設定]

前一陣子，開發了產生 README.md 的 VSCode - [Readme Pattern](https://marketplace.visualstudio.com/items?itemName=thomascsd.vscode-readme-pattern)，如何大家還沒安裝的話，可以試試看。在開發中，有遇到一些問題，以及累積了一些心得，分享給的大家。

## 初始

首先按照[官方文件](https://code.visualstudio.com/api/get-started/your-first-extension)，需要先安裝[Yeoman](https://yeoman.io/)以及 VS Code Extension Generator。

```
npm install -g yo generator-code
```

輸入`yo code`，來初始化 VSCode extesion 專案，接著輸入一些參數，這邊我是用 TypeScript 開發的，接著輸入一些參數後，就可以很輕易的建立一個樣板。

<img class="img-responsive" loading="lazy" src="assets/images/12/12-1.png">

<img class="img-responsive" loading="lazy" src="assets/images/12/12-2.png">

## package.json 的設定

```
{
   "activationEvents": [
     "onCommand:extension.readme",
     "onCommand:extension.readmeOnExplorer"
  ],
  "contributes": {
    "commands": [
      {
        "command": "extension.readme",
        "title": "readme: Generates README.md"
      },
      {
        "command": "extension.readmeOnExplorer",
        "title": "readme: Generates README.md on here"
      }
    ],
  },
}
```

需要在`activationEvents`及`contributes.commands`這 2 個地方都需加上需執行的 command，有多少的 command 就加上多少，不然 command 不會有作用。

## 建立

因為 VSCode 是使用 Electron 來開發的，代表使用 Node.js 的模組是沒有問題的，所以這邊有使用到`path`及`fs`。

> 在 1.37 版之後，VSCode Extension API 有增加 vscode.workspace.fs 來取代 fs，是由於需要遠端存取檔案，可參考[VSCode 更新記錄 1.37](https://code.visualstudio.com/updates/v1_37#_extension-authoring)， 並且要注意的是，vscode 套件被拆分為@types/vscode 及 vscode-test。

### 取得檔案的路徑

一開始遇到的第一個問題是不知道專案內的檔案路徑是什麼?因為需要戴入 Markdown 檔案。

查看範例及文件後，發現使用下列方法即可：

> ExtensionContext.asAbsolutePath('relative path');

```javascript
const tempPath = this.context.asAbsolutePath(path.join('templates', `${selectedItem}.md`));
```

可以將相對路徑轉換成目前檔案的路徑，另外為了跨平台的相容性，相對路徑應該使用`path.join`來連結各個目錄及檔案。

### 工作區(Workspace)

接著要將處理過後的內容，寫入至工作區，而取得工作區路徑的方式：

> vscode.workspace.workspaceFolders

```javascript
const folders = vscode.workspace.workspaceFolders;
if (folders) {
  const url = folders[0].uri;
}
```

這邊取得第 1 個的路徑，最後用`writeFile`將檔案寫入。

### 建立項目清單

<img class="img-responsive" loading="lazy" src="assets/images/12/12-3.png">

如上圖，有時會需要讓人選擇，可以使用下列 API 來顯示選項：

> vscode.window.showQuickPick

```javascript
const items: string[] = ['Bot', 'Hackathon', 'Minimal', 'Standard'];
const selectedItem = await vscode.window.showQuickPick(items, {
  placeHolder: 'Select readme pattern that you want',
});
```

這邊是傳入所顯示的字串陣例，並且`showQuickPick`是非同步的，所以使用 async/await 的方式，取得回傳所選擇的值。

## README 的注意事項

如果 extension 有截圖，截圖的完整路徑必須為https://raw.githubusercontent.com/{user}/{repository}/{branch}/{path}的形式，不然在VSCode marketplace 會因為安全名單的關係，會看不到截圖。

## 結論

這是我第一次建立 VSCode extension，只要按照官方文件及 Yeoman 就可以快速建立一個樣板，但是最花時間是查看範例及文件。老實說，[官方範例](https://github.com/microsoft/vscode-extension-samples)不是很清楚，要花些時間來查看。除些之外開發這個 extension 也是很有趣的經驗，分享給大家。
