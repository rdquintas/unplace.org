var _iv_normal = 80; // random percent for NORMAL squares
var _iv_tall = 10; // random percent for TALL squares
var _iv_wide = 10; // random percent for WIDE squares

// Handlebar precompiling
var _source = $("#gbnt-template").html();
var _template = Handlebars.compile(_source);

// Packery global var
var _packeryContainer = $('.packery');
// var _pckry;

var _routingProj = null;

// var _currentOpenDiv = null;
// var _isGuidedTour = false;
// var _arrTour;

$(document).ready(function() {
    initializeRouting();
    prepareProjectData();
});


// Adjust the layout (by refreshing the page) if user resizes window
$(window).resize(function() {
    location.reload();
});

function initializeRouting() {
    Path.map("#project/:id").to(function() {
        _routingProj = this.params.id;
    });

    Path.listen();
}

function prepareProjectData() {
    $.get("docs/projectos/lista_dos_projectos.txt", function(data) {
        _projectsList = data.split(",");
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

    // Mouse hover for fadein/fadeout Project Cover
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

    // Mouse hover for fadein/fadeout Project Text
    // this only happens if data-gbnt-checked = true, meaning, we have alredy visited this proj
    $(".proj-text").hover(function getIn() {
        $(this).fadeTo(100, 1);
    }, function getOut() {
        $(this).fadeTo(100, 0);
    });

    // Click event to OPEN Project
    $(".gbnt-item").on("click", function(e) {
        //If event was triggered by a DIV other than gbnt-item, then get out of here
        e.preventDefault();
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

function openProject(gbntItem) {
    var mainWidth = $(gbntItem).width();

    // Set the flag to CHECKED
    $(gbntItem).attr("data-gbnt-checked", "true");

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

    // Update the URL with the project ID
    window.history.pushState("string", null, "#project/" + $(gbntItem).attr("id").split("_")[1]);
}

function closeProject(gbntItem) {
    // Set the flag to UNCHECKED
    $(gbntItem).attr("data-gbnt-checked", "false");

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

    // Update the URL, by removing the project ID
    window.history.pushState("string", null, "#");
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

    // boxSize = "gbnt-size-normal";
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

    _packeryContainer.packery();

    if (_routingProj) {
        $(".gbnt-item").each(function() {
            var theId = $(this).attr("id").split("_")[1];
            if (_routingProj === theId) {
                _routingProj = null;
                openProject(this);
                return;
            }
        });
    }

    // Reflow packery when clicked
    _packeryContainer.on('click', '[id^=item]', function(event) {
        _packeryContainer.packery();
    });

    // var container = document.querySelector('.packery');

    // imagesLoaded(_packeryContainer, function() {
    //     window._pckry = new Packery(_packeryContainer, {
    //         itemSelector: '.gbnt-item'
    //     });
    // });
}
