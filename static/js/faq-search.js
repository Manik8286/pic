$(function() {
  var el = ".js-faq-search";

  $(el).on("keyup click input", function () {
    $(".highlight").contents().unwrap();

    if (this.value.length > 0) {
      $('.question').show().filter(function () {

        var search = $(el).val().toLowerCase();
        var doHide = $(this).text().toLowerCase().indexOf(search) == -1;

        if (!doHide) {
          $(this).html($(this).html().replace(new RegExp(search + "(?=(?![^<]*>)+[^<>])", "gi"), "<span class='highlight'>$&</span>"));
        }

        return doHide;
      })
      .hide();

      $('.search-skip').hide();

      var notFound = true;
      var list = $(".question");

      for (var i = 0; i < list.length; i++) {
        if (list[i].style.display != 'none') {
          notFound = false;
          break;
        }
      }

      if (notFound) {
        addNotFoundMsg();
      }
      else {
        $("#msgNotFound").remove();
      }
    }
    else {
      $(".question").show();
      $(".search-skip").show();
      $("#msgNotFound").remove();
    }
  });

  function addNotFoundMsg() {
    var msg = document.getElementById('msgNotFound');

    if (!msg) {
      var f = $('.js-faq-questions');
      var div = document.createElement('div');

      div.setAttribute('id', 'msgNotFound');
      div.setAttribute('class', 'not-found');
      div.innerHTML = 'Sorry, no results for your search term.';

      $(f).prepend(div);
    }
  }
});
