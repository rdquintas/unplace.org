function applyTranslations(){$(".gbnt-exibithion").text(doTranslation("exibithion")),$(".gbnt-tour").text(doTranslation("tour")),$(".gbnt-about").text(doTranslation("about")),$(".gbnt-language").text(doTranslation("language")),$(".about-text p").text(doTranslation("about_text")),$(".gbnt-language").html("pt"===_mainObject.language?"en":"pt")}function parseURLobject(){try{var a=location.hash.split("#")[1];a&&(a=decodeURIComponent(a),_mainObject=JSON.parse(a))}catch(b){console.log("url is clean")}}function prepareProjectData(){$.get("docs/projectos/lista_dos_projectos.txt",function(a){_projectsList=a.split(","),"1"===_mainObject.tour_id&&(_projectsList=tour1.split(","),_tourInformation=[{tour_title:"tour_title1",tour_description:"tour_description1"}]),"2"===_mainObject.tour_id&&(_projectsList=tour2.split(","),_tourInformation=[{tour_title:"tour_title2",tour_description:"tour_description2"}]),"3"===_mainObject.tour_id&&(_projectsList=tour3.split(","),_tourInformation=[{tour_title:"tour_title3",tour_description:"tour_description3"}]);for(var b=0,c=0;c<_projectsList.length;c++)b+=1,b>10&&(b=1),createObject(_projectsList[c],b)})}function checkAllDone(a){for(var b=!0,c=0;c<window._projectsList.length;c++)if(a===window._projectsList[c]){window._projectsList.splice(c,1);break}for(var d=0;d<window._projectsList.length;d++)if("string"==typeof window._projectsList[d]){b=!1;break}b&&(createHTML(),correctSizes(),randomizeDIVs(),initializePackery(),_mainObject.tour_id&&(openProject($("#item_x")),_packeryContainer.packery()),createEventHandlers(),checkAllImagesAreLoaded())}function checkAllImagesAreLoaded(){var a=$("img"),b=a.length-2,c=function(){b--,b||$(".preloader").addClass("hide-me")};$("img").each(function(){$(this).load(c).error(c)})}function correctSizes(){var a=$(".gbnt-item.gbnt-size-normal").width();$(".gbnt-size-normal").each(function(){$(this).height(a)}),$(".gbnt-size-wide").each(function(){$(this).height(a)}),$(".gbnt-size-tall").each(function(){$(this).height(2*a)})}function createEventHandlers(){$(".proj-cover").hover(function(){"true"===$(this).parents(".gbnt-item").attr("data-gbnt-checked")||$(this).parents(".gbnt-item").hasClass("no-pointers")||$(this).fadeTo(100,0)},function(){"true"!==$(this).parents(".gbnt-item").attr("data-gbnt-checked")&&$(this).fadeTo(100,1)}),$(".proj-text").hover(function(){$(this).parents("#item_x")||$(this).fadeTo(100,1)},function(){$(this).parents("#item_x")||$(this).fadeTo(100,0)}),$(".tours a").on("click",function(a){a.preventDefault(),_mainObject.tour_id=$(this).attr("href");var b=JSON.stringify(_mainObject);location.hash=encodeURIComponent(b),location.reload()}),$(".gbnt-item").on("click",function(a){"btn-view-proj"!==a.target.className&&(a.preventDefault(),$(this).hasClass("no-pointers")||"cover"===event.srcElement.id&&openProject(this))}),$(".proj-profile .btn-close").on("click",function(a){a.preventDefault();var b=$(this).parents(".gbnt-item");closeProject(b),_packeryContainer.packery()}),$(".gbnt-language").on("click",function(a){a.preventDefault(),_mainObject.language=$(".gbnt-language").html();var b=JSON.stringify(_mainObject);location.hash=encodeURIComponent(b),location.reload()}),$(".gbnt-exibithion").on("click",function(a){a.preventDefault(),_mainObject.project_id=null,_mainObject.tour_id=null;var b=JSON.stringify(_mainObject);location.hash=encodeURIComponent(b),location.reload()}),$(".proj-profile .btn-author").on("click",function(a){a.preventDefault(),$(this).siblings(".btn-project").toggleClass("btn-selected"),$(this).toggleClass("btn-selected"),$(this).parent().siblings(".tab-project").toggle(),$(this).parent().siblings(".tab-author").toggle()}),$(".proj-profile .btn-project").on("click",function(a){a.preventDefault(),$(this).siblings(".btn-author").toggleClass("btn-selected"),$(this).toggleClass("btn-selected"),$(this).parent().siblings(".tab-project").toggle(),$(this).parent().siblings(".tab-author").toggle()}),$("#gbnt-header .gbnt-about").on("click",function(a){a.preventDefault(),"true"===$("#gbnt-header").attr("data-gbnt-open")&&$(".tours").hasClass("hide-me")===!1?($(".about-text").toggleClass("hide-me"),$(".tours").toggleClass("hide-me")):($(".gbnt-about").addClass("no-pointers"),$(".close-header").toggleClass("hide-me"),"false"===$("#gbnt-header").attr("data-gbnt-open")?($("#gbnt-header").attr("data-gbnt-open","true"),$(".about-text").toggleClass("hide-me"),openHeader("gbnt-about",!1)):($("#gbnt-header").attr("data-gbnt-open","false"),$(".about-text").toggleClass("hide-me"),closeHeader("gbnt-about",!1)))}),$("#gbnt-header .gbnt-tour").on("click",function(a){a.preventDefault(),"true"===$("#gbnt-header").attr("data-gbnt-open")&&$(".about-text").hasClass("hide-me")===!1?($(".about-text").toggleClass("hide-me"),$(".tours").toggleClass("hide-me")):($(".gbnt-tour").addClass("no-pointers"),$(".close-header").toggleClass("hide-me"),"false"===$("#gbnt-header").attr("data-gbnt-open")?($("#gbnt-header").attr("data-gbnt-open","true"),$(".tours").toggleClass("hide-me"),openHeader("gbnt-tour",!1)):($("#gbnt-header").attr("data-gbnt-open","false"),$(".tours").toggleClass("hide-me"),closeHeader("gbnt-tour",!1)))}),$("#gbnt-header .toggle-menu").on("click",function(a){a.preventDefault(),$("#gbnt-header .toggle-menu i").hasClass("fa-bars")?($("#gbnt-header .toggle-menu i").removeClass("fa-bars").addClass("fa-times"),$("#gbnt-header .gbnt-tour").addClass("no-pointers"),$("#gbnt-header .gbnt-about").addClass("no-pointers"),openHeader(null,!0),$("#gbnt-header .nav").show()):($("#gbnt-header .toggle-menu i").removeClass("fa-times").addClass("fa-bars"),$("#gbnt-header .gbnt-tour").removeClass("no-pointers"),$("#gbnt-header .gbnt-about").removeClass("no-pointers"),$("#gbnt-header .nav").hide(),closeHeader(null,!0))}),$("#gbnt-header .close-header a").on("click",function(a){a.preventDefault(),$("#gbnt-header").attr("data-gbnt-open","false"),$(".tours").addClass("hide-me"),$(".about-text").addClass("hide-me"),$(".close-header").addClass("hide-me"),closeHeader("gbnt-tour",!1)}),$(document).keyup(function(a){27===a.keyCode&&$(".gbnt-item").each(function(){return"true"===$(this).attr("data-gbnt-checked")?(closeProject(this),void _packeryContainer.packery()):void 0})})}function openHeader(a,b){var c="400px",d="swing",e=200;b&&(c="950px",d="swing",e=200),$("#gbnt-header").animate({height:c},{duration:e,easing:d,complete:function(){$("."+a).removeClass("no-pointers")}}),b||$("#gbnt-container").animate({"margin-top":"320px"},{duration:e,easing:d})}function closeHeader(a,b){var c="swing",d=200;b&&(c="swing",d=200),$("#gbnt-header").animate({height:"80px"},{duration:d,easing:c,complete:function(){$("."+a).removeClass("no-pointers")}}),b||$("#gbnt-container").animate({"margin-top":"0px"},{duration:d,easing:c})}function getUrlParameter(a){for(var b=window.location.search.substring(1),c=b.split("&"),d=0;d<c.length;d++){var e=c[d].split("=");if(e[0]==a)return e[1]}}function openProject(a){$(a).width();$(a).attr("data-gbnt-checked","true"),$(a).attr("data-gbnt-previous-height",$(a).height()),$(".gbnt-item").each(function(){$(this).addClass("no-pointers")}),$(a).find(".proj-cover").hide(),$(a).find(".proj-text").hide(),$(a).find(".proj-img").hide(),$(a).addClass("selected-project"),$(a).find(".proj-profile").removeClass("hide-me"),$(a).find(".tab-author").removeClass("hide-me");var b;b=$(a).find(".tab-author").height()>$(a).find(".tab-project").height()?$(a).find(".tab-author").height():$(a).find(".tab-project").height(),$(a).height(b+150),$(a).find(".tab-author").addClass("hide-me"),$(document).width()<768?(_packeryContainer.packery("fit",a,0,0),$("html, body").animate({scrollTop:0},"slow")):(_packeryContainer.packery("fit",a),$("html, body").animate({scrollTop:$(a).position().top-10},500)),_mainObject.project_id=parseInt($(a).attr("id").split("_")[1]);var c=JSON.stringify(_mainObject);location.hash=encodeURIComponent(c)}function closeProject(a){$(a).attr("data-gbnt-checked","false"),$(a).height($(a).attr("data-gbnt-previous-height")),$(a).find(".proj-text").show(),$(a).find(".proj-img").show(),$(a).find(".proj-profile").addClass("hide-me"),$(a).removeClass("selected-project"),$(".gbnt-item").each(function(){$(this).removeClass("no-pointers")}),_mainObject.project_id=null;var b=JSON.stringify(_mainObject);location.hash=encodeURIComponent(b)}function doMobileFlashing(){var a=$(window).width();if(768>=a){var b=$("[id^=overlay]");b.each(function(){var a=Math.floor(35*Math.random());a+="s",$(this).addClass("mobile-animation"),$(this).css("-webkit-animation-delay",a),$(this).css("-moz-animation-delay",a),$(this).css("-o-animation-delay",a),$(this).css("animation-delay",a)})}}function createObject(a,b){$.get("docs/projectos/"+a+"/sumario.json",function(c){if(c.id=this.url.split("/")[2],c.img=c.imagens[Math.floor(Math.random()*c.imagens.length)],c.img_cover=b+".jpg","1"===a||"2"===a||"3"===a){var d=JSON.stringify(c),e="show_proj.html?data="+encodeURIComponent(d);c.www=e}c.size_class=getSize(),window._projectsList.push(c),checkAllDone(c.id)}).fail(function(){var a=this.url.split("/")[1];checkAllDone(a)})}function createHTML(){var a={tour:_tourInformation,project:window._projectsList};$("#gbnt-container").append(window._template(a))}function getSize(){var a=Math.floor(100*Math.random()+1),b="gbnt-size-normal";return a>=0&&a<this._iv_normal&&(b="gbnt-size-normal"),a>=this._iv_normal&&a<this._iv_normal+this._iv_wide&&(b="gbnt-size-wide"),a>=this._iv_normal+this._iv_wide&&a<=this._iv_normal+this._iv_wide+this._iv_tall&&(b="gbnt-size-tall"),b}function doTranslation(a){return"pt"===_mainObject.language?translations[a][0]:translations[a][1]}function randomizeDIVs(){for(var a=$(".gbnt-item"),b=0;b<a.length;b++){var c=Math.floor(Math.random()*a.length-1)+1,d=Math.floor(Math.random()*a.length-1)+1;a.eq(c).before(a.eq(d))}$("#item_x").prependTo("#gbnt-container")}function initializePackery(){_packeryContainer.packery(),_mainObject.project_id&&$(".gbnt-item").each(function(){var a=$(this).attr("id").split("_")[1];return _mainObject.project_id===parseInt(a)?void openProject(this):void 0})}var translations={exibithion:["exibição","exibithion"],language:["en","pt"],tour:["visitas temáticas","thematic tours"],tour_title1:["Geografias do espaço público","EN Geografias do espaço público"],tour_description1:["PT Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum maiores asperiores vero eius, quasi magnam, iusto ab quo, magni, reiciendis dignissimos culpa pariatur optio dolor nesciunt distinctio","EN Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum maiores asperiores vero eius, quasi magnam, iusto ab quo, magni, reiciendis dignissimos culpa pariatur optio dolor nesciunt distinctio"],tour_title2:["Poder e controlo","EN Poder e controlo"],tour_description2:["PT Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum maiores asperiores vero eius, quasi magnam, iusto ab quo, magni, reiciendis dignissimos culpa pariatur optio dolor nesciunt distinctio","EN Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum maiores asperiores vero eius, quasi magnam, iusto ab quo, magni, reiciendis dignissimos culpa pariatur optio dolor nesciunt distinctio"],tour_title3:["Indentidade(s) em processo","EN Indentidade(s) em processo"],tour_description3:["PT Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum maiores asperiores vero eius, quasi magnam, iusto ab quo, magni, reiciendis dignissimos culpa pariatur optio dolor nesciunt distinctio","EN Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum maiores asperiores vero eius, quasi magnam, iusto ab quo, magni, reiciendis dignissimos culpa pariatur optio dolor nesciunt distinctio"],about:["about","about"],about_text:["ABOUT PT - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum maiores asperiores vero eius, quasi magnam, iusto ab quo, magni, reiciendis dignissimos culpa pariatur optio dolor nesciunt distinctio nulla fugit minus officia adipisci numquam! Minus, quam voluptates eos dolorum eius cupiditate saepe temporibus nihil repudiandae, at consectetur quae in itaque, eum voluptas officiis, numquam deleniti error. Consequuntur sunt commodi, temporibus suscipit. Earum voluptatem, nesciunt ipsam dolore perferendis eligendi! Ipsum explicabo adipisci ab quam iure voluptate, nam illum quia suscipit atque blanditiis quod, sint aliquam autem possimus reprehenderit fugiat voluptatibus delectus officiis! Blanditiis ea cupiditate provident et quisquam, iste quibusdam beatae! Impedit!","ABOUT EN - Perspiciatis veniam cum esse nisi dolorum rerum repellendus. Debitis obcaecati enim at magnam quisquam impedit recusandae iusto, itaque autem quos. Suscipit tenetur deserunt atque unde expedita delectus amet nihil facilis, magnam, voluptate perferendis? Iure asperiores, hic rem consequatur harum, maiores sit expedita saepe odio perferendis corporis minima laboriosam reiciendis sunt! Doloribus impedit quasi minima, id pariatur ipsam, quam culpa dignissimos, necessitatibus dolor officia labore placeat rerum. Dignissimos esse dolore, quaerat ullam enim assumenda ut provident, sunt, vero temporibus accusamus dolorem fugiat ipsa harum perferendis maxime maiores. A voluptatem in consectetur error quidem, corporis totam voluptates quaerat possimus officiis cupiditate quam alias"],author:["autor","author"],project_description:["descrição  do projecto","project description"],view_project:["ver projecto","view project"],year:["ano","year"],ficha_tecnica:["ficha técnica","technical spec"]},_iv_normal=80,_iv_tall=10,_iv_wide=10,_source=$("#gbnt-template").html(),_template=Handlebars.compile(_source),_packeryContainer=$(".packery"),_mainObject={language:"pt",project_id:null,tour_id:null},tour1="1,4,8,12,16,20,24,28,32,36",tour2="6,13,17,25,29,33,37",tour3="26,30,34,38",_tourInformation=null;$(document).ready(function(){$(".slick-cena").slick(),parseURLobject(),prepareProjectData(),applyTranslations()}),$(window).resize(function(){}),Handlebars.registerHelper("getID",function(a,b){var c=a+b;return c}),Handlebars.registerHelper("getCoverImageURL",function(a,b){var c="img/covers/";switch(b){case"gbnt-size-wide":c+="wide/"+a;break;case"gbnt-size-tall":c+="tall/"+a;break;default:c+="normal/"+a}return c}),Handlebars.registerHelper("translateThis",function(a){var b=doTranslation(a);return b});