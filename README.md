# bestecanvas.nl Template

This Documentation provides you with an insight into the most important things to develop for the new bestecanvas.nl Template.

## Overview

0. [Setup](#setup)
1. [Gulp as Build Process](#gulp-as-build-process)
  1. [for CSS](#gulp-for-css)
  2. [for JavaScript](#gulp-for-js)
  3. [for SVG](#gulp-for-svg)
  4. [for SVG-fallbacks](#gulp-for-svg-fallbacks)
  5. [for image-sprites](#gulp-for-image-sprites)
  6. [for watching and reloading](#gulp-for-watching-and-reloading)
2. [Directory Structure](#directory-structure)
3. [Insight into JavaScript](#insight-into-javascript)
  1. [Structure](#structure)
  2. [Functions](#functions)
    1. [Modal](#modal)
    2. [Toast](#toast)
    3. [ui-blocker](#ui-blocker)
4. [About Styles](#about-styles)
  1. [Conventions](#conventions)
  2. [Structure](#structure-1)
  3. [Mixins & Variables](#mixins--variables)
  4. [Pitfalls](#pitfalls)
5. [Working on Views and Templates](#working-on-views-and-templates)
  1. [Understanding UA-Sniffing and Fallback](#understanding-ua-sniffing-and-fallback)
  2. [Structure](#structure-2)
  3. [Conventions](#conventions-1)


## Setup

Requirements are:
* Node.js installed (min. v0.12.7)
* newest version of npm (min. 2.11.3)
* PicturatorDeveloper installed (updated Version with external API)
* this templated cloned into PicturatorDeveloper/templates/meinfoto2-de and activated
* a recent dump of the Settings Database
* Symlinks: `./desktop/assets -> ./assets` and `./desktop/static -> ./static`

To install all dependencies, run
`npm run init-dependencies`

This will install the newest version of Gulp and all project dependencies.

## Gulp as Build Process

Gulp has an easy and fast way to set up build processes amd chain them. The Syntax is straight-forward and gives you a good overview for all build steps.

The command `gulp` will clean your project and build all files with the following explained tasks.

### Gulp for CSS

Task: `gulp styles`
Files: `static/sass/*.scss`

Build Steps:

```
*.scss
┣━ gulp-sass: transforms SASS into CSS
┣━ autoprefixer: adds vendor-prefixes to CSS
┃  ┗━ save *.css to static/build/css
┣━ minify: minifies CSS
┣━ change filetype to .min.css
┃  ┣━ save *.min.css to static/build/css
┃  ┗━ reload browser through BrowserSync
┗━ check if file is page-desktop.min.css
   ┣━ split CSS into multiple files, if it's too big (old IE support)
   ┣━ save splitted files to static/build/css/split
   ┗━ reload Browser through BrowserSync
```


This processes sass-files and saves multiple versions for debugging and production use.

**Important:** `gulp sprites` has to be run at least one time before this task can build itself. Otherwise it will throw an error. That's because `gulp sprites` generates a sass-file, which is needed to build the css.

**Note**: Due to our big files and the fact, that each *.sass file has to be processed on change, this can take up to 8-10 seconds. This can be optimized by incrementally build and remember the files while watching in development-mode.

### Gulp for JS

Task: `gulp js`
Files: `static/js/*.js`

Build Steps:

```
*.scss
┣━ include files from comments
┃  ┗━ save *.js to static/build/js
┣━ uglify: minifies JS
┗━ change filetype to .min.js
   ┣━ save *.min.css to static/build/css
   ┗━ reload browser through BrowserSync
```

A important part is the [gulp-include](https://www.npmjs.com/package/gulp-include) plugin. This adds files into files with comments like
`//= include vendor/jquery.matchHeight.js`

**Note**: Due to the vendor-files, this can take up to 10-12 seconds. This can be optimized by incrementally build and remember the files while watching in development-mode. Also it would be possible to add browserify to the stream, which runs nice with watchify.

### Gulp for SVG

Task: `gulp svg`
Files: `*.svg` for each directory in `/assets/svg/`

Build Steps:

```
[directory]/*.svg
┣━ minify svg
┗━ concat svgs into one svg-map
   ┣━ rename to `map-[directory].svg`
   ┗━ save to assets/build/svg
```

The generated file is a svg-map with symbols. A symbol from this file can be included in HTML like this:

```HTML
<svg role="presentation">
  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/svg/map-[directory].svg#[directory]-[filename]"></use>
</svg>
```

The path looks a little bit complicated, but has to be conform with svg-fallbacks we are going to use.

### Gulp for image sprites

Task: `gulp sprites`
Files: `assets/img/sprites/**/.png`

Build Steps:

```
*.png
┣━ build a normal and a retina sprite-map for all sprite source files
┃  ┗━ save sprite.png and sprite-2x.png to assets/build/img
┗━ build a sass file with variables
   ┗━ save to static/build/sass
```

This will build a sprite and the corresponding sass-map in order to use it simple in CSS.

Example:
The image `assets/img/sprites/payment/mastercard.png` can be included with:

```SASS
.mastercard {
  @include sprite($sprite-payment-mastercard);
}
```

It will insert the correct image path and dimensions. Also you can scale the image with the `$scale` parameter, for example to scale it to 50%:

```SASS
.mastercard {
  @include sprite($sprite-payment-mastercard, $scale: 0.5);
}
```


**Important:**
1. Make sure the image size of the retina image is always twice as big and thus be an even number.
2. Avoid collision of names. Don't name them `checkmark.png` and `checkmark-color.png`, as this can (and will) mess up the building process. Instead name them `checkmark-normal.png` and `checkmark-color.png`.

### Gulp for watching and reloading

Task: `gulp watch` / `gulp watch-80`
Files: `**/*.xhtml`

This task will start BrowserSync on localhost:3000. `gulp watch` will proxy port 8080 for UNIX-environments, where Picturator runs on port 8080. `gulp watch-80` will proxy port 80 for Windows-environments, where Picturator can run on port 80.

On changing a \*.scss file, it will automatically run the `style` task and reload your browser, if it's done.
On changing a \*.js file, it will automatically run the `js` task and reload your browser, if it's done.

## Directory Structure

`assets` – Resources like images
`assets/build` — Builded asset resources
`assets/img` — Images
`assets/svg` — SVGs

`static` — Resources for static files like CSS and JS
`static/build` — Builded static resources
`static/js` — JavaScript Files
`static/sass` — Sass Files

`desktop` — Desktop XHTML views
`tablet` — Tablet XHTML views
`phone` — Phone XHTML views

## Insight into JavaScript

### Structure

`static/js` has three subdirectories:

* `includes` for whole scripts to include
* `plugins` for self-written jQuery plugins
* `vendor` for vendor-scripts

These files will be included into the \*.js files in the main-directory.

### Functions

This JavaScript code will be executed when the page has finished loading, so it's optimized for running when the document is ready.

#### Modal

A modal is a HTML-Element controlled by JavaScript.

```HTML
<div class="js-modal" id="myModal">
  <div class="head">My Modal Title</div>
  <div class="body">My Text</div>
  <div class="foot">
    <button type="button" class="button -control -positive">Positive</button>
    <button type="button" class="button -control -neutral">Neutral</button>
    <button type="button" class="button -control -critical">Critical</button>
    <button type="button" class="button -control -nothing" onclick="Modal.close('#myModal')">Ok</button>
  </div>
</div>
```

![Example for a Modal](https://cloud.githubusercontent.com/assets/4227520/9905261/42e53684-5c84-11e5-92ff-72570eb69e86.png)

You can open this Modal by calling `Modal.open('#myModal')` and close it with `Modal.close('#myModal')`.
The class `js-modal` is as important as choosing an unique ID to access the Modal.

Button classes can be:
* `-positive` for a green button
* `-neutral` for a grey button
* `-critical` for a red button
* `-nothing` for a button without any color

#### Toast

A toast is a short Notification popping up on the bottom of the screen.

Show it with:
```JS
showToast('Your text here');
```

And close it with
```JS
hideToast(300);
```

The 300 will wait 300ms before closing it to avoid very short flashes of a Toast.

![Example of a Toast](https://cloud.githubusercontent.com/assets/4227520/9853907/641cb91e-5b06-11e5-9479-624152271cb1.png)

#### ui-blocker

The ui-blocker will overlay a grey blocker over an element to make it look disabled and non-clickable.

Block and unblock an element with:
```JS
block($('.my-button'));
unblock($('.my-button'));
```

### About Styles

Learning to develop, improve and maintain the styles is very important for this project. Stylesheets are always something in a project, which can be improved everytime.

#### Conventions

This adapts the [RSCSS](https://github.com/rstacruz/rscss) Architecture as of v1.1.0. It has no strict rules or confusing naming conventions like BEM or SMACCS and thus is very beginner-friendly. Unfortunately it can be a bit slow to build.

We won't cover the idea behind RCSCC here. Read everything about it [in the RSCSS repo](https://github.com/rstacruz/rscss).

##### Code Style

* Indent using 2 spaces.
* Before `{` is always a space.
* After `{` is always a line break.
* After `property:` is always a space.
* After `;` is always a line break.
* After `,` is always a line break.
* After `}` is always blank line. Big blocks are separated by two or more blank lines.
* URLs are qouted with double qoutes.
* Write `@extend` rules before the CSS properties, except it's necessary.
* Write `@include` rules after the CSS properties.
* If an `@include` statement is longer than a line, insert an empty line before and after the block.
* No units on zero-values (not `0px`).
* Always write leading zeros (`0.5` instead of `.5`).
* Single- and Multi-Line Comments with `//`
* Don't overuse SASS' nesting ability, keep readability in mind.

##### Example

```SASS
.search-form {
  color: rgba($green, 0.75);
  @include clearfix;

  // This could be a breakpoint definition
  // and is in this example to show the
  // multi-line @include statments and comments.
  @include some-mixin() {
    width: 50%;
  }

  &.-small {
    width: 30%;
  }

  > .action {
    @extend .action-button;
    @extend .action-button.-big;
    position: relative;
    background-color: $green;
    color: $white;
  }

  > .action > .inner,
  > .action > .second {
    position: absolute;
  }
}
```

##### Techniques

* Don't use IDs.
* Class-names do not contain visual appearances like colors or numeric values for sizes.
* Nest max. 3 levels deep, if possible.
* Use the nesting rules from RSCSS.
* `px` is our unit of choice. Units like `em` and `%` where it's appropriate.
* If there's a :hover, there has to be a :focus.
* No vendor prefixes.


#### Structure

Each **Component** or standalone **Element** is in its own file, named like the class and starting with an underscore. E.g. `components/_recipe-item.scss` and `layouts/_recipe-list.scss`.

Files and classes containing only style for phone or tablets are prefixed with `__p_/__t_`.
Example: `layouts/__p_recipe-list.scss` and `.p_recipe-list { ... }`.

##### Layouts

**Layouts** can also (besides arrangements of components) be templates for whole pages.

##### Base rules

Base rules like `body`, `p`, `a` or other small and simple one-level classes belong into the `base/` directory.

##### Vendor

Vendor-specific stylesheets (jQuery plugins, Frameworks, …) belong in the `vendor/` directory.

##### Variables

Use variables if there are reasonable; especially for colors, typography and re-occuring measurements. You can find them in `utils/_var-[name].scss`.

##### Shame

Don't hack dirty CSS like `!important`, too deep nesting or other confusing stuff. If it's dirty but you want to do it anyway, make a new file and put it into `shame/`. Keep an eye on this file, your goal is it to delete it asap.

##### Main Files

The Main Files are `page-desktop.scss`, `page-tablet.scss`, `page-phone.scss`.

These files never have real CSS Code in it, they consist only of `@import` statements.

#### Mixins & Variables

Mixins, Variables, Functions and other SASS-related things are located in `utils/`.

* `_functions.scss` for SASS functions
* `_mixins.scss` for SASS mixins
* `_var-colors.scss` for Color Variables
* `_var-dimensions.scss` for Page Dimension Variables
* `_var-typography.scss` for Typography Variables

##### Variables

Use color variables as much as possible. Structure and link them, to have one big file for all color definitions, for example:

```SASS
// _var-colors.scss

$grey: #a7a7a7;
// ...

$box-border: $grey;
// ...

$productbox-border: $box-border;
// ...
```

##### Mixins

Important mixins are:

**clearfix** inserts a clearfix for this element:
`@include clearfix;`

**break** inserts a media-query for a given variable:
```SASS
@include break(phone_portrait) {
  // ...
}
```

The usable breakpoints are in `_var-dimensions.scss`:
```SASS
$breakpoints: (
  phone_portrait: "only screen and (max-width: #{em-calc(450px)})",
  phone_landscape: "only screen and (min-width: #{em-calc(540px)})",
  tablet_portrait_small: "only screen and (max-width: #{em-calc(700px)})",
  tablet_portrait: "only screen and (max-width: #{em-calc(800px)})",
  tablet_landscape: "only screen and (min-width: #{em-calc(801px)})",
  desktop_m: "only screen and (max-width: #{em-calc($grid-width)})",
  desktop_l: "only screen and (min-width: #{em-calc($grid-width)})"
);
```

**z-index** inserts a controlled z-index for a given variable:
`@include z-index(overlay)`

The usable z-indexes are in `_var-dimensions.scss`:
```SASS
$depth: (
  content: 100,
  navigation: 200,
  overlay: 900
);
```

You can add or subtract z-indexed on this values like this:
```SASS
@include z-index(content, 1); // -> z-index: 101
@include z-index(content, -1); // -> z-index: 99
@include z-index(overlay, -5); // -> z-index: 895;
```

Feel free to add variables to this `$depth` definition, if you want to add another depth-layer to the page.


##### Functions

**em-calc** converts `px` to `em`, useful for breakpoint definitions:
`em-calc(800px) -> 50em`


#### Pitfalls

RSCSS has a nice syntax, but since it's based on SASS's `@extend` feature, which is a bit weird, RSCSS has a few flaws.

1. If you have a standalone Element like `.button` and you use it elsewhere with `@extend .button;`, you should never make another unrelated `.button` as child in any selector. E.g. `.my-page .section-top .button` would also be affected by `@extend .button;`. This can cause very, very strange things.

2. If you use `@extend .my-component`, all children of `.my-component` will also be extended to this selector. This can be great, but it also can be bad, if `.my-component` has a lot of modifiers and children you don't even use.


### Working on Views and Templates

The Views and Templates are developed with clearness and consistency in mind, even if it will look confusing at first.

#### Understanding UA-Sniffing and Fallback

The UA-Sniffing module of Picturator *sniffs* the UserAgent of the Browser and serve content depending on the result. It will decide to show views for `desktop`, `tablet` or `phone`.

Also it will search files in the order `phone -> tablet -> desktop`.

**Example A:**
A Desktop Browser wants to access `product.xhtml`. If it can find `desktop/product.xhtml`, it will show it. Otherwise it will throw an 404 (or redirect to index).

**Example B:**
A Phone Browser wants to access `product.xhtml`. If can't find `phone/product.xhtml`, so it will look if it can find `tablet/product.xhtml`. If it can't find the tablet-file, then it will look for `desktop/product.xhtml` and show it. Like in Example A, if it can't even find the desktop-file, it will throw an 404.

This fallback applies to *everything* being served.

#### Structure

There are a few directories to refactor `<ui:include>`'s and partial views:

* `page-blocks` contains page-partials which span 100% of the pages width: header, footer, ...
* `content-blocks` contains page-partials, which are smaller parts of a page. Their filename should start with their page-context, for example `shoppingcart-table.xhtml`, `price-accordion-canvas.xhtml`, `teaser-quotes.xhtml`.
* `helper` are small fragments which usually contain a bit of logic to make flexible partials.
  * Exception: `helper/svg.xhtml` is being used to render a `<svg>`-Element, since JSF seems to mess up the DOM otherwise.
* `coupons` contains the top-banners for activated coupons of coupon-offerings. The template-file will include them based on the currently activated coupon.
* `head` contains `<head>` definitions
* `templates` contains the base-templates.

#### Conventions

##### Comments

There are two conventions for comments:

1. Big comments, which explain the pages logic, are surrounded by `<ui:remove></ui:remove>`
2. Closing-Tag-Comments to make HTML more readable

**Closing-Tag-Comments:**

```HTML
<div class="first-level">
  <div class="second-level">
    ...
  </div><!-- /second-level -->
</div><!-- /first-level -->
