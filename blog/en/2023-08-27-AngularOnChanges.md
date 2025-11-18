---
title: Angular Detects if DOM Render is Complete
bgImageUrl: assets/images/28/28-0.jpg
description: Use the two lifecycles of `ngOnChanges` and `ngAfterViewChecked` to determine whether the DOM Render is complete
published: true
tags: [angular, lifecycle]
---

Recently, I encountered a requirement to determine whether the scroll bar of the page has reached the bottom, but a different point is that the content will be dynamically loaded after the Dialog is opened, and then it will be judged whether the scroll bar has reached the bottom, that is, it is necessary to determine whether the DOM has been loaded. But I encountered a difficult problem. Angular does not have a `$trick` method like Vue.js, which can know that the Dom render has been completed. When I checked StackOverFlow, it was recommended to use `ngAfterViewChecked`, but after testing, I feel that it is better to use `ngOnChanges` and `ngAfterViewChecked` at the same time. Let me share my approach.

<iframe width="100%" height="450" frameborder="0" src="https://stackblitz.com/edit/stackblitz-starters-l96j3d?embed=1&file=src%2Fchildren%2Fchildren.component.ts" ></iframe>

As in the code example, the `content` attribute of the Component (app-childred) will get the content to be displayed only when the button is clicked in `main.ts`. At this time, `ngAfterViewInit` has been executed, and the content of the div has not yet been intercepted, so the height of the div is zero, that is, `scrollHeightInit` is zero.

The code is written as follows:

- In `ngOnChanges`, determine whether the value of the attribute `content` has changed. If it has changed, set `Flag` to `true`.

- Because `ngAfterViewChecked` is executed every time Change Detection is performed, at this life cycle, it means that the Dom render has been completed, that is, the content of the div has been loaded, and thus the height of the div can be obtained.

- After obtaining the height of the div, perform subsequent processing to obtain the height of the scroll bar to determine whether the scroll bar is at the bottom.

## Conclusion

Using the two lifecycles of `ngOnChanges` and `ngAfterViewChecked` to judge, I feel very good after testing, which meets the current needs. If you think there is room for adjustment, you can raise it.
