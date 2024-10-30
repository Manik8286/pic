/*
* jQuery easyShare plugin
* Update on 28 december 2011
* Version 1.0
*
* Licensed under GPL <http://en.wikipedia.org/wiki/GNU_General_Public_License>
* Copyright (c) 2008, St�phane Litou <contact@mushtitude.com>
* All rights reserved.
*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var timerDown = null;
var mouseYLastPos = 0;
var mouseXLastPos = 0;
var mouseDown = false;
var mouseUp = false;
var mouseRight = false;
var mouseLeft = false;

var MoveWait = 150;

var mouseDownLeft = false;
var mouseDownRight = false;

var lastGroup = null;

(function($) {
  $.fn.desktopNav = function() {
    var groupAttr = 'data-exn-group';
    var subnavAttr = 'data-exn-name';
    var subnavClass = 'js-exn-sub';

    var $this = $(this);
    var buttonClass = $this.attr('data-exn-toggles');
    var targetClass = $this.attr('data-exn-target');
    var $buttons = $(buttonClass);
    var $target = $(targetClass);

    var closeDelay = $this.attr('data-close-delay') || 100;
    var willCollapse = false;
    var collapsedBy = 0;
    var lastOpenedGroup;

    $buttons.on('click', function(e) {
      $(this).blur();
    });

    // Enter the button: expand the sub-panel ($target)
    // and show the corresponding subnav
    $buttons.on('mousemove', function(e) {
      var newGroup = $(this).attr(groupAttr);
      var $subnav = $('.' + subnavClass + '[' + subnavAttr + '="' + newGroup + '"]');
      var hasSubnavItems = $subnav.find('ul li').length > 0;
      if (hasSubnavItems && CheckSense(newGroup)) {
        showSub(newGroup);
        lastGroup = (!mouseDown ? newGroup : lastGroup);
        willCollapse = false;
        expand();
      } else {
        hideOpenSub();
        $target.removeClass('-expanded').dequeue();
      }
    });

    // Leave the button: set the sub-panel in willCollapse-state
    $buttons.on('mouseleave', function(e) {
      var newGroup = $(this).attr(groupAttr);
      if (CheckSense(newGroup)) {
        willCollapse = !mouseDown;
        collapse(++collapsedBy);
      }
    });

    // Leave the body : collapse (case when navigation glitched)
    $("body").on('mouseleave', function() {
      willCollapse = true;
      collapse(++collapsedBy);
    });

    // Enter the sub-panel: show it
    $target.on('mouseenter', function(e) {
      willCollapse = false;
      expand();
    });

    // Leave the sub-panel: set the sub-panel in willCollapse-state
    $target.on('mouseleave', function(e) {
      willCollapse = true;
      collapse(++collapsedBy);
    });

    // Helper to collapse the sub-panel $target
    function collapse(collapseId) {
      $target.delay(closeDelay).queue(function() {
        if (willCollapse && collapseId == collapsedBy) {
          hideOpenSub();
          $(this).removeClass('-expanded').dequeue();
        } else {
          $(this).dequeue();
        }
      });
    }

    // Helper to expand the sub-panel $target
    function expand() {
      $target.addClass('-expanded');
      showSub(lastOpenedGroup);
    }

    // Helper to show the subnav
    function showSub(group) {
      lastOpenedGroup = group;
      hideOpenSub(group);
      $(buttonClass + '[' + groupAttr + '="' + group + '"]').addClass(
        '-active');
      $('.' + subnavClass + '[' + subnavAttr + '="' + group + '"]').addClass(
        '-visible');
    }

    // Helper to hide the opened subnavs
    function hideOpenSub(except) {
      $buttons.removeClass('-active');
      $('.' + subnavClass + '.-visible').each(function() {
        if ($(this).attr(subnavAttr) !== except) {
          $(this).removeClass('-visible')
            .queue(function() {
              $(this).dequeue();
            });
        }
      });
    }
  };

  function CheckSense(group) {
    var show = false;
    //console.log(mouseDown + " (" + group + " / " + lastGroup + ")");
    if (lastGroup == group || lastGroup == null) {
      show = true;
    } else {
      if (!mouseDown) {
        lastGroup = null;
        show = true;
      }
    }
    return show;
  }

  function DelayFalse() {
    clearTimeout(timerDown);
    timerDown = setTimeout(function() {
      mouseDown = false;
      lastGroup = null;
      //console.log("SETOU (false)");

      if ($('.js-expandable-nav a:hover').length && $(
          '.js-exn-btn.-active').length) {
        $('.js-exn-btn.-active').mouseleave();
      }

      $('.js-exn-btn:hover').mousemove();
    }, MoveWait);
  }

  $(document).ready(function() {

    $('.nav.js-expandable-nav').on('mousemove', function(event) {
      $('.page-head-sub-row').show(); // hidden .page-head-sub-row onload viual bug fix

      if (event.pageY > mouseYLastPos) {
        mouseDown = true;
      } else {
        DelayFalse();
      }

      mouseUp = (event.pageY < mouseYLastPos);
      mouseRight = (event.pageX > mouseXLastPos);
      mouseLeft = (event.pageX < mouseXLastPos);

      mouseDownLeft = (mouseDown && mouseLeft);
      mouseDownRight = (mouseDown && mouseRight);

      mouseYLastPos = event.pageY;
      mouseXLastPos = event.pageX;

      if (mouseUp) {
        DelayFalse();
      }
    })
  });

  $(".contactHeaderHover").hover(function() {
      $(".-infoHover").css("visibility", "visible");
    },
    function() {
      $(".-infoHover").css("visibility", "hidden");
    });

}(jQuery));
