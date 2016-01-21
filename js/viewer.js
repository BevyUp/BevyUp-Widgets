;(function () {
  var BoardViewerWidget

  var template = {
    base: '<div class="bup_board">' +
            '<div class="bup_board_title">BevyUp Board App</div>' +
            '<div class="bup_board_information">Review your saved and hidden products.</div>' +
          '</div>',

    productList: '<div class="bup_list">' +
                   '<div class="bup_board_list_title"></div>' +
                   '<ul class="bup_board_items">' +
                   '</ul>' +
                 '</div>',

    product: '<li>' +
               '<img src=""/>' +
               '<a class="bup_product_remove_link" href="#"><div class="bup_product_remove"></div></a>' +
               '<div class="bup_product_price"></div>' +
               '<div class="bup_product_title"></div>' +
               '<div class="bup_comments"></div>' +
             '</li>',

    comment: '<div class="bup_comment">' +
               '<div class="bup_timestamp"></div>' +
               '<div class="bup_name"></div>' +
               '<div class="bup_message"></div>' +
             '</div>'
  }

  var ListManager = (function () {
    var saved = { list: null, container: null }
    var hidden = { list: null, container: null }

    return {
      init: function (container, savedListPromise, hiddenListPromise) {
        function checkDone () {
          if (saved.list && hidden.list) {
            saved.container = insertProductList(container, 'Saved Items', saved.list)
            hidden.container = insertProductList(container, 'Hidden Items', hidden.list)
          }
        }

        savedListPromise.then(function (sl) {
          saved.list = sl
          checkDone()
        })

        hiddenListPromise.then(function (hl) {
          hidden.list = hl
          checkDone()
        })
      },

      getOther: function (list) {
        if (list === saved.list) {
          return hidden
        } else if (list === hidden.list) {
          return saved
        } else {
          return null
        }
      }
    }
  })()

  window.bevyUpPartnerAsyncInitArray = (window.bevyUpPartnerAsyncInitArray || []).concat(function () {
    var inviteId = ''
    var overrideInviteIdResult = window.location.search.match(new RegExp('overrideInviteId=([^&#]+)'))
    if (overrideInviteIdResult) {
      inviteId = overrideInviteIdResult[1]
    }
    window.BevyUpApi
      .init(inviteId)
      .then(function (isInSession) {
        window.InitializeBoardWidget()
      })
  })

  window.InitializeBoardWidget = function () {
    if (!BoardViewerWidget) {
      BoardViewerWidget = insertBoardWidget()
      if (BoardViewerWidget) {
        var boardName = BoardViewerWidget.dataset.productlist || 'Board'
        var container = BoardViewerWidget.querySelector('.bup_board')

        window.BevyUpApi
          .getProductListsModel()
          .then(function (productListsModel) {
            var savedListPromise = productListsModel.getOrCreateProductList(boardName)
            var hiddenListPromise = productListsModel.getOrCreateProductList(boardName + '_hidden')
            ListManager.init(container, savedListPromise, hiddenListPromise)
          })
      }
    }
  }

  function formatTimestamp (timestamp) {
    var months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
      'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
    ]
    return months[timestamp.getMonth()] + ' ' + timestamp.getDate()
  }

  function insertComment (product, comment) {
    var container = product.querySelector('.bup_comments')

    var temp = document.createElement('div')
    temp.innerHTML = template.comment

    var timestamp = document.createTextNode(formatTimestamp(comment.getCreateTime()))
    temp.querySelector('.bup_timestamp').appendChild(timestamp)

    var name = document.createTextNode(comment.getOwner().getName())
    temp.querySelector('.bup_name').appendChild(name)

    var message = document.createTextNode(comment.getText())
    temp.querySelector('.bup_message').appendChild(message)

    var e = temp.firstChild
    container.appendChild(e)
    return e
  }

  function insertProduct (list, productList, productListNode) {
    var data = productListNode.getProduct().getData()

    var container = list.querySelector('.bup_board_items')

    var temp = document.createElement('div')
    temp.innerHTML = template.product
    temp.firstChild.dataset.productid = data.bup_id
    temp.querySelector('img').src = data.bup_imageUrl

    var price = document.createTextNode(data.bup_price)
    temp.querySelector('.bup_product_price').appendChild(price)

    var title = document.createTextNode(data.bup_name)
    temp.querySelector('.bup_product_title').appendChild(title)

    var element = temp.firstChild
    container.appendChild(element)

    element.querySelector('a.bup_product_remove_link').onclick = function () {
      var other = ListManager.getOther(productList)

      productList.removeProduct(productListNode)
        .then(function () {
          other.list.addProduct(productListNode)
        })
    }

    var renderComments = function () {
      var commentContainer = element.querySelector('.bup_comments')
      while (commentContainer.firstChild) {
        commentContainer.removeChild(commentContainer.firstChild)
      }

      var comments = productListNode.getComments()
      if (comments) {
        comments.forEach(function (comment) {
          insertComment(element, comment)
        })
      }
    }

    productListNode.onCommentAdded(function () {
      renderComments()
    })

    productListNode.onCommentRemoved(function () {
      renderComments()
    })

    return element
  }

  function insertProductList (container, title, productList) {
    var temp = document.createElement('div')
    temp.innerHTML = template.productList
    temp.querySelector('.bup_list').dataset.productlistname = productList.getName()
    var titleNode = document.createTextNode(title)
    temp.querySelector('.bup_board_list_title').appendChild(titleNode)

    var element = temp.firstChild
    container.appendChild(element)

    var productListNodes = productList.getProducts()
    if (productListNodes) {
      productListNodes.forEach(function (pln) {
        insertProduct(element, productList, pln)
      })
    }

    productList.onProductAdded(function (pln) {
      insertProduct(element, productList, pln)
    })

    productList.onProductRemoved(function (pln) {
      var e = element.querySelector('[data-productid="' + pln.getProduct().getData().bup_id + '"]')
      e.remove()
    })

    return element
  }

  function insertBoardWidget () {
    var boardContainer = document.querySelector('div.BevyUp_BoardViewerWidget')
    if (boardContainer) {
      boardContainer.innerHTML = template.base
    }

    return boardContainer
  }
})()
