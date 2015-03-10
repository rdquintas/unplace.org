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
    // window.history.pushState("string", "Title", "/novaURL"); //isto vai ser util para alterar a URL
    prepareProjectData();
});


//Adjust the layout if user resizes window
$(window).resize(function() {

    location.reload();
});
$(document).resize(function() {
    alert("caralho");
});

function prepareProjectData() {
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
        correctSizes();
        randomizeDIVs();
        initializePackery();
        createEventHandlers();
        // doMobileFlashing();
    }

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

    //Mouse hover for Project Cover
    $(".proj-cover").hover(function getIn() {
        if ($(this).parents(".gbnt-item").attr("data-gbnt-checked") === "true") {
            return;
        }
        $(this).fadeTo(100, 0);
    }, function getOut() {
        if ($(this).parents(".gbnt-item").attr("data-gbnt-checked") === "true") {
            return;
        }
        $(this).fadeTo(100, 1);
    });

    //Mouse hover for Project Text
    // this only happens if data-gbnt-checked = true, meaning, we have alredy visited this proj
    $(".proj-text").hover(function getIn() {
        $(this).fadeTo(100, 1);
    }, function getOut() {
        $(this).fadeTo(100, 0);
    });

    //Click event to OPEN Project
    $(".gbnt-item").on("click", function() {

        //If event was triggered by a DIV other than gbnt-item, then get out of here
        if (event.srcElement.id !== "") {
            return;
        }

        //Set the flag to CHECKED
        $(this).attr("data-gbnt-checked", "true");

        //Remove pointer events from all item DIVs
        $(".gbnt-item").each(function() {
            $(this).addClass("no-pointers");
        });

        //Hide DIV cover image
        $(this).find(".proj-cover").hide();

        //Hide DIV project text
        $(this).find(".proj-text").hide();

        //Hide DIV project image
        $(this).find(".proj-img").hide();

        openProject(this);
    });

    //Click event to CLOSE Project
    $(".proj-profile .btn-close").on("click", function() {

        var gbntItemDiv = $(this).parents(".gbnt-item");

        //Set the flag to UNCHECKED
        $(gbntItemDiv).attr("data-gbnt-checked", "false");

        //Add pointer events back to ALL item DIVs
        $(".gbnt-item").each(function() {
            $(this).removeClass("no-pointers");
        });

        //Show DIV project text
        $(gbntItemDiv).find(".proj-text").show();

        //Show DIV project image
        $(gbntItemDiv).find(".proj-img").show();

        //Hide DIV project profile
        $(gbntItemDiv).find(".proj-profile").addClass("hide-me");

        //Remove class selected-project, for expanded project
        $(gbntItemDiv).removeClass("selected-project");

    });
}

function openProject(proj) {
    var mainWidth = $(proj).width();
    $(proj).addClass("selected-project");
    $(proj).height(mainWidth * 4);
    $(proj).find(".proj-profile").removeClass("hide-me");
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

    boxSize = "gbnt-size-normal";
    return boxSize;
}

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

function initializePackery() {

    // Remove preloader
    $('.preloader').addClass("hide-me");

    var projHeight;

    var $container = $('.packery').packery();

    $container.on('click', '[id^=item]', function(event) {

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
    });
}
