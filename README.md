# BevyUp-Widgets
BevyUp widgets

##Usage

###Basic Usage

Add a `div` tag with class `BevyUp_BoardViewerWidget` on your page where you would like to include the board widget.  Include your board name in a `data-productlist` attribute.

```html
<div class="container">
  <!-- header elements -->
  <div class="BevyUp_BoardViewerWidget" data-productlist="Board"></div>
  <!-- footer elements -->
</div>
```

Include one of the provided stylesheets and the `viewer.js` document on your page.

```html
<head>
  <!-- other header elements -->
  <link href="path/to/styleA.css" rel="stylesheet" type="text/css"/>
  <script src="path/to/viewer.js" type="text/javascript"></script>
  <script src="//b.bevyup.com/gts/your_partnerid/v1" type="text/javasscript" async></script>
</head>
```

###Advanced Usage

Clone this repository.  Modify the templates or functionality in `viewer.js`.  Refer to the [BevyUpApi documentation](https://bevyup.atlassian.net/wiki/display/DOC/Javascript+API)  for additional functionality.  Include the files in the same way as the basic usage.
