/**
 * cool-bootstrap-affix
 */
'use strict';
angular.module('cool.bootstrap.affix', ['cool.dimensions']).directive('coolAffix', [
  '$window',
  'dimensions',
  function ($window, dimensions) {
    var checkPosition = function (instance, el, options) {
      var scrollTop = window.pageYOffset;
      var scrollHeight = document.body.scrollHeight;
      var position = dimensions.offset.call(el[0]);
      var height = dimensions.height.call(el[0]);
      var offsetTop = options.offsetTop * 1;
      var offsetBottom = options.offsetBottom * 1;
      var reset = 'affix affix-top affix-bottom';
      var affix;
      if (instance.unpin !== null && scrollTop + instance.unpin <= position.top) {
        affix = false;
      } else if (offsetBottom && position.top + height >= scrollHeight - offsetBottom) {
        affix = 'bottom';
      } else if (offsetTop && scrollTop <= offsetTop) {
        affix = 'top';
      } else {
        affix = false;
      }
      if (instance.affixed === affix)
        return;
      instance.affixed = affix;
      instance.unpin = affix === 'bottom' ? position.top - scrollTop : null;
      el.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''));
    };
    var checkCallbacks = function (scope, instance, iElement, iAttrs) {
      if (instance.affixed) {
        if (iAttrs.onUnaffix)
          eval('scope.' + iAttrs.onUnaffix);
      } else {
        if (iAttrs.onAffix)
          eval('scope.' + iAttrs.onAffix);
      }
    };
    return {
      restrict: 'EAC',
      link: function postLink(scope, iElement, iAttrs) {
        var instance = { unpin: null };
        angular.element($window).bind('scroll', function () {
          checkPosition(instance, iElement, iAttrs);
          checkCallbacks(scope, instance, iElement, iAttrs);
        });
        angular.element($window).bind('click', function () {
          setTimeout(function () {
            checkPosition(instance, iElement, iAttrs);
            checkCallbacks(scope, instance, iElement, iAttrs);
          }, 1);
        });
      }
    };
  }
]);
/**
 * cool-dimensions
 */
'use strict';
angular.module('cool.dimensions', []).provider('dimensions', function () {
  this.$get = function () {
    return this;
  };
  this.offset = function () {
    if (!this)
      return;
    var box = this.getBoundingClientRect();
    var docElem = this.ownerDocument.documentElement;
    return {
      top: box.top + window.pageYOffset - docElem.clientTop,
      left: box.left + window.pageXOffset - docElem.clientLeft
    };
  };
  this.height = function (outer) {
    var computedStyle = window.getComputedStyle(this);
    var value = this.offsetHeight;
    if (outer) {
      value += parseFloat(computedStyle.marginTop) + parseFloat(computedStyle.marginBottom);
    } else {
      value -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom) + parseFloat(computedStyle.borderTopWidth) + parseFloat(computedStyle.borderBottomWidth);
    }
    return value;
  };
  this.width = function (outer) {
    var computedStyle = window.getComputedStyle(this);
    var value = this.offsetWidth;
    if (outer) {
      value += parseFloat(computedStyle.marginLeft) + parseFloat(computedStyle.marginRight);
    } else {
      value -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight) + parseFloat(computedStyle.borderLeftWidth) + parseFloat(computedStyle.borderRightWidth);
    }
    return value;
  };
}).constant('debounce', function (fn, wait) {
  var timeout, result;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      result = fn.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    return result;
  };
}).provider('jQuery', [
  'dimensionsProvider',
  function (dimensionsProvider) {
    var self = this;
    var jQLite = angular.element;
    this.fn = angular.extend({}, dimensionsProvider);
    this.$get = function () {
      delete self.fn.$get;
      return function jQuery(query) {
        var el = query instanceof HTMLElement ? query : document.querySelectorAll(query);
        el = jQLite(el);
        angular.forEach(self.fn, function (fn, key) {
          el[key] = fn.bind(el[0]);
        });
        return el;
      };
    };
  }
]);