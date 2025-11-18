---
title: Uppy - 最方便的上傳套件
bgImageUrl: assets/images/11/11-0.jpg
published: true
tags: [uppy, file-upload, javascript]
---

一直以來，我都覺得上傳檔案的程式開發，是表單處理中的痛點，一般的&lt;input type="file" />的功能比較簡略，介面不甚美觀。之前有發現 Uppy 這個套件，就對它感興趣，現在已經出了 1.0 版，想寫篇文章記錄一下心得。

這篇的文章的原始碼在這邊[ngx-uppy-demo](https://github.com/thomascsd/ngx-uppy-demo)

## 安裝

```
npm install uppy
```

當執行 npm install uppy 時，是安裝 Uppy 的全部功能，這當然會使得安裝的檔案容量變大。

```
npm install @uppy/core @uppy/dashboard @uppy/xhr-upload
```

一般的作法，就是安裝所需的套件，如果想要使用 Dashboard，可以只安裝@uppy/dashboard 及@uppy/xhr-upload。

```
npm install @uppy/file-input @uppy/progress-bar @uppy/xhr-upload
```

如果只想要使用一般的 FileUpload，可以只安裝@uppy/file-input @uppy/progress-bar @uppy/xhr-upload

## 實作

### Angular

```javascript
@Component({
  selector: 'app-uppy',
  templateUrl: './uppy.component.html',
  styleUrls: ['./uppy.component.scss'],
})
export class UppyComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // Create Uppy object
  }
}
```

因為擅長的是 Angular，所以這個範例，想將 Angular 和 Uppy 整合，所以首先實作 AfterViewInit，確認頁面的 DOM 都戴入完成後，才能建立 Uppy 的物件。

### Dashboard

```html
<div class="container">
  <div class="uploadContainer"></div>
</div>
```

```javascript
import * as Uppy from '@uppy/core';
import * as Dashboard from '@uppy/dashboard';
import * as XHRUpload from '@uppy/xhr-upload';

const uppy = Uppy({
    autoProceed: true
});

uppy.use(Dashboard, {
    inline: true,
    target: '.uploadContainer'
});
uppy.use(XHRUpload, {
    endpoint: '/api/file',
    formData: true,
    fieldName: 'fileData'
});

uppy.on('upload-success', (file, response: any) => {
    this.imageDataService.add(response.body as ImageDatum);
});
```

使用 use 戴入所需的套件，這裡戴入 Dashboard 及 XHRUpload。

```javascript
uppy.use(Dashboard, {
  inline: true,
  target: '.uploadContainer',
});
```

Dashboard 的參數可以參考[官方文件](https://uppy.io/docs/dashboard/)。

- inline(true)：直接將 Dashoboard 顯示在頁面上。
- target('.uploadContainer')：Dashboard 顯示在 uploadContainer 上。

```javascript
uppy.use(XHRUpload, {
    endpoint: '/api/file',
    formData: true,
    fieldName: 'fileData'
});

uppy.on('upload-success', (file, response: any) => {
    this.imageDataService.add(response.body as ImageDatum);
});
```

XHRUpload 的參數可以參考[文件](https://uppy.io/docs/xhr-upload/)，`endpoint`指定 Server 端的 API 位置，並且是用監聽事件 upload-success 來判斷是否上傳成功。如此檔案或是圖片上傳的功能就完成。

<img class="img-responsive" loading="lazy" src="assets/images/11/11-1.png">

Dashboard 的畫面如上，因為 Uppy 是上傳套件，無法戴入圖片，所以這邊有使用另一個套件[ngx-gallery](https://github.com/MurhafSousli/ngx-gallery)。

### File Input

```javascript
uppy
.use(FileInput, {
  pretty: true,
  target: '.uploadContainer',
  inputName: 'fileData'
})
.use(Processbar, {
  target: 'body',
  fixed: true,
  hideAfterFinish: true
l
});

uppy.use(XHRUpload, {
    endpoint: '/api/file',
    formData: true,
    fieldName: 'fileData'
});

uppy.on('upload-success', (file, response: any) => {
    this.imageDataService.add(response.body as ImageDatum);
});
```

程式碼與 Dashboard 的很相似，戴入 FileInput 的套件及設定參數，可以參考[文件](https://uppy.io/docs/file-input/)。

- target('.uploadContainer')：FileInput 顯示在 uploadContainer 上。
- inputName('fileData')：傳送至 Server 的名稱為 fileData。

<img class="img-responsive" loading="lazy" src="assets/images/11/11-2.png">

FileInput 的畫面如上。

### Server

```javascript
import * as fileUpload from 'express-fileupload';
app.use(fileUpload());
```

Server 端是使用 express.js，而處理上傳檔案是用[express-fileupload](https://github.com/richardgirges/express-fileupload)這個套件。

```javascript
async handler(req: express.Request, res: express.Response) {
    const { fileData } = req['files'];
    const service = new FileService();

    const fileRes = await service.upload(fileData);
    return res.json(fileRes);
  }
```

只需用 req.files.fileData 就可以存取到所上傳的物件，而 fileData 就是在**XHRUpload**套件上所設定 fieldName 的值。

## 結綸

Uppy 是目前我覺得很方便的上傳套件，簡單幾段程式就可以實作檔案上傳。
