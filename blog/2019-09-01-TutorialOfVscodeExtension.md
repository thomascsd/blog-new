---
title: VSCode Extension的開發心得
bgImageUrl: /images/12/12-0.jpg
---

 前一陣子，開發了產生README.md的VSCode - [Readme Pattern](https://marketplace.visualstudio.com/items?itemName=thomascsd.vscode-readme-pattern)，如何大家還沒安裝的話，可以試試看。在開發中，有遇到一些問題，以及累積了一些心得，分享給的大家。

## 初始

首先按照[官方文件](https://code.visualstudio.com/api/get-started/your-first-extension)，需要先安裝[Yeoman](https://yeoman.io/)以及VS Code Extension Generator。

```
npm install -g yo generator-code
```

輸入``yo code``，來初始化VSCode extesion專案，接著輸入一些參數，這邊我是用TypeScript開發的，接著輸入一些參數後，就可以很輕易的建立一個樣板。

<img class="img-responsive" src="/images/12/12-1.png">


<img class="img-responsive" src="/images/12/12-2.png">

## 建立

因為VSCode是使用Electron來開發的，代表使用Node.js的模組是沒有問題的，所以這邊有使用到``path``及``fs``。

> 在1.37版之後，VSCode Extension API有增加vscode.workspace.fs來取代fs，是由於需要遠端存取檔案，可參考[VSCode 更新記錄 1.37](https://code.visualstudio.com/updates/v1_37#_extension-authoring)， 並且要注意的是，vscode套件被拆分為@types/vscode及vscode-test。

### 取得檔案的路徑

一開始遇到的第一個問題是不知道專案內的檔案路徑是什麼?因為需要戴入Markdown檔案。

查看範例及文件後，發現使用下列方法即可：

>  ExtensionContext.asAbsolutePath('relative path');

```javascript
const tempPath = this.context.asAbsolutePath(path.join('templates', `${selectedItem}.md`));
```

可以將相對路徑轉換成目前檔案的路徑，另外為了跨平台的相容性，相對路徑應該使用``path.join``來連結各個目錄及檔案。

### 工作區(Workspace)

接著要將處理過後的內容，寫入至工作區，而取得工作區路徑的方式：

> vscode.workspace.workspaceFolders

```javascript
const folders = vscode.workspace.workspaceFolders;
if (folders) {
   const url = folders[0].uri;
}
```

這邊取得第1個的路徑，最後用``writeFile``將檔案寫入。

### 建立項目清單

<img class="img-responsive" src="/images/12/12-3.png">

如上圖，有時會需要讓人選擇，可以使用下列API來顯示選項：

> vscode.window.showQuickPick

```javascript
const items: string[] = ['Bot', 'Hackathon', 'Minimal', 'Standard'];
const selectedItem = await vscode.window.showQuickPick(items, {
   placeHolder: 'Select readme pattern that you want'
});
```

這邊是傳入所顯示的字串陣例，並且``showQuickPick``是非同步的，所以使用async/await的方式，取得回傳所選擇的值。

## README的注意事項

如果extension有截圖，截圖的完整路徑必須為https://raw.githubusercontent.com/{user}/{repository}/{branch}/{path}的形式，不然在VSCode marketplace會因為安全名單的關係，會看不到截圖。

## 結論

這是我第一次建立VSCode extension，只要按照官方文件及Yeoman就可以快速建立一個樣板，但是最花時間是查看範例及文件。老實說，[官方範例](https://github.com/microsoft/vscode-extension-samples)不是很清楚，要花些時間來查看。除些之外開發這個extension也是很有趣的經驗，分享給大家。



