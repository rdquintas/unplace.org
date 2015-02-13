var _iv_normal = 80; // random percent for NORMAL squares
var _iv_tall = 10; // random percent for TALL squares
var _iv_wide = 10; // random percent for WIDE squares

// Handlebar precompiling
var _source = $("#gbnt-template").html();
var _template = Handlebars.compile(_source);
var _pckry;
var _currentOpenDiv = null;

var _isGuidedTour = false;
var _arrTour;

$(document).ready(function() {
    prepareData();
});

$("[id^=guided-tour]").on("click", function(e) {
    e.preventDefault();
    $(this).addClass('active');

    if (this.id === "guided-tour-1") {
        window._arrTour = [1, 10, 30, 7, 27];
    }

    if (this.id === "guided-tour-2") {
        window._arrTour = [3, 6, 22, 5, 14, 13, 12, 8];
    }

    if (this.id === "guided-tour-3") {
        window._arrTour = [2, 25, 26, 27, 28, 29];
    }

    doGuidedTour(true);
});

function doGuidedTour(firstTimeRunningThis) {
    if (firstTimeRunningThis) {
        // We are STARTING our guided tour
        window._isGuidedTour = true;
        var projs = $("label");

        projs.each(function methodName() {
            var currentID = parseInt(this.id.split("_")[1]);

            if (currentID !== window._arrTour[0]) {
                $(this).addClass('blocked-project');
            } else {
                var $target = $("#box_" + window._arrTour[0]);

                console.log("anima: " + $target.offset().top);

                $('html, body').animate({
                    scrollTop: $target.position().top - 100
                }, 500);
            }
        });

        window._arrTour[0] = null;
    } else {
        // We are CONTINUING our guided tour
        for (var i = 0; i < window._arrTour.length; i++) {
            if (window._arrTour[i]) {

                var nextProj = $("#box_" + window._arrTour[i]);

                nextProj.removeClass("blocked-project");

                console.log("anima 2: " + nextProj.offset().top);

                $('html, body').animate({
                    scrollTop: nextProj.position().top - 100
                }, 500);

                window._arrTour[i] = null;
                break;
            }

        }
    }
}

function prepareData() {
    $.get("projectos/lista_dos_projectos.txt", function(data) {
        _projectsList = data.split(",");
        var counter = 0;
        for (var i = 0; i < _projectsList.length; i++) {
            counter += 1;
            if (counter > 36) {
                counter = 1;
            }
            createObject(_projectsList[i], counter);
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
        randomizeDIVs();
        initializePackery();
        doMbileFlashing();
    }

}

function doMbileFlashing() {
    var screeSize = $(window).width();
    if (screeSize <= 768) {
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
    $.get("projectos/" + projectID + "/sumario.json", function(singleProject) {
        singleProject.id = this.url.split("/")[1];
        singleProject.img = singleProject.imagens[Math.floor(Math.random() * singleProject.imagens.length)];
        singleProject.img_cover = "img/covers/" + coverID + ".jpg";
        if (projectID === "1" || projectID === "2" || projectID === "3") {
            singleProject.img_cover = "img/covers/x.jpg";
            var data = JSON.stringify(singleProject);
            var url = "show_proj.html?data=" + encodeURIComponent(data);
            singleProject.www = url;
        }
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

Handlebars.registerHelper('getCoverImage', function(img) {
    var str = "background-image: url(" + img + ");";
    return str;
});

Handlebars.registerHelper('getID', function(str, projectID) {
    var val = str + projectID;
    return val;
});

function randomizeDIVs() {
    var cards = $(".gbnt-item");
    for (var i = 0; i < cards.length; i++) {
        var target = Math.floor(Math.random() * cards.length - 1) + 1;
        var target2 = Math.floor(Math.random() * cards.length - 1) + 1;
        cards.eq(target).before(cards.eq(target2));
    }
}

function centerMainContainer() {
    var calc = Math.abs(window._pckry.maxX - $(window).width());
    calc = Math.floor(calc / 2);
    $('#gbnt-container').css("margin-left", calc);
}

function initializePackery() {

    // Remove preloader
    $('.preloader').addClass("gbnt-hide");

    var projHeight;

    var $container = $('.packery').packery();

    $container.on('click', '[id^=box]', function(event) {

        var selectedID = event.currentTarget.id.split("_")[1];

        if (event.target.id === "btn-project" || event.target.id === "btn-author") {
            $("#desc_box_" + selectedID + " #btn-project").toggleClass("btn-selected");
            $("#desc_box_" + selectedID + " #btn-author").toggleClass("btn-selected");
            $("#desc_box_" + selectedID + " #project").toggleClass("gbnt-hide");
            $("#desc_box_" + selectedID + " #author").toggleClass("gbnt-hide");
            event.preventDefault();
            return;
        }

        if (event.target.id === "btn-www" && $(this).hasClass("gbnt-size-selected")) {
            return;
        }

        //if this was the view-project link event, then we get out of here
        if (event.target.id !== "btn-close" && $(this).hasClass("gbnt-size-selected")) {
            event.preventDefault();
            return;
        }

        if (window._currentOpenDiv) {
            if (window._currentOpenDiv === event.currentTarget.id) {
                window._currentOpenDiv = null;
            } else {
                return;
            }
        } else {
            window._currentOpenDiv = event.currentTarget.id;
        }

        var $target = $(event.currentTarget);

        //if the div checkbox is UNCHECKED (meaning the project has not been visited yet)
        //then we have to change the background img        
        if (!$("#checkbox_" + selectedID).attr("checked")) {
            var arr = $(this).attr("style").split(";");
            var newImg = $(this).attr("data-gbnt-img");
            regEx = new RegExp("background-image: ", "i");
            for (var i = 0; i < arr.length; i++) {
                if (regEx.test(arr[i])) {
                    arr[i] = "background-image: url(projectos/" + selectedID + "/" + newImg + ");";
                }
            }
            $(this).attr("style", arr.join(";"));
        }

        //this is to guarantee that, once checked, the checkbox is always set to TRUE,
        //thus marking this img has visited.
        $("#checkbox_" + selectedID).attr("checked", true);

        var isGigante = $target.hasClass('gbnt-size-selected');
        $target.toggleClass('gbnt-size-selected');

        // faz enable/disable de todos os outros divs
        $('.gbnt-disabled').toggleClass('gbnt-hide');
        $('[id^=overlay]').toggleClass('gbnt-hide');

        // mas o nosso div tem que estar enabled
        $('#box_' + selectedID + ' .gbnt-disabled').toggleClass('gbnt-hide');
        $('#overlay_' + selectedID).toggleClass('gbnt-hide');

        // expande ou encolhe o div com a ficha do projecto        
        $('#box_' + selectedID).toggleClass('gbnt-no-bckgr-img');
        $('#overlay_' + selectedID).toggleClass('gbnt-hide');
        $('#desc_box_' + selectedID).toggleClass('gbnt-hide');

        // faz o reflow do packery
        if (isGigante) {
            // then we are closing the box, so we just do layout reflow
            $container.packery();
            if (window._isGuidedTour) {
                doGuidedTour(false);
            }
        } else {
            $('html, body').animate({
                scrollTop: $target.position().top - 10
            }, 500);
            $container.packery({}, 'fit', event.currentTarget, 0, 0);
        }
    });

    var container = document.querySelector('.packery');


    imagesLoaded(container, function() {
        window._pckry = new Packery(container, {
            itemSelector: '.gbnt-item'
        });
        window._pckry.on('layoutComplete', function(pckryInstance, laidOutItems) {
            centerMainContainer();
        });
        centerMainContainer();
    });
}
