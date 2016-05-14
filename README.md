# BevyUp-Widgets
BevyUp widgets

##Usage

###Basic Usage

Add a `div` tag with class `BevyUp_BoardViewerWidget` on your page where you would like to include the board widget.  Include your board name in a `data-productlist` attribute.  If the name is not provided, the default name of `Board` will be used.  This `div` can be styled, sized, and positioned as you would like.  The widget will be placed inside this `div`, filling it horizontally and expanding vertically with the content.

```html
<div class="container">
  <!-- header elements -->
  <div class="BevyUp_BoardViewerWidget" data-productlist="Board"></div>
  <!-- footer elements -->
</div>
```

Include one of the provided stylesheets, the `viewer.js` document on your page, and `//cdn.bevyup.com/gts/your_partnerid/v1` with your partner ID.

```html
<head>
  <!-- other header elements -->
  <link href="path/to/styleA.css" rel="stylesheet" type="text/css"/>
  <script src="path/to/viewer.js" type="text/javascript"></script>
  <script src="//cdn.bevyup.com/gts/your_partnerid/v1" type="text/javascript" async></script>
</head>
```

If the `BevyUp_BoardViewerWidget` is not found when the viewer script is loaded, you may call `window.InitializeBoardWidget()` and it will insert the widget.

###Advanced Usage

Clone this repository.  Modify the templates or functionality in `viewer.js`.  Refer to the [BevyUpApi documentation](https://bevyup.atlassian.net/wiki/display/DOC/Javascript+API) for additional functionality.  Include the files in the same way as the basic usage.

####Adding a Save Link

You will need to add an anchor tag to one of the templates with the `bup_save_link` class and send the user to your login page.

```javascript
    base: '<div class="bup_board">' +
            '<div class="bup_board_title">BevyUp Board App</div>' +
            '<div class="bup_board_information">Review your saved and hidden products. <a class="bup_save_link" href="/login.php">Login to Save</a></div>' +
          '</div>',
```

This tag should redirect the user to your login page which redirects the user back to their board as per the [documentation](https://bevyup.atlassian.net/wiki/display/DOC/Linking+Your+Company%27s+Users+with+their+BevyUp+Sessions).
