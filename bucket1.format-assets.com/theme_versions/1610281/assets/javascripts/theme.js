var activeSlideIndex = 0;
var initialHash = 0;
var slideAssetsLength = 0;
var enough_assets = null;

var captions = [];

var FULLHEIGHTDESKTOP_MOBILE = "full height desktop or mobile";
var FIXEDHEIGHTDESKTOP = "fixed height desktop";
var ASPECT_RATIO_PORTRAIT = "portrait";
var ASPECT_RATIO_LANDSCAPE = "landscape";
var viewportWidth;

var respUtils = window._4ORMAT.importResponsiveUtilities();
var mobileMenu = window._4ORMAT.importMobileMenu();

$(document).ready(function(){

  mobileMenu.setup({
    menuSelector: ".nav",
    navSelector: ".menu_wrap"
  });

  setAssetsWidth();
  viewportWidth = window.innerWidth;
  slideAssetsLength = $('.asset').length - 1;

  if($('body').hasClass('gallery')) { initGallery(); }
  if($('body').hasClass('listing')) { initListing(); }
  if($('body').hasClass('client')) { initClient(); }

  if(!$('body').hasClass('basic')) {
    // add border to last category in group
    $('.category').each(function() {
      if(! $(this).next().next().hasClass('category')) {
        $(this).addClass('list_end_cat');
      }
    });

    if($('.menu_wrap').hasClass('collapsable')) {
      initMenuCollapsing();
    } else {
      $('.category').addClass('open_cat');
    }

    $('.nav_container').css('overflow', 'visible');

    $(window).load(function() {
      positionContent();

      if (!respUtils.mobile()) {
        $('ul.social_icons').fadeIn();
      }

      $(window).bind('resize', function () {
        viewportWidth = window.innerWidth;
        positionContent();
      });
    });
  }

  if (!$('body').hasClass('gallery')) {
    if (respUtils.tablet() && _4ORMAT_DATA.theme.gallery_image_height != 'Full Browser Height') {
      $('#content, #content_page_outer').css('top', $(".nav_container:visible").position().top - 275);
    }

    if (respUtils.mobile()) {
      $('#content, #content_page_outer').css('top', $(".nav_container:visible").height());
    }
  }
});

// Helper functions

function setAssetsWidth(initial){
  var width = initial || 30;

  $('.gallery .assets').find('.asset').each(function(){
    width = width + $(this).outerWidth(true);
  });

  $('.gallery .assets #assets_wrap').width(width * 2);
  $('.gallery .assets').width(width);
};

function resizeImage(img) {
  if (respUtils.device()) {
    positionGalleryImage(img, getComputedHeight());
  }
  var imageWidth = $(this).width();
  $(this).parent().parent().find(".img").css('width',imageWidth);
};

function initMenuCollapsing() {
  // show/hide category content
  $('.category').click(function() {
    $('.category_container').slideUp(190 ,function() {
      $('.menu_wrap').jScrollPane();
    });

    if($(this).hasClass('open_cat')) {
      $('.category').removeClass('open_cat');
    } else {
      $('.category').removeClass('open_cat');
      $(this).addClass('open_cat');
    }

    if($(this).next('.category_container').css('display') == 'none') {
      $(this).next('.category_container').slideDown(220 , function() {
        $('.menu_wrap').jScrollPane();
      });
    }
  });


  // hover for category (note: some versions of ie don't support :hover on non-anchor elements so jQuery method is used instead)
  $('.category').hover(function() {
    $(this).toggleClass('hover');
  },
  function() {
    $(this).toggleClass('hover');
  });

  // category container with current item open by default
  $('.category.open_cat').next().show();
};

function positionContent() {

  var image_height;
  var menu_height;
  var mobileGalleryTop;
  var isDevice = respUtils.device();
  var isMobile = respUtils.mobile();
  var availableHeight = getComputedHeight();

  if (isMobile) {
    image_height = availableHeight;
    menu_height = $(".nav:visible").height();
  } else {
    image_height = (respUtils.fullHeightModeOrDevice()) ? availableHeight : $('body').attr('id').replace('imgsize_', '');
    menu_height = parseInt(image_height, 10) + $('.social_icons').height() + parseInt($('.social_icons').css('margin-top').replace('px', ''), 10);
    if (!isDevice) {
      menu_height = menu_height + $('.nav_container').offset().top;
    }
  }

  if(isDevice && $('body').hasClass('gallery')) {
    if (isMobile) {
      mobileGalleryTop = menu_height + (getWindowSpace() * 0.025);
    } else {
      mobileGalleryTop = getWindowSpace() * 0.025;
    }
    $('#content .container').css({
      'top': mobileGalleryTop,
      'marginTop': '0'
    });
  }

  if (isMobile) {
    return;
  }

  // Positioning listing and simple content

  if(!isDevice && ($('body').hasClass('listing') || $('body').hasClass('simple'))) {
    $('#content').css('top', $('.nav_container').offset().top - $(window).scrollTop() + 'px');
    $('body > .footer_text').css('top', $('.nav_container').offset().top - $(window).scrollTop() + 'px');
  }

  if($(window).height() < menu_height + 10) {
    var new_height = $(window).height() - $('.social_icons').height() - parseInt($('.social_icons').css('marginTop').replace('px', ''), 10) - 20;

    // $('.nav').css('min-height', new_height);
    $('.nav_container').css({
      'height': new_height,
      'marginTop': '0',
      'top': ($('body').hasClass('listing') || $('body').hasClass('simple')) ? '0' : $('#content').offset().top
    });

    $('#content .container').css('padding-bottom', $('.social_icons').height() + parseInt($('.social_icons').css('marginTop').replace('px', ''), 10) * 2);
    var menuWrapHeight = new_height - $('#logo').height() - parseInt($('#logo').css('marginTop'), 10) - parseInt($('#logo').css('marginBottom'), 10) - 10;

    initOrReinitjScrollPane($('.menu_wrap'), {
      width: "",
      height: menuWrapHeight
    });

  } else if(($('body').hasClass('listing') || $('body').hasClass('simple') || $('body').hasClass('client')) && $('body').attr('id') == 'imgsize_fullbrowserheight') {
    var new_height = $(window).height() - $('.social_icons').height() - parseInt($('.social_icons').css('marginTop').replace('px', ''), 10) - 20;

    // $('.nav').css('min-height', new_height);
    $('.nav_container').css({
      'height': new_height,
      'marginTop': '0'
    });

    $('#content .container').css('padding-bottom', $('.social_icons').height() + parseInt($('.social_icons').css('marginTop').replace('px', ''), 10) * 2);
    var menuWrapHeight = new_height - $('#logo').height() - parseInt($('#logo').css('marginTop'), 10) - parseInt($('#logo').css('marginBottom'), 10) - 10;

    initOrReinitjScrollPane($('.menu_wrap'), {
      width: "",
      height: menuWrapHeight
    });

    if (isDevice && _4ORMAT_DATA.theme.gallery_image_height === 'Full Browser Height') {
      var menuWrapHeight = $(window).height() - $('#logo').outerHeight() - $('.nav_container > .social_icons').outerHeight() - 20;
      $('.menu_wrap').height(menuWrapHeight);
    }

  } else {
    $('.nav').css('min-height', '');
    $('.nav_container').css({
      'height':'',
      'marginTop': '',
      'top': ''
    });
    $('#content .container').css('padding-bottom', '');

    if (isDevice) {
      if (_4ORMAT_DATA.theme.gallery_image_height === 'Full Browser Height') {
        var menuWrapHeight = $(window).height() - $('#logo').outerHeight() - $('.nav_container > .social_icons').outerHeight() - 20;
      } else {
        var menuWrapHeight = 550 - $('#logo').outerHeight() - $('.nav_container > .social_icons').outerHeight();
      }
      $('.menu_wrap').height(menuWrapHeight);
    } else {
      var menuWrapHeight = parseInt(image_height, 10) - $('#logo').height() - parseInt($('#logo').css('marginTop'), 10) - parseInt($('#logo').css('marginBottom'), 10);
      initOrReinitjScrollPane($('.menu_wrap'), {
        width: "",
        height: menuWrapHeight
      });
    }
  }
};

function initGallery() {
  if(location.hash !== ""){
    initialHash = parseInt(location.hash.slice(1));
  } else {
    initialHash = 0;
  }
  var isDevice = respUtils.device();
  if (!isDevice) {
    $('.container').css( 'padding-left', parseInt($('.container').css('padding-left').replace('px', '')) + parseInt($('.nav').css('left').replace('px', '')) + 'px' );
    //if($('html').hasClass('win')) { enable_scrolling(); }
    enable_scrolling();
    if($('html').hasClass('ie8')) { setMarginTop(); }
  }

  if(_4ORMAT_DATA.theme.nav_arrows_toggle) {

    enough_assets = $('.asset').length > 1;

    if(enough_assets) {
      $('#content').mousemove(customCursor);
    } else if ($('html').hasClass('ie8')) {
      $('.ie-prev, .ie-next').hide();
    }

    var content = $("#content");

    if(_4ORMAT_DATA.theme.nav_arrow_thickness === 'Thin'){
      content.addClass('cursor_s')
    } else if(_4ORMAT_DATA.theme.nav_arrow_thickness === 'Medium'){
      content.addClass('cursor_m')
    } else if(_4ORMAT_DATA.theme.nav_arrow_thickness === 'Thick'){
      content.addClass('cursor_l')
    }

    if(_4ORMAT_DATA.theme.nav_arrow_style === 'Light'){
      content.addClass('cursor_white')
    } else if(_4ORMAT_DATA.theme.nav_arrow_style === 'Dark'){
      content.addClass('cursor_black')
    }

    if($('html').hasClass('ie8')) {
      $('.ie-prev').click(function(){
        if(activeSlideIndex >= 0) { activeSlideIndex -= 1; }
        if(activeSlideIndex < 0) { activeSlideIndex = 0; }
        $('a.image_text.opened').click();
        moveSlider(activeSlideIndex);
        $('.embed_container iframe').remove();
        return false;
      });
      $('.ie-next').click(function(){
        if(activeSlideIndex < slideAssetsLength) { activeSlideIndex += 1; }
        if(activeSlideIndex > slideAssetsLength) { activeSlideIndex = slideAssetsLength; }
        $('a.image_text.opened').click();
        moveSlider(activeSlideIndex);
        $('.embed_container iframe').remove();
        return false;
      });
    } else {
      $('#content').bind('click', function(e){
        if(enough_assets) {
          if(!($(e.target).hasClass('image_text') || $(e.target).hasClass('image_text_container') || $(e.target).parents('.image_text_container').length === 1 || $(e.target).closest('a').length)) {
            if($(this).hasClass('cursor_left')) { activeSlideIndex -= 1; }
            if($(this).hasClass('cursor_right')) { activeSlideIndex += 1; }

            if(activeSlideIndex < 0)
              activeSlideIndex = 0;

            if(activeSlideIndex > slideAssetsLength)
              activeSlideIndex = slideAssetsLength;

            $('.embed_container iframe').remove();
            moveSlider(activeSlideIndex);
            customCursor(e);

            return false;
          }
        }
      });
    }

    $("body").keydown(function(e) {
      if(e.keyCode == 37) { activeSlideIndex -= 1; }
      if(e.keyCode == 39) { activeSlideIndex += 1; }
      if(e.keyCode == 37 || e.keyCode == 39) {

        if(activeSlideIndex < 0)
          activeSlideIndex = 0;

        if(activeSlideIndex > slideAssetsLength)
          activeSlideIndex = slideAssetsLength;

        // set new url to current image
        location.hash = "#" + activeSlideIndex;

        moveSlider(activeSlideIndex);
        $('.embed_container iframe').remove();
        e.preventDefault();
      }
    });
  }

  if( !isDevice && _4ORMAT_DATA.theme.gallery_image_height != 'Full Browser Height'){
    _4ORMAT.Lazyload.add('.asset img', {
      priority: 10,
      beforeShow: function(img) {
        $(img).css({opacity: 0});
        $(img).closest('.asset').removeClass('loading');
      },
      complete: function(img){
        setTimeout(function(){
          img.animate({opacity: 1.0}, {duration: 500, complete: function(){
            img.parent().next().width(img.width() - 10).fadeIn('fast');
          }});


          // do the image resize again... Safari has been observed to not
          // retrigger the image onload for pixel.gif as well as the lazy
          // loaded image.
          resizeImage(this);
          setAssetsWidth();
        }, 5);
      }
    });
    _4ORMAT.Lazyload.init();
  }

  $('.asset img').load(function(){
    setAssetsWidth();
  });

  // This sets width of copy for images on horizontal
  $(".asset.image img").load(function() {
    resizeImage(this);
  });

  $(".caption_cta, .caption_close").on("click", function () {
    var $this = $(this);
    var $asset = $this.closest(".asset");

    $asset.toggleClass("show-caption");
  });

  $(window).load(function() {
    $('.asset.txt .wrap').jScrollPane();
    if (!isDevice && _4ORMAT_DATA.theme.gallery_image_height != 'Full Browser Height') {
      $('.asset.title .wrap').jScrollPane();
    }
    if( $("body").hasClass("gallery") ){

      $(window).scroll(function(){
        setActiveSlide();
      });

      $("#content").scroll(function(){
        setActiveSlide();
      });
      setTimeout(function(){
        loadSlideAtIndex(initialHash);
      }, 100);
    }
  });

  if (isDevice || _4ORMAT_DATA.theme.gallery_image_height == 'Full Browser Height') {
    //var windowSpace;
    setFullBrowserHeight();
  }
};

function initListing() {
  _4ORMAT.Lazyload.add('.asset .img img', {
     complete: function(img){ img.animate({opacity: 1.0}, 1000); }
   });
  _4ORMAT.Lazyload.init();
};

function initClient() {
  var isMobile = respUtils.mobile();
  if (!isMobile) {
    $('#content').css( 'padding-left', parseInt($('#content').css('padding-left').replace('px', '')) + parseInt($('.nav').css('left').replace('px', '')) + 'px' );
  } else {

  }
}

//tomek

function setFullBrowserHeight (){
  var isDevice = respUtils.device();

  if ($('body.gallery').length) {
    $('body, html').css('overflow-y', 'hidden');

    $('#content .container').css({
        'position': 'absolute',
        'marginTop': '0',
        'paddingBottom': 0,
        'top': 0
    });

    if (!$.browser.msie || $.browser.version != '7.0') {
      $('#content .container').css({
        'overflow-y': 'hidden'
      });
    }

    setAssetsSize();
    positionContent();
    $(window).resize(function() {
      if (mobileMenu.isVisible()) {
        mobileMenu.hide();
      } else {
        renderGallery()
      }
      setMarginTop();
      if (respUtils.device()) {
        window.scrollTo(0, 0);
      }
    });

    _4ORMAT.Lazyload.add('.asset img', {
      priority: 10,
      beforeShow: function(img) {
        $(img).css({opacity: 0});
        $(img).closest('.asset').removeClass('loading');
      },
      complete: function(image){
        setTimeout(function(){
          $(image).closest('.asset').removeClass('loading');
          image.animate({opacity: 1.0}, 500);
          if (!isDevice) {
            var copyHeight = image.parent().next().outerHeight(true);
            captions.push(copyHeight);
          }
          var totalHeight = getComputedHeight();
          setVideoHeight();
          if (isDevice) {
            $('.asset.img').not('.loading').find('img').css('height', totalHeight);
          } else {
            $('.asset').not('.loading').find('img').css('height', totalHeight);
          }
          setAssetsSize();
          if (!isDevice) {
            image.parent().next().fadeIn('fast');
          }
        }, 5);
      }
    });

    _4ORMAT.Lazyload.init();
  }
}

function setVideoHeight() {
  $('.asset.video').each(function() {
    var $previewContainer = $(this).find(".preview");
    if (!$previewContainer.hasClass("vimeo_cont") && !$previewContainer.hasClass("youtube_cont")) {
      return;
    }
    positionGalleryVideo($(this), $previewContainer);
  });
}

//tomek
function getWindowSpace() {

  if (respUtils.mobile()) {
    return (window.innerHeight - $(".nav:visible").height());
  } else {
    return $(window).height();
  }
}

function getComputedHeight() {
  if (respUtils.device()) {
    return getWindowSpace() * 0.95;
  } else {
    return getWindowSpace() - Math.max.apply(Math, captions);
  }
}

function setAssetsSize(all) {
  captions = [];
  var width = 0;
  var captionHeight;
  var $el;
  var isDevice = respUtils.device();

  windowSpace = getWindowSpace();
  //set max height to 1200 px ?
  windowSpace = windowSpace > 1200 ? 1200 : windowSpace;
  if (isDevice) {
    windowSpace = getComputedHeight();
  }

  $('.asset').each(function(){
    var that = $(this);

    if (that.hasClass('image') && !isDevice) {
      captionHeight = that.find('.image_text_container').outerHeight(true);
      captions.push(captionHeight);
    } else if (that.hasClass('txt')) {

      $el = that.css({'height': windowSpace}).find('.wrap').css({'height': windowSpace});
      initOrReinitjScrollPane($el, {
        width: "",
        height: windowSpace
      });

    } else if (that.hasClass('title')) {
      if (!that.find('img').length) {
        $el = that.css('height', windowSpace).find('.wrap').css('height', windowSpace);
        initOrReinitjScrollPane($el, {
          width: "",
          height: windowSpace
        });
      } else {
        captionHeight = that.find('.asset_copy').outerHeight(true);
        captions.push(captionHeight);
        if (isDevice) {
          $el = that.css('height', windowSpace).find('.wrap').css('height', windowSpace);
          if (that.find(".inner_wrap").length === 1) {
            initOrReinitjScrollPane($el, {
              width: "",
              height: windowSpace
            });
          }
        }
      }
    } else if (that.hasClass('video')) {
      captionHeight = that.find('.copy').outerHeight(true);
      captions.push(captionHeight);

    }
  });

  var totalHeight = getComputedHeight();
  setVideoHeight();
  if (!isDevice) {
    $('.asset.title').find('img').css({'height': totalHeight});
  }
  $el = $('.asset.txt .wrap').height(totalHeight);
  initOrReinitjScrollPane($el, {
    width: "",
    height: totalHeight
  });

  if (all) {
    $('.asset.image').not('.loading').find('img').each(function () {
      positionGalleryImage(this, totalHeight);
    });
  }

  $('.asset.image').not('.loading').each(function(){
    var assetWidth = $(this).find('img').width();
    $(this).width(assetWidth);
  });

  $('.asset').each(function(){
    var that = $(this);
    width = width + that.outerWidth(true);
  });

  if (isDevice) {
    $('.gallery .assets #assets_wrap').width(width * 2).height(totalHeight);
    $('.gallery .assets').width(width).height(totalHeight);
  } else {
    $('.gallery .assets #assets_wrap').width(width * 2).height(getWindowSpace());
    $('.gallery .assets').width(width).height(getWindowSpace());
  }

  var size = $('body').attr('id');
  if (size.split('_')[1] == 'fullbrowserheight') {
    $('body').attr('id', 'imgsize_' + totalHeight);
  }

  $(window).load(function() {
    setAssetsSize(true);
  });
}

function enable_scrolling() {
  $('.container').mousewheel(function(event, delta, deltaX, deltaY) {
    var d = 0, d2 = 0, m = 40;
    if( Math.abs(deltaX) >= Math.abs(deltaY) ) {
      d2 = -deltaX
    }
    else {
      d2 = deltaY
    }
    d = d2 * m;
    // if not in a text scrolling area we will scroll the appropriate amount
    if(!$(event.target).parents(".jspScrollable").length) {
      if( $(window).width() <= 1024 ){
        $('#content')[0].scrollLeft -= d;
      }
      else {
        if($.browser.mozilla || $.browser.msie) {
          $('html')[0].scrollLeft -= d;
        } else {
          $('body')[0].scrollLeft -= d;
        }
      }
      return false;
    }
  });
}

var $window = $(window);

function setLocationHash(hash){
	if(history.pushState) {
    history.pushState(null, null, '#'+ hash);
	}
	else {
  	location.hash = '#'+ hash;
	}
}

function loadSlideAtIndex(index){
	var scrollLeft = 0;
	var center = 0;
	var $assets = $("#content .asset");
	var $asset = $assets.eq(index);
	$scrollEl = $(window).width() <= 1024 ? $("#content") : $("html, body");
	if(index === 0){
		$scrollEl.scrollLeft(0);
	}
	else if (index === $assets.length - 1){
		$scrollEl.scrollLeft( $(".assets")[0].scrollWidth );
	}
	else {
		center = $asset.offset().left - (Math.ceil((-$asset.width() + $(window).width()) / 2));
		$scrollEl.scrollLeft(center);
	}
}

function moveSlider(direction) {   // slide index
  var imageSpeed = 0;
  var slides = $('.asset');

  if(_4ORMAT_DATA.theme.gallery_change_image_speed == 'Slow') {
    imageSpeed = 800;
  } else if(_4ORMAT_DATA.theme.gallery_change_image_speed == 'Normal') {
    imageSpeed = 550;
  } else if(_4ORMAT_DATA.theme.gallery_change_image_speed == 'Fast') {
    imageSpeed = 400;
  }

    // if its the first/last item, dont scroll
  if ( $(slides[direction]).length == 0 ) return false;

  // try and get the next slide and slide to it. if it fails, just animate by 350px :)
  try {

    var target_slide = $(slides[direction]);
    var activeSlidePosition = parseInt(target_slide.position().left, 10) + (target_slide.outerWidth()/2 - $(window).width()/2) + 1;

    onScrollComplete = function() {
      setTimeout(function(){
        activeSlideIndex = parseInt(location.hash.slice(1));
        if(activeSlideIndex <= 0){
          $('.ie8 .gallery .ie-prev').hide();
        } else {
          $('.ie8 .gallery .ie-prev').show();
        }

        if(activeSlideIndex >= slideAssetsLength){
          $('.ie8 .gallery .ie-next').hide();
        } else {
          $('.ie8 .gallery .ie-next').show();
        }
      }, 30);
    }

    // if we have nowhere to scroll, then complete right away, otherwise do the animation
    var $scrollEl = $(window).width() <= 1024 ? $("#content") : $("html, body")
    if (activeSlidePosition < 0 && $window.scrollLeft() == 0) {
      return onScrollComplete()
    } else {
      $scrollEl.stop().animate({ scrollLeft: activeSlidePosition }, {queue :false, duration: imageSpeed, complete: onScrollComplete });
    }
  } catch (err) {
    var slide_direction = direction > 0 ? '+=350' : '-=350';

    $scrollEl.stop().animate({scrollLeft: slide_direction }, {
      queue: false,
      duration: imageSpeed,
      complete: function() {
        activeSlideIndex = parseInt(location.hash.slice(1));
      }
    });
  }
}

function setActiveSlide() {
	var currSlideIndex = activeSlideIndex;
  var $slides = $('#content .asset');
	var $window = $(window);
  var scrollLeft = 0;
  if( $(window).width() <= 1024 ){
    scrollLeft = $("#content")[0].scrollLeft;
  }
  else {
    scrollLeft = $(window).scrollLeft();
  }
	var assetIndex = 0;
	var $asset = null;

	if( scrollLeft <= ( $slides.eq(1).offset().left - (Math.ceil((-$slides.eq(1).width() + $(window).width()) / 2)) - 1) ){
		assetIndex = 0;
		$asset = $slides.first();
		activeSlideIndex = assetIndex;
		setLocationHash(assetIndex);
	} else if ( scrollLeft >= ( $slides.last().offset().left - ($slides.last().width()) - 1) ){
		assetIndex = $slides.length - 1;
		$asset = $slides.eq(assetIndex);
		activeSlideIndex = assetIndex;
		setLocationHash(assetIndex);
	}
	else {
		var el  = document.elementFromPoint( $window.width() / 2, $window.height() / 2 );
		if( $(el).find(".asset").length ){
			$asset = $slides.eq(currSlideIndex);
		}
		else if( $(el).parents(".asset").length ){
			$asset = $(el).parents(".asset");
		}
		else {
			$asset = $(el);
		}
		var center = $asset.offset().left - (Math.ceil((-$asset.width() + $(window).width()) / 2));
		if( scrollLeft >= center ){
			assetIndex = $asset.index() !== -1 ? $asset.index() : activeSlideIndex;
			activeSlideIndex = assetIndex;
			setLocationHash(assetIndex);
		}
	}
}

function customCursor(e) {
  var content = $('#content');
  var _x = e.pageX - $(window).scrollLeft();
  var _w = $(window).width();

  // test if we are on the left or right
  if(_x > _w/2) { content.addClass('cursor_right').removeClass('cursor_left'); }
  else { content.addClass('cursor_left').removeClass('cursor_right'); }

  // override if first or last slide
  var currentHash = parseInt(location.hash.slice(1));
  if(currentHash === 0) { content.addClass('cursor_right').removeClass('cursor_left'); }
  else if(currentHash === slideAssetsLength) { content.addClass('cursor_left').removeClass('cursor_right'); }
}

$(function(){
  if($('body').hasClass('gallery')){
    var scrollY = 0;
    var scrollX = 0;

    $(document).bind('touchstart', function( e ){
        scrollY = e.originalEvent.touches.item(0).clientY;
        scrollX = e.originalEvent.touches.item(0).clientX;
    });

    $(document).bind('touchmove', function( e ){
        var scrollDeltaY     = scrollY - e.originalEvent.touches.item(0).clientY;
        var scrollDeltaX     = scrollX - e.originalEvent.touches.item(0).clientX;
        scrollY             = e.originalEvent.touches.item(0).clientY;
        scrollX             = e.originalEvent.touches.item(0).clientX;

        if ($(e.target).closest(".menu_wrap").length || $(e.target).closest(".image_text_container").length || $(e.target).closest(".copy").length) {
          return true;
        }

        if ( Math.abs(scrollDeltaY) > Math.abs(scrollDeltaX * 0.6) )
            e.preventDefault();
    });
  }
});

function setMarginTop(){
  $('.ie-next, .ie-prev').css({
    'top': ($('#content').offset().top + $(window).height() / 2 - $('.ie-prev').outerHeight() / 2)
  });
}

function renderGallery() {
  setAssetsSize(true);
  positionContent();
}

function initOrReinitjScrollPane(el, dimensions) {
  var $el = $(el);
  var $parentEl = $el.parent();
  var jspAPI = $el.data("jsp");
  if (jspAPI) {
    jspAPI.destroy();
    $el = $parentEl.find(".wrap");
  }
  $el.css(dimensions || {
    "width": "",
    "height": ""
  });
  $el.jScrollPane();
}

function setImageSizingStrategy($img) {
  var aspectRatio = $img.data("aspect-ratio");
  var dimensions = aspectRatio.split(":");
  var width = parseInt(dimensions[0], 10);
  var height = parseInt(dimensions[1], 10);
  var calculatedRatio = width / height;

  setItemSizingStrategy($img, calculatedRatio);
  return {
    width: width,
    height: height,
    aspectRatio: calculatedRatio
  };
}

function setVideoSizingStrategy($videoAsset) {
  var aspectRatio = $videoAsset.data("video-ratio");
  setItemSizingStrategy($videoAsset, parseFloat(aspectRatio));
}

function setItemSizingStrategy($item, ratio) {
  if ($item.data("sizing")) {
    return;
  }

  if (ratio >= 1) {
    $item.attr("data-sizing", ASPECT_RATIO_LANDSCAPE);
  } else {
    $item.attr("data-sizing", ASPECT_RATIO_PORTRAIT);
  }
}

function positionGalleryImage(img, verticalSpace) {
  var $img = $(img);
  var STRATEGY_FIT_WIDTH = "fit-width";
  var STRATEGY_FIT_HEIGHT = "fit-height";
  var chosenStrategy = STRATEGY_FIT_HEIGHT;

  imgInfo = setImageSizingStrategy($img);

  if (!respUtils.device()) {
    $img.css('height', verticalSpace);
    return;
  }

  var isPortraitOriented = window.matchMedia("(orientation: portrait)").matches;

  if ($img.data("sizing") === ASPECT_RATIO_LANDSCAPE) {
    var calculatedWidth, calculatedHeight;
    viewportWidth = viewportWidth || window.innerWidth;
    calculatedWidth = viewportWidth * 0.85;
    calculatedHeight = calculatedWidth * imgInfo.height / imgInfo.width;
    if (verticalSpace >= calculatedHeight) {
      chosenStrategy = STRATEGY_FIT_WIDTH;
    }
  }

  if (chosenStrategy === STRATEGY_FIT_WIDTH) {
    $img.css({
      width: "",
      height: "auto"
    });
    $img.css({
      marginTop: "" + (0.5 * (verticalSpace - $img.height())) + "px"
    });
  } else {
    $img.css({
      width: "auto",
      height: verticalSpace,
      marginTop: ""
    });
  }
}

function positionGalleryVideo($videoAsset, $previewContainer) {
  var videoAspectRatio = parseFloat($videoAsset.data("video-ratio"));
  var verticalSpace = getComputedHeight();

  if (respUtils.device()) {
    var STRATEGY_FIT_WIDTH = "fit-width";
    var STRATEGY_FIT_HEIGHT = "fit-height";
    var chosenStrategy = STRATEGY_FIT_HEIGHT;
    var isPortraitOriented = window.matchMedia("(orientation: portrait)").matches;
    var width, height;
    setVideoSizingStrategy($videoAsset);
    if ($videoAsset.data("sizing") === ASPECT_RATIO_LANDSCAPE) {
      width = window.innerWidth * 0.9;
      height = width / videoAspectRatio;
      if (verticalSpace >= height) {
        chosenStrategy = STRATEGY_FIT_WIDTH;
      }
    }

    if (chosenStrategy === STRATEGY_FIT_WIDTH) {
      $previewContainer.css({
        width: width,
        height: height
      });
      $videoAsset.css({
        width: width,
        height: height,
        marginTop: "" + (0.5 * (verticalSpace - height)) + "px"
      });
    } else {
      width = verticalSpace * videoAspectRatio;
      height = verticalSpace;
      $previewContainer.css({
        width: width,
        height: height
      });
      $videoAsset.css({
        width: width,
        height: height,
        marginTop: ""
      });
    }
  } else {
    var height = verticalSpace;
    var width = verticalSpace * videoAspectRatio;
    $previewContainer.css({
      'height': height,
      'width': width
    });
    $videoAsset.width(width);
  }
}

// Ripped from Underscore
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function() {
    var last = now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function() {
    context = this;
    args = arguments;
    timestamp = now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}
