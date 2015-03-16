var _iv_normal = 80; // random percent for NORMAL squares
var _iv_tall = 10; // random percent for TALL squares
var _iv_wide = 10; // random percent for WIDE squares
var _packeryContainer = $('.packery');

$(document).ready(function() {
    correctSizes();
    randomizeDIVs();
    createEventHandlers();
    initializePackery();
});

function initializePackery() {

    _packeryContainer.packery();

    // Expand square
    _packeryContainer.on('click', '.gbnt-item', function(event) {
        if ($(event.target).hasClass("close")) {
            return;
        }
        openProject(this);
        _packeryContainer.packery({
            "isResizeBound": true
        });
    });

    // Close square
    _packeryContainer.on('click', '.close', function(event) {
        closeProject($(this).parents(".gbnt-item"));
        _packeryContainer.packery(); // do reflow 
    });
}


function openProject(gbntItem) {
    var mainWidth = $(gbntItem).width();

    // Set the flag to CHECKED
    $(gbntItem).attr("data-gbnt-checked", "true");

    // Remove pointer events from all item DIVs
    $(".gbnt-item").each(function() {
        if (this !== gbntItem) {
            $(this).addClass("no-pointers");
        }
    });

    // Expand the project profile DIV
    $(gbntItem).addClass("expanded-project");
    $(gbntItem).height(mainWidth * 4);
    $(gbntItem).find(".close").removeClass("hide-me");

}

function closeProject(gbntItem) {
    // Set the flag to UNCHECKED
    $(gbntItem).attr("data-gbnt-checked", "false");
    $(gbntItem).find(".close").addClass("hide-me");

    // Remove class selected-project, for expanded project
    $(gbntItem).removeClass("expanded-project");

    // Add pointer events back to ALL item DIVs
    $(".gbnt-item").each(function() {
        $(this).removeClass("no-pointers");
    });
}


function createEventHandlers() {

    // Mouse hover for fadein/fadeout Project Cover
    $(".proj-cover").hover(function getIn() {
        if ($(this).parents(".gbnt-item").attr("data-gbnt-checked") === "true") {
            return;
        }
        $(this).fadeTo(100, 0.4);
    }, function getOut() {
        if ($(this).parents(".gbnt-item").attr("data-gbnt-checked") === "true") {
            return;
        }
        $(this).fadeTo(100, 1);
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

function randomizeDIVs() {
    var cards = $(".gbnt-item");
    for (var i = 0; i < cards.length; i++) {
        var target = Math.floor(Math.random() * cards.length - 1) + 1;
        var target2 = Math.floor(Math.random() * cards.length - 1) + 1;
        cards.eq(target).before(cards.eq(target2));
    }
}
