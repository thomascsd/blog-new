---
title: 使用Jekyll建立Blog -1
published: true
---

建立 Blog 的工具有很多，但是可以一鍵馬上完成架站及能夠完全客制化的工具就不多了，其中一個就是[Jekyll](https://jekyllrb.com)。

但是 Jekyll 需要在本機安裝 Ruby 環境，這樣還是有點麻煩，還要先設定環境，之後我找到一個很方便的工具[Jekyll-now](https://github.com/barryclark/jekyll-now)，只要 Fork 就可以建立一個網站。

- 1.到[Jekyll-now](https://github.com/barryclark/jekyll-now)，按下 Fork。
  <img class="img-responsive" src="assets/images/01/jekyll-now1.png" loading="lazy" alt="jekyll-now1">

- 2.設定 Respository 的名稱，需要設定成自已的使用者名稱。
  <img class="img-responsive" src="assets/images/01/jekyll-now2.png" loading="lazy" alt="jekyll-now1">

- 3.設定\_config.yml 後就可以完成一個基本的 Blog 了。
  <img class="img-responsive" src="assets/images/01/jekyll-now3.png" loading="lazy" alt="jekyll-now3">

## 為自已的 Blog 自定樣式

因為預設的樣式一般來說很單，所以我找到另一個樣式，叫做[Clean Blog](https://github.com/BlackrockDigital/startbootstrap-clean-blog)。只需加工一下就能變成蠻有質感的網站。

也是幾個步驟就可以完成

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>
      {% if page.title %}{{ page.title }} – {% endif %}{{ site.name }} – {{ site.description }}
    </title>
    {% include meta.html %}

    <!-- Bootstrap Core CSS -->
    <link
      href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
      rel="stylesheet"
    />

    <!-- Custom Fonts -->
    <link
      href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800"
      rel="stylesheet"
      type="text/css"
    />

    <!-- Theme CSS -->
    <link rel="stylesheet" type="text/css" href="{{ site.baseurl }}/style.css" />
    <link
      rel="alternate"
      type="application/rss+xml"
      title="{{ site.name }} - {{ site.description }}"
      href="{{ site.baseurl }}/feed.xml"
    />

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
      <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
  </head>

  <body>
    <!-- Navigation -->
    <nav class="navbar navbar-default navbar-custom navbar-fixed-top">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header page-scroll">
          <button
            type="button"
            class="navbar-toggle"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            <span class="sr-only">Toggle navigation</span>
            Menu <i class="fa fa-bars"></i>
          </button>
          <a class="navbar-brand" href="{{ site.baseurl }}/">{{ site.name }}</a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav navbar-right">
            <li>
              <a href="{{ site.baseurl }}/">Blog</a>
            </li>
            <li>
              <a href="{{ site.baseurl }}/about">About</a>
            </li>
          </ul>
        </div>
        <!-- /.navbar-collapse -->
      </div>
      <!-- /.container -->
    </nav>

    {{ content }}

    <hr />

    <!-- Footer -->
    <footer>
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
            <ul class="list-inline text-center">
              <li>
                <a href="https://www.twitter.com/{{ site.footer-links.twitter }}">
                  <span class="fa-stack fa-lg">
                    <i class="fa fa-circle fa-stack-2x"></i>
                    <i class="fa fa-twitter fa-stack-1x fa-inverse"></i>
                  </span>
                </a>
              </li>
              <li>
                <a href="https://github.com/{{ site.footer-links.github }}">
                  <span class="fa-stack fa-lg">
                    <i class="fa fa-circle fa-stack-2x"></i>
                    <i class="fa fa-github fa-stack-1x fa-inverse"></i>
                  </span>
                </a>
              </li>
            </ul>
            <p class="copyright text-muted"></p>
          </div>
        </div>
      </div>
    </footer>

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

    <!-- Theme JavaScript -->
    <script src="{{ site.baseurl }}/scripts/clean-blog.min.js"></script>
    {% include analytics.html %}
  </body>
</html>
```

- 1.將 Clean Blog 中的 Index.html 複製至\_default.html，但是保留原本的 temolate 的語法。

- 2 將 jQuery 及 Bootstrap 之類的 JavaScript 連結換成 cdn 外部的連結。

- 3.因為每篇文章都可更換 header 的圖片，所以 header 也包含在{% raw %}{{content}}{% endraw %}裡，而不是固定在 layout 中。

- 4.新增 scripts 的資料夾，將 clean-blog.min.js 新增至資料夾中，最後放\_default.html 即可。

  ```css
  ---
  ---

  //
  // IMPORTS
  //
  @import 'reset';
  @import 'variables';
  // Syntax highlighting @import is at the bottom of this file

  /**************/
  /* BASE RULES */
  /**************/

  body {
    font-family: 'Lora', 'Times New Roman', serif;
    font-size: 20px;
    color: #333333;
  }

  ... .read-more {
    text-transform: uppercase;
    font-size: 15px;
  }

  // Settled on moving the import of syntax highlighting to the bottom of the CSS
  // ... Otherwise it really bloats up the top of the CSS file and makes it difficult to find the start
  @import 'highlights';
  @import 'svg-icons';
  ```

- 5.將 clean-blog.css 的內容放入 style.scss，但是原本的@import 需保留，並且 clean-blog.css 沒有.read-more 的樣式，所以這個也需要保留。
