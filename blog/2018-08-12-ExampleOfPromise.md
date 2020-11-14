---
title: 從範例講解Promise概念
bgImageUrl: assets/images/06/06-0.jpg
published: true
---

一般而言，呼叫多個 ajax，最簡單的方式是用 callback 函式，如以下的範例
執行完 1 個 ajax 之後，再執行另一個 ajax。

<iframe width="100%" height="300" src="//jsfiddle.net/thomascsd/ut3cv27k/embedded/js,html,result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 
但是這樣會造成維護及讀code都不易，容易產生俗稱callback hell的問題，每次都想到下面這張圖。

<img class="img-responsive" loading="lazy" src="assets/images/06/06-1.png">

所以有人想到 Promise 的解決方式

例如下面的範例，getData1 函式是直接回傳 Promise 這個物件，而不是直接回傳結果值，就好像是起了緩衝的作用，等到 server 將結果值回傳，最後再使用 resolve 將結果值回傳出去，並且可以使用 then 串連在一起，可讀性及維護性變高了。

ES2015 的 Promise 物件的範列

<iframe width="100%" height="300" src="//jsfiddle.net/thomascsd/hu98b63j/4/embedded/js,html,result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

jQuery Deferred 的物件的範例

<iframe width="100%" height="300" src="//jsfiddle.net/thomascsd/e2gp57h6/6/embedded/js,html,result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

我最喜歡的用法，是使用 async/ await，因為 async/await 是基於 Promise，所以用像是同步的程式寫法來執行非同步的作業

<iframe width="100%" height="300" src="//jsfiddle.net/thomascsd/xftmdsb9/3/embedded/js,html,result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

# 結論

寫前端的程式，或多或少都會遇到同時發出多個 Ajax 的情況，這時 Promise 的概念就很重要
