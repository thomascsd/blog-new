---
title: First experience with Bulma
bgImageUrl: assets/images/30/30-0.jpg
description: Bulma is indeed a very intuitive and easy-to-use CSS framework. Its developer experience (DX) is excellent, and it has a more concise syntax and design than Bootstrap. Especially in terms of layout and component settings, Bulma is worth a try.
published: true
---

Recently, I became interested in a CSS framework - [Bulma](https://bulma.io/), and found that its developer experience (DX) is excellent and more intuitive to use than Bootstrap. Not long ago, it launched version 1.0, so I would like to write a review to introduce it briefly.

## Usage

To reference `Bulma`, the easiest way is to use the CDN link on the page.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.0/css/bulma.min.css" />
```

## Features

Here are a few features that I find very convenient to use compared to Bootstrap.

- Column Layout

Using Column for layout, you will be impressed by the syntax. You only need to use `columns` and `columns` to automatically layout.

```html
<div class="columns">
  <div class="column"></div>
  <div class="column">
    <strong>Bulma - Blog theme</strong> by <a href="https://gonzalojs.com">Gonzalo Gutierrez</a>.
    Based on the <a href="http://jigsaw-blog-staging.tighten.co/">jigsaw-blog</a>.
  </div>
  <div class="column"></div>
</div>
```

<img class="img-responsive" loading="lazy" src="assets/images/30/30-1.png">

As shown in the figure above, the default is to divide the left and right equally, which will look a bit out of alignment.

```html
<div class="columns">
  <div class="column is-2"></div>
  <div class="column is-8">
    <strong>Bulma - Blog theme</strong> by <a href="https://gonzalojs.com">Gonzalo Gutierrez</a>.
    Based on the <a href="http://jigsaw-blog-staging.tighten.co/">jigsaw-blog</a>.
  </div>
  <div class="column is-2"></div>
</div>
```

<img class="img-responsive" loading="lazy" src="assets/images/30/30-2.png">

There is also a [12 columns system](https://bulma.io/documentation/columns/sizes/#12-columns-system). Here I set `is-8` to make the width wider.

- Component settings

For example, the setting of [Navbar](https://bulma.io/documentation/components/navbar/) uses fewer levels.

```html
<!--Bootstrap-->
<div class="collapse navbar-collapse" id="navbarSupportedContent">
  <ul class="navbar-nav mr-auto">
    <li class="nav-item" routerLinkActive="active">
      <a class="nav-link">Member</a>
    </li>
    <li class="nav-item" routerLinkActive="active">
      <a class="nav-link">List</a>
    </li>
    <li class="nav-item" routerLinkActive="active">
      <a class="nav-link">Order</a>
    </li>
  </ul>
</div>
```

```html
<!--Bluma-->
<div id="navbarBasic" class="navbar-menu">
  <div class="navbar-start">
    <a class="navbar-item" [routerLink]="['/member']">Member</a>
    <a class="navbar-item" [routerLink]="['/list']">List</a>
    <a class="navbar-item" [routerLink]="['/order']">Order</a>
  </div>
</div>
```

- is-* syntax

This is also where I think the developer experience is very good. Like the `Column Layout` above, `is-8` and `is-2` are used to set the width.

```html
<input class="input is-link" type="text" placeholder="Link input" />
<input class="input is-small" type="text" placeholder="Small input" />
<div class="control">
  <input class="input is-focused" type="text" placeholder="Focused input" />
</div>
```

In addition, there are many such settings in `input`, such as `is-link`, `is-small`, and `is-focused` above. You can refer to the [input chapter](https://bulma.io/documentation/form/input/).

## References

Bulma has a lot of resources to refer to. Although it is not as large as Bootstrap, I think there are still a lot of resources.

<img class="img-responsive" loading="lazy" src="assets/images/30/30-3.png">

- [Free Bulma Templates](https://bulmatemplates.github.io/bulma-templates/): There are many free templates to use, and [Blog 2 - Tailsaw](https://bulmatemplates.github.io/bulma-templates/templates/blog-tailsaw.html) is the template I use.

<img class="img-responsive" loading="lazy" src="assets/images/30/30-4.png">

- [Awesome Bulma](https://github.com/aldi/awesome-bulma): Everyone is familiar with the Awesome series, a collection of various resources.

## Conclusion

In conclusion, Bulma is indeed a very intuitive and easy-to-use CSS framework. Its developer experience (DX) is excellent, and it has a more concise syntax and design than Bootstrap. Especially in terms of layout and component settings, Bulma is worth a try, and the blog will also be updated with Bulma.
