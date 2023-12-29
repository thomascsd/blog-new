---
title: 好用套件-  commandline
bgImageUrl: assets/images/29/29-0.jpeg
description: 好用的套件 commandline，解析 CLI 參數，並使用Attribute來設定options
published: true
---

在.NET Framework 的時候，沒有內建的 CLI 指令參數解析，再到.NET Core 時，雖然有個套件[System.CommandLine](https://www.nuget.org/packages/System.CommandLine)，但覺得沒有很好使用，之前有發現一個套件 [commandline](https://github.com/commandlineparser/commandline)，設定及讀取參考很簡單易用，寫篇心得文分享一下。

## 設定

```csharp
public class DefaultOptions
    {

        [Option('n', "name", Required = true, HelpText = "名稱")]
        public string Name { get; set; }

        [Option('r', "retry", HelpText = "是否要重新執行")]
        public bool Retry { get; set; }

        [Option('d', "date", HelpText = "要執行的日期")]
        public string Date { get; set; }
    }

```

首先建立 Options 類別，`Commandline`會透過 `Attribute`將屬性和 CLI 參數對應，可以參考[文件](https://github.com/commandlineparser/commandline/wiki/Option-Attribute)，所以第一個參數設定簡短名稱，第二個參數設定完整名稱，看起來很淺顯易懂。

## 解析參數

```csharp
await Parser.Default.ParseArguments<DefaultOptions>(args).WithParsedAsync(RunJob);

 async Task RunJob(DefaultOptions options)
{
    //do something
    Console.WriteLine($"name:{options.Name}");
}
```

使用`ParseArguments` 及 `WithParsedAsync`來解析參數，並取得 options 物件，也是很淺顯易懂的。

<img class="img-responsive" loading="lazy" src="assets/images/29/29-1.png">

接著就可以使用熟悉的 [unix style](https://github.com/commandlineparser/commandline/wiki/CommandLine-Grammar) 方式設定參數來執行。

## 另一種方式

<img class="img-responsive" loading="lazy" src="assets/images/29/29-2.png">

有時會需要根據不同的參數，取得不同的 Options 物件。看了一下原始檔，發現 `ParseArguments` 還有另一個多戴方法，可傳入 factory 工廠方式，來決定傳出的 Options 物件。

```csharp
public class ActionAOptions: DefaultOptions
 {
        [Option('a', "action")]
        public string Action { get; set; }
  }

await Parser.Default.ParseArguments<DefaultOptions>(SelectOptions(args), args)
.WithParsedAsync(RunJob2);

async Task RunJob2(DefaultOptions options)
{
    var actionOptions = (ActionAOptions)options;

    //do something
    Console.WriteLine($"name:{actionOptions.Name}, action:{actionOptions.Action}");
}

Func<DefaultOptions> SelectOptions(string[] args)
{
    return () =>
    {
        var isAction = args[1]?.IndexOf("action") != -1;
        if (isAction)
        {
            return new ActionAOptions();
        }
        return new DefaultOptions();
    };
}
```

<img class="img-responsive" loading="lazy" src="assets/images/29/29-3.png">

如同上面的程式碼，可以根據不同名稱，取回不同的 options 物件，例如名稱(-n/--name)為 action 時，可以多傳入參數 action。

## 結論
