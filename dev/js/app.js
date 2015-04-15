 var _iv_normal = 80; // random percent for NORMAL squares
 var _iv_tall = 10; // random percent for TALL squares
 var _iv_wide = 10; // random percent for WIDE squares

 // Handlebar precompiling
 var _source = $("#gbnt-template").html();
 var _template = Handlebars.compile(_source);

 // Packery global var
 var _packeryContainer = $('.packery');

 // This object will be parsed inside the URL
 var _mainObject = {
     language: "pt",
     project_id: null,
     tour_id: null
 };


 // >> dummy TOUR data
 var tour1 = "1,4,8,12,16,20,24,28,32,36";
 var tour2 = "6,13,17,25,29,33,37";
 var tour3 = "26,30,34,38";
 var _tourInformation = null;
 // << dummy TOUR data

 $(document).ready(function() {
     parseURLobject();
     prepareProjectData();
     applyTranslations();
 });

 // Adjust the layout (by refreshing the page) if user resizes window
 $(window).resize(function() {
     // location.reload();
 });

 function applyTranslations() {
     $(".gbnt-exibithion").text(doTranslation("exibithion"));
     $(".gbnt-tour").text(doTranslation("tour"));
     $(".gbnt-about").text(doTranslation("about"));
     $(".gbnt-language").text(doTranslation("language"));
     $(".about-text p").text(doTranslation("about_text"));

     if (_mainObject.language === "pt") {
         $(".gbnt-language").html("en");
     } else {
         $(".gbnt-language").html("pt");
     }
 }

 function parseURLobject() {
     try {
         var url_obj = location.hash.split("#")[1];
         if (url_obj) {
             url_obj = decodeURIComponent(url_obj);
             _mainObject = JSON.parse(url_obj);
         };
     } catch (e) {
         console.log("url is clean");
     }
 }

 function prepareProjectData() {
     $.get("docs/projectos/lista_dos_projectos.txt", function(data) {
         _projectsList = data.split(",");

         if (_mainObject.tour_id === "1") {
             _projectsList = tour1.split(",");
             _tourInformation = [{
                 tour_title: "tour_title1",
                 tour_description: "tour_description1"
             }];
         }

         if (_mainObject.tour_id === "2") {
             _projectsList = tour2.split(",");
             _tourInformation = [{
                 tour_title: "tour_title2",
                 tour_description: "tour_description2"
             }];
         }

         if (_mainObject.tour_id === "3") {
             _projectsList = tour3.split(",");
             _tourInformation = [{
                 tour_title: "tour_title3",
                 tour_description: "tour_description3"
             }];
         }

         var coverImageCounter = 0;
         for (var i = 0; i < _projectsList.length; i++) {
             coverImageCounter += 1;
             if (coverImageCounter > 10) {
                 coverImageCounter = 1;
             }
             createObject(_projectsList[i], coverImageCounter);
         }
     });
 }

 function checkAllDone(projID) {
     var yesWeAreReady = true;
     for (var i = 0; i < window._projectsList.length; i++) {
         if (projID === window._projectsList[i]) {
             window._projectsList.splice(i, 1);
             break;
         }
     }

     for (var ii = 0; ii < window._projectsList.length; ii++) {
         if (typeof window._projectsList[ii] === "string") {
             yesWeAreReady = false;
             break;
         }
     }

     if (yesWeAreReady) {
         // Let's party
         createHTML();
         correctSizes();
         randomizeDIVs();
         initializePackery();

         // If we are entering a tour, then open item_x
         if (_mainObject.tour_id) {
             openProject($("#item_x"));
             _packeryContainer.packery();
         }

         createEventHandlers();
         checkAllImagesAreLoaded();
         // doMobileFlashing();
     }
 }

 function checkAllImagesAreLoaded() {

     var $img = $('img'),
         totalImg = $img.length - 2;

     var waitImgDone = function() {
         totalImg--;
         if (!totalImg) $('.preloader').addClass("hide-me");
     };

     $('img').each(function() {
         $(this)
             .load(waitImgDone)
             .error(waitImgDone);
     });

 }

 function correctSizes() {
     var mainWidth = $(".gbnt-item.gbnt-size-normal").width();

     $(".gbnt-size-normal").each(function() {
         $(this).height(mainWidth);
     });

     $(".gbnt-size-wide").each(function() {
         $(this).height(mainWidth);
     });

     $(".gbnt-size-tall").each(function() {
         $(this).height(mainWidth * 2);
     });
 }

 function createEventHandlers() {

     // Mouse hover for fadein/fadeout Project Cover
     $(".proj-cover").hover(function getIn() {
         if ($(this).parents(".gbnt-item").attr("data-gbnt-checked") === "true" ||
             $(this).parents(".gbnt-item").hasClass("no-pointers")) {
             return;
         }
         $(this).fadeTo(100, 0);
     }, function getOut() {
         if ($(this).parents(".gbnt-item").attr("data-gbnt-checked") === "true") {
             return;
         }
         $(this).fadeTo(100, 1);
     });


     // Mouse hover for fadein/fadeout Project Text
     // this only happens if data-gbnt-checked = true, meaning, we have alredy visited this proj
     $(".proj-text").hover(function getIn() {
         if ($(this).parents("#item_x")) {
             return;
         }
         $(this).fadeTo(100, 1);
     }, function getOut() {
         if ($(this).parents("#item_x")) {
             return;
         }
         $(this).fadeTo(100, 0);
     });


     // Click event for TOUR clicked
     $(".tours a").on("click", function(e) {
         e.preventDefault();

         // Update the URL object 
         _mainObject.tour_id = $(this).attr("href");
         var str = JSON.stringify(_mainObject);
         location.hash = encodeURIComponent(str);

         location.reload();
     });


     // Click event to OPEN Project
     $(".gbnt-item").on("click", function(e) {
         if (e.target.className === "btn-view-proj") {
             return;
         }
         //If event was triggered by a DIV other than gbnt-item, then get out of here
         e.preventDefault();
         if ($(this).hasClass('no-pointers')) {
             return;
         }
         if (event.srcElement.id !== "cover") {
             return;
         }
         openProject(this);
     });


     // Click event to CLOSE Project
     $(".proj-profile .btn-close").on("click", function(e) {
         e.preventDefault();
         var gbntItemDiv = $(this).parents(".gbnt-item");
         closeProject(gbntItemDiv);
         _packeryContainer.packery(); // do reflow
     });


     // Click event for LANGUAGE
     $(".gbnt-language").on("click", function(e) {
         e.preventDefault();

         // Update the URL object 
         _mainObject.language = $(".gbnt-language").html();
         var str = JSON.stringify(_mainObject);
         location.hash = encodeURIComponent(str);

         location.reload();
     });

     // Click event for EXIBITHION
     $(".gbnt-exibithion").on("click", function(e) {
         e.preventDefault();

         // Update the URL object 
         _mainObject.project_id = null;
         _mainObject.project_id = null;
         var str = JSON.stringify(_mainObject);
         location.hash = encodeURIComponent(str);
         location.reload();
     });


     // Click event to open TAB author
     $(".proj-profile .btn-author").on("click", function(e) {
         e.preventDefault();
         $(this).siblings(".btn-project").toggleClass("btn-selected");
         $(this).toggleClass("btn-selected");
         $(this).parent().siblings(".tab-project").toggle();
         $(this).parent().siblings(".tab-author").toggle();
     });


     // Click event to open TAB project
     $(".proj-profile .btn-project").on("click", function(e) {
         e.preventDefault();
         $(this).siblings(".btn-author").toggleClass("btn-selected");
         $(this).toggleClass("btn-selected");
         $(this).parent().siblings(".tab-project").toggle();
         $(this).parent().siblings(".tab-author").toggle();
     });


     // Click event for ABOUT link
     $("#gbnt-header .gbnt-about").on("click", function(e) {
         e.preventDefault();

         // If the header is expaneded and we coming from a different menu
         // then do this
         if ($("#gbnt-header").attr("data-gbnt-open") === "true" &&
             $(".tours").hasClass("hide-me") === false) {
             $(".about-text").toggleClass("hide-me");
             $(".tours").toggleClass("hide-me");
         } else {
             // otherwise expand/close menu normaly
             $(".gbnt-about").addClass("no-pointers");
             $(".close-header").toggleClass("hide-me");

             if ($("#gbnt-header").attr("data-gbnt-open") === "false") {
                 $("#gbnt-header").attr("data-gbnt-open", "true");
                 $(".about-text").toggleClass("hide-me");
                 openHeader("gbnt-about", false);
             } else {
                 $("#gbnt-header").attr("data-gbnt-open", "false");
                 $(".about-text").toggleClass("hide-me");
                 closeHeader("gbnt-about", false);
             }
         }
     });


     // Click event for TOURS link
     $("#gbnt-header .gbnt-tour").on("click", function(e) {
         e.preventDefault();

         // If the header is expaneded and we coming from a different menu
         // then do this
         if ($("#gbnt-header").attr("data-gbnt-open") === "true" &&
             $(".about-text").hasClass("hide-me") === false) {
             $(".about-text").toggleClass("hide-me");
             $(".tours").toggleClass("hide-me");
         } else {
             // otherwise expand/close menu normaly
             $(".gbnt-tour").addClass("no-pointers");
             $(".close-header").toggleClass("hide-me");

             if ($("#gbnt-header").attr("data-gbnt-open") === "false") {
                 $("#gbnt-header").attr("data-gbnt-open", "true");
                 $(".tours").toggleClass("hide-me");
                 openHeader("gbnt-tour", false);
             } else {
                 $("#gbnt-header").attr("data-gbnt-open", "false");
                 $(".tours").toggleClass("hide-me");
                 closeHeader("gbnt-tour", false);
             }
         }
     });


     // Click event for BURGER icon
     $("#gbnt-header .toggle-menu").on("click", function(e) {
         e.preventDefault();
         if ($("#gbnt-header .toggle-menu i").hasClass('fa-bars')) {
             $("#gbnt-header .toggle-menu i").removeClass('fa-bars').addClass('fa-times');
             $("#gbnt-header .gbnt-tour").addClass('no-pointers');
             $("#gbnt-header .gbnt-about").addClass('no-pointers');
             openHeader(null, true);
             $("#gbnt-header .nav").show();
         } else {
             $("#gbnt-header .toggle-menu i").removeClass('fa-times').addClass('fa-bars');
             $("#gbnt-header .gbnt-tour").removeClass('no-pointers');
             $("#gbnt-header .gbnt-about").removeClass('no-pointers');
             $("#gbnt-header .nav").hide();
             closeHeader(null, true);
         }
     });

     // Click event for CLOSE header link
     $("#gbnt-header .close-header a").on("click", function(e) {
         e.preventDefault();

         $("#gbnt-header").attr("data-gbnt-open", "false");
         $(".tours").addClass("hide-me");
         $(".about-text").addClass("hide-me");
         $(".close-header").addClass("hide-me");

         closeHeader("gbnt-tour", false);
     });


     // Close project if ESC key is pressed
     $(document).keyup(function(e) {
         if (e.keyCode === 27) {
             $(".gbnt-item").each(function() {
                 if ($(this).attr("data-gbnt-checked") === "true") {
                     closeProject(this);
                     _packeryContainer.packery(); // do reflow
                     return;
                 }
             });
         }
     });
 }

 function openHeader(selectedMenuClass, isMobile) {
     var size = "400px";
     // var ease = "easeOutElastic";
     var ease = "swing";
     var dur = 200;

     if (isMobile) {
         size = "950px";
         ease = "swing";
         dur = 200;
     }

     $('#gbnt-header').animate({
         height: size
     }, {
         duration: dur,
         easing: ease,
         complete: function() {
             $("." + selectedMenuClass).removeClass("no-pointers");
         }
     });

     if (!isMobile) {
         $('#gbnt-container').animate({
             "margin-top": "320px"
         }, {
             duration: dur,
             easing: ease
         });
     }
 }


 function closeHeader(selectedMenuClass, isMobile) {
     // var ease = "easeOutElastic";
     var ease = "swing";
     var dur = 200;

     if (isMobile) {
         ease = "swing";
         dur = 200;
     }

     $('#gbnt-header').animate({
         height: "80px"
     }, {
         duration: dur,
         easing: ease,
         complete: function() {
             $("." + selectedMenuClass).removeClass("no-pointers");
         }
     });

     if (!isMobile) {
         $('#gbnt-container').animate({
             "margin-top": "0px"
         }, {
             duration: dur,
             easing: ease
         });
     }
 }

 function getUrlParameter(sParam) {
     var sPageURL = window.location.search.substring(1);
     var sURLVariables = sPageURL.split('&');
     for (var i = 0; i < sURLVariables.length; i++) {
         var sParameterName = sURLVariables[i].split('=');
         if (sParameterName[0] == sParam) {
             return sParameterName[1];
         }
     }
 }

 function openProject(gbntItem) {
     var mainWidth = $(gbntItem).width();

     // Set the flag to CHECKED
     $(gbntItem).attr("data-gbnt-checked", "true");

     // Store the original height (will be used when shrinking the project DIV)
     $(gbntItem).attr("data-gbnt-previous-height", $(gbntItem).height());

     // Remove pointer events from all item DIVs
     $(".gbnt-item").each(function() {
         $(this).addClass("no-pointers");
     });

     // Hide DIV cover image
     $(gbntItem).find(".proj-cover").hide();

     // Hide DIV project text
     $(gbntItem).find(".proj-text").hide();

     // Hide DIV project image
     $(gbntItem).find(".proj-img").hide();

     // Expand the project profile DIV
     $(gbntItem).addClass("selected-project");
     $(gbntItem).height(mainWidth * 4);
     $(gbntItem).find(".proj-profile").removeClass("hide-me");

     // Scroll to the open project
     if ($(document).width() < 768) {
         // For mobile scenarios
         _packeryContainer.packery('fit', gbntItem, 0, 0);
         $("html, body").animate({
             scrollTop: 0
         }, "slow");
     } else {
         // For desktop scenarios
         _packeryContainer.packery('fit', gbntItem);
         $('html, body').animate({
             scrollTop: $(gbntItem).position().top - 10
         }, 500);
     }

     // Update the URL object with the project ID
     _mainObject.project_id = parseInt($(gbntItem).attr("id").split("_")[1]);
     var str = JSON.stringify(_mainObject);
     location.hash = encodeURIComponent(str);
 }

 function closeProject(gbntItem) {
     // Set the flag to UNCHECKED
     $(gbntItem).attr("data-gbnt-checked", "false");

     // Restores the original height
     $(gbntItem).height($(gbntItem).attr("data-gbnt-previous-height"));

     // Show DIV project text
     $(gbntItem).find(".proj-text").show();

     // Show DIV project image
     $(gbntItem).find(".proj-img").show();

     // Hide DIV project profile
     $(gbntItem).find(".proj-profile").addClass("hide-me");

     // Remove class selected-project, for expanded project
     $(gbntItem).removeClass("selected-project");

     // Add pointer events back to ALL item DIVs
     $(".gbnt-item").each(function() {
         $(this).removeClass("no-pointers");
     });

     // Update the URL object, by removing the project ID
     _mainObject.project_id = null;
     var str = JSON.stringify(_mainObject);
     location.hash = encodeURIComponent(str);

 }

 function doMobileFlashing() {
     var screenSize = $(window).width();
     if (screenSize <= 768) {
         var arr = $("[id^=overlay]");
         arr.each(function() {
             var rnd = Math.floor((Math.random() * 35));
             rnd = rnd + "s";
             $(this).addClass("mobile-animation");
             $(this).css("-webkit-animation-delay", rnd);
             $(this).css("-moz-animation-delay", rnd);
             $(this).css("-o-animation-delay", rnd);
             $(this).css("animation-delay", rnd);
         });
     }
 }

 function createObject(projectID, coverID) {
     $.get("docs/projectos/" + projectID + "/sumario.json", function(singleProject) {
         singleProject.id = this.url.split("/")[2];
         singleProject.img = singleProject.imagens[Math.floor(Math.random() * singleProject.imagens.length)];
         singleProject.img_cover = coverID + ".jpg";
         // if (projectID === "1" || projectID === "2" || projectID === "3") {
         //     singleProject.img_cover = "img/covers/x.jpg";
         //     var data = JSON.stringify(singleProject);
         //     var url = "show_proj.html?data=" + encodeURIComponent(data);
         //     singleProject.www = url;
         // }
         singleProject.size_class = getSize();
         window._projectsList.push(singleProject);
         checkAllDone(singleProject.id);
     }).fail(function() {
         var tmpID = this.url.split("/")[1];
         checkAllDone(tmpID);
     });
 }

 function createHTML() {
     var data = {
         tour: _tourInformation,
         project: window._projectsList
     };
     $('#gbnt-container').append(window._template(data));
 }

 function getSize() {
     var rnd = Math.floor((Math.random() * 100) + 1);
     var boxSize = "gbnt-size-normal";

     if (rnd >= 0 && rnd < this._iv_normal) {
         boxSize = "gbnt-size-normal";
     }

     if (rnd >= this._iv_normal && rnd < this._iv_normal + this._iv_wide) {
         boxSize = "gbnt-size-wide";
     }

     if (rnd >= this._iv_normal + this._iv_wide && rnd <= this._iv_normal + this._iv_wide + this._iv_tall) {
         boxSize = "gbnt-size-tall";
     }

     return boxSize;
 }

 Handlebars.registerHelper('getID', function(str, projectID) {
     var val = str + projectID;
     return val;
 });

 Handlebars.registerHelper('getCoverImageURL', function(pictureID, sizeClass) {
     var url = "img/covers/";
     switch (sizeClass) {
         case "gbnt-size-wide":
             url += "wide/" + pictureID;
             break;
         case "gbnt-size-tall":
             url += "tall/" + pictureID;
             break;
         default:
             url += "normal/" + pictureID;
             break;
     }
     return url;
 });

 Handlebars.registerHelper('translateThis', function(id) {
     var text = doTranslation(id);
     return text;
 });

 function doTranslation(id) {
     if (_mainObject.language === "pt") {
         return translations[id][0];
     } else {
         return translations[id][1];
     }
 }

 function randomizeDIVs() {
     var cards = $(".gbnt-item");
     for (var i = 0; i < cards.length; i++) {
         var target = Math.floor(Math.random() * cards.length - 1) + 1;
         var target2 = Math.floor(Math.random() * cards.length - 1) + 1;
         cards.eq(target).before(cards.eq(target2));
     }

     $("#item_x").prependTo("#gbnt-container");
 }

 function initializePackery() {
     _packeryContainer.packery();

     if (_mainObject.project_id) {
         $(".gbnt-item").each(function() {
             var theId = $(this).attr("id").split("_")[1];
             if (_mainObject.project_id === parseInt(theId)) {
                 openProject(this);
                 return;
             }
         });
     }
 }
