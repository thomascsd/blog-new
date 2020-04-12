---
title: Uppy - 最方便的上傳套件
bgImageUrl: /images/11/11-0.jpg
---

一直以來，我都覺得上傳檔案的程式開發，是表單處理中的痛點，一般的&lt;input type="file" />的功能比較簡略，介面不甚美觀。之前有發現Uppy這個套件，就對它感興趣，現在已經出了1.0版，想寫篇文章記錄一下心得。

這篇的文章的原始碼在這邊[ngx-uppy-demo](https://github.com/thomascsd/ngx-uppy-demo)

## 安裝

```sh
npm install uppy
```

當執行npm install uppy時，是安裝Uppy的全部功能，這當然會使得安裝的檔案容量變大。

```sh
npm install @uppy/core @uppy/dashboard @uppy/xhr-upload
```

一般的作法，就是安裝所需的套件，如果想要使用Dashboard，可以只安裝@uppy/dashboard及@uppy/xhr-upload。

```sh
npm install @uppy/file-input @uppy/progress-bar @uppy/xhr-upload
```

如果只想要使用一般的FileUpload，可以只安裝@uppy/file-input @uppy/progress-bar @uppy/xhr-upload


## 實作

### Angular

```javascript
@Component({
  selector: 'app-uppy',
  templateUrl: './uppy.component.html',
  styleUrls: ['./uppy.component.scss']
})
export class UppyComponent implements AfterViewInit {
  ngAfterViewInit(): void {
      // Create Uppy object
  }
}
```

因為擅長的是Angular，所以這個範例，想將Angular和Uppy整合，所以首先實作AfterViewInit，確認頁面的DOM都戴入完成後，才能建立Uppy的物件。


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

使用use戴入所需的套件，這裡戴入Dashboard及XHRUpload。

```javascript
uppy.use(Dashboard, {
    inline: true,
    target: '.uploadContainer'
});
```

Dashboard的參數可以參考[官方文件](https://uppy.io/docs/dashboard/)。
* inline(true)：直接將Dashoboard顯示在頁面上。
* target('.uploadContainer')：Dashboard顯示在uploadContainer上。

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

XHRUpload的參數可以參考[文件](https://uppy.io/docs/xhr-upload/)，``endpoint``指定Server端的API位置，並且是用監聽事件upload-success來判斷是否上傳成功。如此檔案或是圖片上傳的功能就完成。

<img class="img-responsive" src="/images/11/11-1.png">

Dashboard的畫面如上，因為Uppy是上傳套件，無法戴入圖片，所以這邊有使用另一個套件[ngx-gallery](https://github.com/MurhafSousli/ngx-gallery)。

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

程式碼與Dashboard的很相似，戴入FileInput的套件及設定參數，可以參考[文件](https://uppy.io/docs/file-input/)。
* target('.uploadContainer')：FileInput顯示在uploadContainer上。
* inputName('fileData')：傳送至Server的名稱為fileData。

<img class="img-responsive" src="/images/11/11-2.png">

FileInput的畫面如上。

### Server

```javascript
import * as fileUpload from 'express-fileupload';
app.use(fileUpload());
```

Server端是使用express.js，而處理上傳檔案是用[express-fileupload](https://github.com/richardgirges/express-fileupload)這個套件。

```javascript
async handler(req: express.Request, res: express.Response) {
    const { fileData } = req['files'];
    const service = new FileService();

    const fileRes = await service.upload(fileData);
    return res.json(fileRes);
  }
```

只需用req.files.fileData就可以存取到所上傳的物件，而fileData就是在**XHRUpload**套件上所設定fieldName的值。


## 結綸

Uppy是目前我覺得很方便的上傳套件，簡單幾段程式就可以實作檔案上傳。

