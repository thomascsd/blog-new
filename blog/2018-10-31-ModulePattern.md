---
title: 談談JavaScript Module part1
bgImageUrl: /images/08/08-0.jpg
---

這次想談談模組(Module)，是JavaScript的設計模式的其中的一個，一般而言，我們都會希望程式有架構，被重覆使用，這時可以將程式分成一個個的模組，會用兩篇文章討論這個主題，這一篇是講述Module pattern，下一篇會講述ES2015 module。

## Module pattern

```javascript
var user = (function(){
  // private function
  function add(){
     const count = $('li').length;
     $('#list').append(`<li>Thomas${count}</li>`);
  }
  function remove(){
    const count = $('li').length;
    const $li = $('#list').find('li:last');
    $li.remove();
  }
  return    {
    //public function
    addUser(){
      add();
    },
    removeUser(){
      remove();
    }
  };
})();
```

Module pattern的寫法就像上面這樣，使用IIFE（ Immediately Invoked Function Expression）將程式邏輯封裝，在IIFE中定義私有數數或是方法，只有要公開的方法才會傳出，這樣就很像OOP中的封裝概念，模擬私有變數及公有變數，範例程式碼在[這邊](https://jsfiddle.net/thomascsd/b354wuoz/35/)可以看到。

## Revealing Module Pattern

```javascript
var user = (function(){
  function addUser(){
     const count = $('li').length;
     $('#list').append(`<li>Thomas${count}</li>`);
  }
  function removeUser(){
    const count = $('li').length;
    const $li = $('#list').find('li:last');
    $li.remove();
  }
  return    {
    addUser: addUser,
    removeUser: removeUser
  };
})();
```

另外一種Module pattern的寫法，我們都是用這種寫法，程式碼的架構變得更清楚，範例程式碼在[這邊](https://jsfiddle.net/thomascsd/r2pm4cj1/)可以看到。

每個模組都是全域變數，又覺得有點鬆散及零亂，所以需要另一種型式來組合，這時需要命名空間的協助。

## JavaScript模擬命名空間

JavaScript是沒有命名空間的，但可以使用物件來模擬。

```javascript
const window.NS = window.NS || {};
```

在window下建立屬性，當有NS這個屬性時，就使用原本的NS屬性，不然初始化一個空物件，我們習慣一個模組一個檔案，所以有多個模組時，每個模組會存取到同一個命名空間。這邊是以NS為例子，可以是任何的名稱，我們習慣是以目前的專案名稱的大寫英文來命名。

## Module pattern + namespace

```javascript
(function(){
  function addUser(){
     const count = $('li').length;
     $('#list').append(`<li>Thomas${count}</li>`);
  }
  function removeUser(){
    const count = $('li').length;
    const $li = $('#list').find('li:last');
    $li.remove();
  }
  
  window.NS = window.NS || {};
  window.NS.user = {
    addUser: addUser,
    removeUser: removeUser
  };
})();
```

這樣的寫法我覺得是module pattern的變形，window下只有一個定義的屬性，也就是我所定義的命名空間物件，之後將所有模組都設為這命名空間的屬性。範例程式在[這裡](https://jsfiddle.net/thomascsd/g6h8wza1/6/)

## TypeScript

```'typescript
namespace NS {
  function addUser(){
     const count = $('li').length;
     $('#list').append(`<li>Thomas${count}</li>`);
  }
  function removeUser(){
    const count = $('li').length;
    const $li = $('#list').find('li:last');
    $li.remove();
  }
  export const user = {
    addUser: addUser,
    removeUser: removeUser  
  }
}

```

TypeScript本身就有命名空間的關鍵字，與Module pattern的寫法很相似，差別在於最後是用export的方式，傳出所要公開的function。

<img class="img-responsive" src="/images/08/08-1.png">

並且我們發現，上面這段TypeScript轉成的JavaScript（如上圖所示），與上節的Module + Namespace的程式碼很相似，也是先宣告全堿變數NS，接著判斷NS是否已存在，之後將定義的模組設為NS的屬性。

## 結論

Module pattern我個人覺得是很方便的模式，可以將煩雜的程式碼切割成一塊塊的模組，讓它們彼此之間合作。


