---
title: 使用Nuxt.js及Nuxtent建立Blog的心得
bgImageUrl: /images/05/05-0.jpg
---

Nuxt.js是內建SSR的vue.js框架，我最感興趣的部份是可輸出靜態的Html，如此就可以輕鬆的將程式部署至GitHub Page上，並且可以使用module來擴充功能。

當我看到了Nuxtent這個module，它是可以取得Markdown內容的module，所以想將Blog用Nuxt.js重新翻寫。

## Nuxtent Template

第一步快速建立的話，可使用[Nuxtent Template](https://github.com/nuxt-community/nuxtent-template)建立一個基本的網站架構，需要事先安裝[vue-cli](https://github.com/vuejs/vue-cli)。

``` 
vue init nuxt-community/nuxtent-template my-site
```
 
## 網站架構

<img class="img-responsive" src="/images/05/05-1.png">

### page

建立網站的路由，例如在目錄中建立about.vue，網址會成為localhost:3000/about。

### static

靜態資源，例如：圖片，路徑會基於根目錄，例如/images/bg.png

### content

Nuxtent module特定的目錄，放置Markdown檔案的地方，也就是放入文章的地方

### layout

預設layout為layout.vue，也可以自定layout，之後使用layout屬性指定自定的layout

```javascript
export default {
  async asyncData ({ app }) {
    return {
      posts: await app.$content('/').getAll(),
      name: 'Thomas Blog'
    }
  },
  layout: 'customLayout'
}
```

## 設定檔
nuxtent.config.js

```javascript
const Prism = require('prismjs')

module.exports = {
  content: {
    permalink: '/:slug',
    page: '/_content',
    generate: [ // for static build
      'get', 'getAll'
    ],
    isPost: true
  },
  api: {
    baseURL: 'http://localhost:3200'
  },
  parsers: {
    md: {
      extend(config) {
        config.highlight = (code, lang) => {
          return `<pre class="language-${lang}"><code class="language-${lang}">${Prism.highlight(code, Prism.languages[lang] || Prism.languages.markup)}</code></pre>`
        }
      }
    }
  }
}
```

### content

* permalink：設定文章路徑的顯示方式。

* page：指定顯示文章內容的檔案名稱，預設為_cotent，即指向_cotent.vue。按照文件可以設定為多個。

* isPost:：查看[官方文件](https://nuxtent.now.sh/guide/writing)的說明不是很了解這個屬性的用法，但當看了[原始碼](https://github.com/nuxt-community/nuxtent-module/blob/9423a753c43bbbe69395b400f90b1291ac935084/lib/content/page.js#L161)後發現

```javascript
    get date() {
      if (isDev || !cached.date) {
        const { filePath, fileName, section } = meta
        if (options.isPost) {
          const fileDate = fileName.match(/!?(\d{4}-\d{2}-\d{2})/) // YYYY-MM-DD
          if (!fileDate) {
            throw Error(`Post in "${section}" does not have a date!`)
          }
          cached.date = fileDate[0]
        } else {
          const stats = statSync(filePath)
          cached.date = dateFns.format(stats.ctime, 'YYYY-MM-DD')
        }
      }
      return cached.date
    }
```

當true時，需要將markdown檔案名稱設成2017-06-20-HelloWorld.md，即會取得檔名上的日期做為文章日期。

當false，會使用檔案修改日期做為文章日期。

### parser

我是參考[官方文件](https://nuxtent.now.sh/guide/configuration)，使用prismjs將Mardown的程式碼加上著色器功能。

## 取得內容

可以參考_content.vue的程式碼，使用**get**取得目前路徑的內容。

```javascript
post: await app.$content('/').get(route.path)
```

如果是要取得所有文章的話，可以使用**getAll**這個方法。

```javascript
posts: await app.$content('/').getAll()
```

## 評論功能

想使用基於GitHub issues的評論功能，有發現[gitment](https://github.com/imsun/gitment)這個套件剛好符合我的需要，安裝及設定都很簡單。

```html
<div class="row">
<div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
<div id="comments"></div>
</div>
</div>
```

```javascript
import PostHeader from '../components/PostHeader'
import Gitment from 'gitment'

export default {
  async asyncData ({ app, route, payload }) {
    return {
      post: await app.$content('/').get(route.path)
    }
  },
  mounted () {
    const gitment = new Gitment({
      id: this.post.title, // optional
      owner: 'thomascsd',
      repo: 'thomascsd.github.io',
      oauth: {
        client_id: 'client_id',
        client_secret: 'client_secret'
      }
    })

    gitment.render(document.getElementById('comments'))
  },
  components: {
    PostHeader
  }
}
```

我是參考這篇[文章](https://ihtcboy.com/2018/02/25/2018-02-25_Gitment%E8%AF%84%E8%AE%BA%E5%8A%9F%E8%83%BD%E6%8E%A5%E5%85%A5%E8%B8%A9%E5%9D%91%E6%95%99%E7%A8%8B/)。

要注意的點是，第一次會顯示**Error:Comments Not Initialized**。

<img class="img-responsive" src="/images/05/05-5.png">

需要登入自己的Github帳號後，啟動應用程式。

<img class="img-responsive" src="/images/05/05-6.png">

成功之後，就會變成下圖

<img class="img-responsive" src="/images/05/05-7.png">

## 部署

將靜態檔案部署至Github pages，我遇到了一些問題，按照範例設定會將NODE_ENV='production'及baseUrl會成為正式部署的路徑，例如我的Blog網址thomascsd.github.io。

當使用npm generate時，卻會出現下列錯誤

<img class="img-responsive" src="/images/05/05-2.png">

最後發現，使用下列步驟就OK了

* 不需要加上NODE_ENV
* baseUrl設定成預設的localhost:3200，並執行npm generate
* 再使用VSCode搜索localhost:3200，即會發現dist/api.js 內容有baseURL:localhost:3200，然後將網址替換成正式環境，如我的Blog網址thomascsd.github.io

<img class="img-responsive" src="/images/05/05-3.png">

* 最後就可以部署至GitHub page

<img class="img-responsive" src="/images/05/05-4.png">

## 結論

很方便將一個Blog建立起來，但是缺乏一些功能，例如標籤、Archive功能，這些都要自己實作出來。原始碼可以參考[這裡](https://github.com/thomascsd/thomascsd-blog)。









