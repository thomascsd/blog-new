---
title: 我的Terminal 設定方式 - Windows Terminal & ohmyposh
bgImageUrl: assets/images/24/24-0.jpg
description: Windows Terminal 整合 cmd、PowerShell，並可 以自定樣式，但是還是希望和 oh my zsh一樣，可以顯示更多資訊，直到最近發現 ohmyposh可以讓 PowerShell 更好用
published: true
---

一直以來都是使用 IDE 來開發程式，自從進入前端世界後，開始很常使用 CLI ，而 Windows 的 terminal 一直不是很好使用，直到 Windows Terminal 的出現。
Windows Terminal 整合 cmd、PowerShell，並可 以自定樣式，但是還是希望和 [oh my zsh](https://ohmyz.sh/)一樣，可以顯示更多資訊，直到最近發現 [ohmyposh](https://github.com/jandedobbeleer/oh-my-posh)可以讓 PowerShell 更好用。

## Windows terminal 設定

```
{
    "background": "#336699",
    "backgroundImage": "d:\\Path.png",
    "commandline": "%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
    "guid": "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}",
    "name": "Windows PowerShell",
    "opacity": 80,
    "startingDirectory": "d:\\projects",
    "useAcrylic": true
}
```

我習慣的設定如上，主要是設定啟起目錄，以及設定背景色和圖片。

## ohmyposh 安裝

ohmyposh 是跨平台的套件，而我是使用 Windows ，所以是選擇 scoop 來進行安裝，可以參考官方的[文件](https://ohmyposh.dev/docs/installation/windows)來進行。

在 PowerShell 輸入下列指令，即可安裝完成。

```
scoop install https://github.com/JanDeDobbeleer/oh-my-posh/releases/latest/download/oh-my-posh.json
```

<img class="img-responsive" loading="lazy" src="assets/images/24/24-01.png">

接下來需要進行[設定](https://ohmyposh.dev/docs/installation/prompt)，當啟動 Windows Terminal 時，自動戴入 ohmyposh。

首先在 Documents 建立目錄，命名為 WindowsPowerShell。

> C:\Users\{user name}\Documents\WindowsPowerShell

接下來輸入指令`note $PROFILE`，如下圖，在 Microsoft.PowerShell_profile.ps1 裡 加上指令 oh-my-posh init pwsh | Invoke-Expression。

<img class="img-responsive" loading="lazy" src="assets/images/24/24-02.png">

存檔後重啟即可。

## 字型

因為預設的字型是 Nerd Fonts，所以會發現一些圖示沒有顯示正常，需下戴[字型](https://ohmyposh.dev/docs/configuration/fonts)來安裝 。

<img class="img-responsive" loading="lazy" src="assets/images/24/24-03.png">

Windows terminal 還需將字型設為 MesloLGM NF。

```
{
    "profiles":
    {
        "defaults":
        {
            "font":
            {
                "face": "MesloLGM NF"
            }
        }
    }
}

```

可以顯示正確的字型。

<img class="img-responsive" loading="lazy" src="assets/images/24/24-04.png">

## 主題

預設的主題比較單調，可以自定樣式或是戴入其他人建立好的[主題](https://ohmyposh.dev/docs/themes)，第一步輸入`Get-PoshThemes` 如果初次使用沒有指定目錄的話，會決定主題要存放的位置，不然會顯示目前已下戴的主題。

<img class="img-responsive" loading="lazy" src="assets/images/24/24-05.png">

目前選擇的主題是[slim](https://ohmyposh.dev/docs/themes#slim)，這個主題有包含 Node.js 的版本，和顯示 GIT 的狀態，都是開發上所必要的資訊。之此之外，調整 Profile，加上`--config`參數指定主題，之後重新戴入即可。

```
oh-my-posh init pwsh --config D:\themes\slim.omp.json | Invoke-Expression
```

<img class="img-responsive" loading="lazy" src="assets/images/24/24-06.png">

## 結論

使用過的 terminal 從最早的 cmd ，再到 cmder，再到最近的 Windows Terminal，再搭配 ohmyposh，這是目前我覺得很搭配的組合。
