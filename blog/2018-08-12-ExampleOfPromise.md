---
title: 從範例講解Promise概念
bgImageUrl: /images/06/06-0.jpg
---

一般而言，呼叫多個ajax，最簡單的方式是用callback函式，如以下的範例
執行完1個ajax之後，再執行另一個ajax。
<iframe width="100%" height="300" src="//jsfiddle.net/thomascsd/ut3cv27k/embedded/js,html,result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 
但是這樣會造成維護及讀code都不易，容易產生俗稱callback hell的問題，每次都想到下面這張圖。

<img class="img-responsive" src="/images/06/06-1.png">

所以有人想到Promise的解決方式
 
例如下面的範例，getData1函式是直接回傳Promise這個物件，而不是直接回傳結果值，就好像是起了緩衝的作用，等到server將結果值回傳，最後再使用resolve將結果值回傳出去，並且可以使用then串連在一起，可讀性及維護性變高了。 
 
ES2015的Promise物件的範列

<iframe width="100%" height="300" src="//jsfiddle.net/thomascsd/hu98b63j/4/embedded/js,html,result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

jQuery Deferred的物件的範例

<iframe width="100%" height="300" src="//jsfiddle.net/thomascsd/e2gp57h6/6/embedded/js,html,result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

我最喜歡的用法，是使用async/ await，因為async/await是基於Promise，所以用像是同步的程式寫法來執行非同步的作業
<iframe width="100%" height="300" src="//jsfiddle.net/thomascsd/xftmdsb9/3/embedded/js,html,result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

# 結論

寫前端的程式，或多或少都會遇到同時發出多個Ajax的情況，這時Promise的概念就很重要