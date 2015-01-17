var _iv_normal = 85; // random percent for NORMAL squares
var _iv_tall = 10; // random percent for TALL squares
var _iv_wide = 5; // random percent for WIDE squares

var _projectsList = [];

// Create a deferred object
var _dfd = $.Deferred();
_dfd.done(createHTML);

docReady(function() {
    // readInputValues();
    prepareData();


});

function prepareData() {
    $.get("projectos/lista_dos_projectos.txt", function(data) {
        _projectsList = data.split(",");
        for (var i = 0; i < _projectsList.length; i++) {
            createObject(_projectsList[i]);
        }
    });
}

function checkAllDone(projID) {
    var doResolve = true;
    for (var i = 0; i < window._projectsList.length; i++) {
        if (projID === window._projectsList[i]) {
            window._projectsList[i] = null;
            break;
        }
    }

    for (var ii = 0; ii < window._projectsList.length; ii++) {
        if (!isNaN(window._projectsList[ii]) && typeof window._projectsList[ii] !== "object") {
            doResolve = false;
            break;
        }
    }

    if (doResolve) {
        // Let's party
        window._dfd.resolve();
    }

}

function createObject(projectID) {
    $.get("projectos/" + projectID, {}, function(data) {
        $.get("projectos/" + projectID + "/sumario.json", function(sumario) {
            sumario.id = this.url.split("/")[1];
            sumario.img = sumario.imagens[Math.floor(Math.random() * sumario.imagens.length)];
            window._projectsList.push(sumario);
            checkAllDone(sumario.id);
        }).fail(function() {
            var tmpID = this.url.split("/")[1];
            checkAllDone(tmpID);
        });
    }).fail(function() {
        var tmpID = this.url.split("/")[1];
        checkAllDone(tmpID);
    });
}

function createHTML() {
    createTheDivs();
    randomizeDIVs();
    initializePackery();
}

function createTheDivs() {
    var mainContainer = $("#mainContainer");

    var rnd = Math.floor((Math.random() * 100) + 1);
    var boxSize = "size-normal";

    for (var i = 0; i < window._projectsList.length; i++) {
        if (window._projectsList[i]) {

            rnd = Math.floor((Math.random() * 100) + 1);

            if (rnd >= 0 && rnd < this._iv_normal) {
                boxSize = "size-normal";
            }

            if (rnd >= this._iv_normal && rnd < this._iv_normal + this._iv_wide) {
                boxSize = "size-wide";
            }

            if (rnd >= this._iv_normal + this._iv_wide && rnd <= this._iv_normal + this._iv_wide + this._iv_tall) {
                boxSize = "size-tall";
            }
            mainContainer.append(singleDiv(boxSize, window._projectsList[i]));
        }
    }
}

function singleDiv(cssClass, obj) {

    var divBox = $("<div/>", {
        id: "box_" + obj.id,
        class: "item " + cssClass
    });


    // $(divBox).click({
    //     obj: obj,
    //     currentClass: cssClass
    // }, function(e) {
    //     // $(this).removeClass(e.data.currentClass);
    //     $(this).toggleClass("size-selected");
    // });

    var imgURL = "url(projectos/" + obj.id + "/" + obj.img + ")";
    divBox.css("background", imgURL);

    var overlay = $("<div/>", {
        id: "overlay",
        class: cssClass
    });

    var a = $("<a/>", {
        href: "#",
        class: "textbox"
    });

    var p1 = $("<p/>", {
        text: obj.titulo,
        class: "titulo"
    });

    var p2 = $("<p/>", {
        text: obj.autor,
        class: "autor"
    });

    a.append(p1).append(p2);
    overlay.append(a);
    divBox.append(overlay);

    return divBox;
}

function randomizeDIVs() {
    var cards = $(".item");
    for (var i = 0; i < cards.length; i++) {
        var target = Math.floor(Math.random() * cards.length - 1) + 1;
        var target2 = Math.floor(Math.random() * cards.length - 1) + 1;
        cards.eq(target).before(cards.eq(target2));
    }
}

function initializePackery() {

    var $container = $('.packery').packery();

    $container.on('click', '[id^=box]', function(event) {
        var $target = $(event.currentTarget)
        var isGigante = $target.hasClass('size-selected');
        $target.toggleClass('size-selected');

        if (isGigante) {
            // if shrinking, just layout
            $container.packery({
                gutter: 10
            });
        } else {
            $container.packery({
                gutter: 10
            }, 'fit', event.currentTarget, 0, 0);
        }
    });


    var container = document.querySelector('.packery');
    var pckry;



    imagesLoaded(container, function() {
        pckry = new Packery(container, {
            itemSelector: '.item',
            gutter: 10
        });
    });
}
