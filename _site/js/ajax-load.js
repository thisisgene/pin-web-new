

var convertLinks = function(){
  console.log("adf");
  var documentRoot = document;

  // Get all links
  var links = documentRoot.querySelectorAll(".pjax");

  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    var isLangLink = ($(link).hasClass('lang-link')?true:false);
    var href = $(link).attr('href');
    if (href.indexOf('http://') !== 0) {


      (function(href, isLangLink){

        $(link).on('click', function(e){
          // console.log(href);

          if (isLangLink) {
            var lang = $('a[href="'+href+'"]').data('lang');
            $('html')[0].lang = lang;
          }

          if (e.metaKey || e.ctrlKey) return;

          e.preventDefault();
          setNewLangHref(href)
          openPage(href, isLangLink);

        });
      })(href, isLangLink);
    };
  }

};

window.onpopstate = function(event) {
  var href = event.state.href;
  loadPage(href);
};

function setNewLangHref(href) {
  // console.log(href);
  var myLink = $('a[href="'+href+'"]');
  // console.log(myLink.attr('href'));
  var langLinks = document.querySelectorAll(".lang-link");
  // console.log(langLinks);
  for (var i = 0; i < langLinks.length; i++) {
    var lLink = $(langLinks[i]);
    var lang = lLink.data('lang');
    // console.log(href);
    $.each(myLink.data(), function(i, v){
      // console.log(i, v);
      if (i == lang) {
        // console.log(href);
        lLink.attr('href', v);
        // console.log(lLink.attr('href'));
      }
    })
  }
}

function openPage(href, isLangLink) {
  history.pushState({ href: href }, href, href);
  loadPage(href, isLangLink);
}

function loadPage(href, isLangLink) {
  $('#content-container').addClass('loading');
  $("body").removeClass("background-loaded");
  for (var i = 0; i < $('.pjax').length; i++) {
    var link = $('.pjax').eq(i);

    if (link.attr('href')==href) {
      link.addClass('active')
    }
    else {
      link.removeClass('active')
    }
  }

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      if(xmlhttp.status == 200) {

        finishedLoading(xmlhttp.response, isLangLink);


      }
      else { console.log("something else other than 200 was returned"); }
    }
  }
  // console.log(href);

  // console.log($('#content-container').prop('class'));
  xmlhttp.open("GET", href, true);

  // Tells the browser to retrieve the response as a HTML document
  xmlhttp.responseType = "document";

  xmlhttp.send();


  // $.ajax({
  //   type: 'GET',
  //   url: href,
  //   dataType: 'document'
  // }).done(function(e){
  //   console.log(e)
  // })
}

function finishedLoading(responseHtml, isLangLink) {

  if (isLangLink) {

    var newHTML = responseHtml.querySelector('#main-wrapper').innerHTML;
    // console.log(newHTML);
    var mainElement = document.querySelector('#main-wrapper');

  }
  else {

    var newHTML = responseHtml.querySelector('#content-container').innerHTML;
    var mainElement = document.querySelector('#content-container');
  }

  mainElement.innerHTML = newHTML;


  $('#content-container').removeClass('loading');
  // convertLinks();

  // mainScript();
  // if (!$('#content').hasClass('logo-intro')){
  //   $('#logo').delay(300).fadeIn(300);
  //   $('.logo-intro').removeClass('logo-intro');
  //   $('.body-home').removeClass('body-home');
  // }
  // else {
  //   $('body').addClass('body-home');
  //   console.log('homescreen');
  //   $('#logo').fadeOut(100);
  //   $('#content').addClass('logo-intro');
  //   $('#header-container').addClass('logo-intro');
  // }
  // if($('#menu-icon').css('display')=='none'){
  //   desktopScript();
  // }
  // if (bonus!==undefined) {
  //   showAlert(bonus.type, bonus.text);
  // }

}

$(document).ready(function(){
  convertLinks();
});
