var _iv_normal = 80; // random percent for NORMAL squares
var _iv_tall = 10; // random percent for TALL squares
var _iv_wide = 10; // random percent for WIDE squares

var _slideArray = [{
    image: "slide01.jpg"
}, {
    image: "slide02.jpg"
}, {
    video: "123123132"
}, {
    image: "slide03.jpg"
}, ];
var _currentSlide = 0;
var _projectsList = [];
var _currentOpenDiv = null;

// Create a deferred object
var _dfd = $.Deferred();
_dfd.done(createHTML);

docReady(function() {
    // readInputValues();
    prepareData();

    $('.gbnt-language').on("click", function() {
        $('.ui.modal').modal('show');
    });

    $('#btn-prev').on("click", function() {

        window._currentSlide -= 1;
        if (window._currentSlide < 0) {
            window._currentSlide = window._slideArray.length - 1;
        }

        $.each(window._slideArray[window._currentSlide], function(key, element) {
            var slide = $('#gbnt-slide');
            slide.empty();

            if (key === "image") {
                var img = $("<img/>", {
                    class: "ui big rounded image centered",
                    src: "img/slides/" + element
                }).appendTo(slide);
            } else {
                var vid = $("<iframe/>", {
                    class: "ui centered",
                    width: "854",
                    height: "510",
                    src: "//www.youtube.com/embed/uDuzy-t7GDA",
                    frameborder: "0"
                }).appendTo(slide);
                // var vid = $("<div/>", {
                //     id: "gbnt-video",
                //     class: "ui video centered",
                //     "data-source": "youtube",
                //     "data-id": "uDuzy-t7GDA",
                //     "data-image": "/img/slides/slide04.jpg"
                // }).appendTo(slide);

                // vid.video();
            }
        });


    });

    $('#btn-next').on("click", function() {

        window._currentSlide += 1;
        if (window._currentSlide >= window._slideArray.length) {
            window._currentSlide = 0;
        }

        $.each(window._slideArray[window._currentSlide], function(key, element) {
            var slide = $('#gbnt-slide');
            slide.empty();

            if (key === "image") {
                var img = $("<img/>", {
                    class: "ui big rounded image centered",
                    src: "img/slides/" + element
                }).appendTo(slide);
            } else {
                var vid = $("<iframe/>", {
                    class: "ui centered",
                    width: "854",
                    height: "510",
                    src: "//www.youtube.com/embed/uDuzy-t7GDA",
                    frameborder: "0"
                }).appendTo(slide);



                // var vid = $("<div/>", {
                //     class: "ui video centered",
                //     "data-source": "youtube",
                //     "data-id": "uDuzy-t7GDA",
                //     "data-image": "/img/slides/slide04.jpg"
                // }).appendTo(slide);

                // vid.video();

            }
        });

    });

    // var slide = $('#gbnt-slide');
    //          slide.empty();
    //          window._currentSlide = 0;

    //          var img = $("<img/>", {
    //              class: "ui medium rounded image centered",
    //              src: "img/slides/" + window._slideArray[window._currentSlide].image
    //          }).appendTo(slide);


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
    $.get("projectos/" + projectID + "/sumario.json", function(sumario) {
        sumario.id = this.url.split("/")[1];
        sumario.img = sumario.imagens[Math.floor(Math.random() * sumario.imagens.length)];
        window._projectsList.push(sumario);
        checkAllDone(sumario.id);
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
    var boxSize = "gbnt-size-normal";

    for (var i = 0; i < window._projectsList.length; i++) {
        if (window._projectsList[i]) {

            rnd = Math.floor((Math.random() * 100) + 1);

            if (rnd >= 0 && rnd < this._iv_normal) {
                boxSize = "gbnt-size-normal";
            }

            if (rnd >= this._iv_normal && rnd < this._iv_normal + this._iv_wide) {
                boxSize = "gbnt-size-wide";
            }

            if (rnd >= this._iv_normal + this._iv_wide && rnd <= this._iv_normal + this._iv_wide + this._iv_tall) {
                boxSize = "gbnt-size-tall";
            }
            mainContainer.append(singleDiv(boxSize, window._projectsList[i]));
        }
    }
}

function singleDiv(cssClass, obj) {

    var divBox = $("<div/>", {
        id: "box_" + obj.id,
        class: "gbnt-item " + cssClass
    });

    var imgURL = "url(projectos/" + obj.id + "/" + obj.img + ")";
    divBox.css("background", imgURL);

    var disabled = $("<div/>", {
        class: "gbnt-disabled gbnt-hide"
    }).appendTo(divBox);

    var overlay = $("<div/>", {
        id: "overlay_" + obj.id,
        class: cssClass
    }).appendTo(divBox);

    var a = $("<a/>", {
        href: "#",
        class: "textbox"
    }).appendTo(overlay);

    var p1 = $("<p/>", {
        text: obj.titulo,
        class: "titulo"
    }).appendTo(a);

    var p2 = $("<p/>", {
        text: obj.autor,
        class: "autor"
    }).appendTo(a);

    var hiddenDivForProjDescription = createProjectDescriptionDiv(obj);
    divBox.append(hiddenDivForProjDescription);
    return divBox;
}


function createProjectDescriptionDiv(obj) {
    var hiddenDiv = $("<div/>", {
        id: "desc_box_" + obj.id,
        class: "gbnt-hide",
    });

    var segment = $("<div/>", {
        class: "ui segment",
    }).appendTo(hiddenDiv);

    var btnProject = $("<div/>", {
        id: "btn-project",
        class: "ui black button gbnt-btn",
        text: "Project Description"
    }).appendTo(segment);

    btnProject.on('click', {
        projID: obj.id
    }, function(event) {
        console.log("cenaita");
        $(this).toggleClass("basic");
        $(this).toggleClass("black");
        $("#desc_box_" + arguments[0].data.projID + " #btn-author").toggleClass("black");
        $("#desc_box_" + arguments[0].data.projID + " #btn-author").toggleClass("basic");
        $("#desc_box_" + arguments[0].data.projID + " #project").toggleClass("gbnt-hide");
        $("#desc_box_" + arguments[0].data.projID + " #author").toggleClass("gbnt-hide");
    });

    var btnAuthor = $("<div/>", {
        id: "btn-author",
        class: "ui basic button gbnt-btn",
        text: "Author"
    }).appendTo(segment);

    btnAuthor.on('click', {
        projID: obj.id
    }, function(event) {
        console.log("cenaita");
        $(this).toggleClass("basic");
        $(this).toggleClass("black");
        $("#desc_box_" + arguments[0].data.projID + " #btn-project").toggleClass("black");
        $("#desc_box_" + arguments[0].data.projID + " #btn-project").toggleClass("basic");
        $("#desc_box_" + arguments[0].data.projID + " #project").toggleClass("gbnt-hide");
        $("#desc_box_" + arguments[0].data.projID + " #author").toggleClass("gbnt-hide");

    });

    var alink = $("<a/>", {
        href: "#"
    }).appendTo(segment);
    alink.css("color", "black");

    var close = $("<i/>", {
        id: "close",
        class: "remove icon big gbnt-close"
    }).appendTo(alink);

    // DIV para o projecto ==========================
    var divProject = $("<div/>", {
        id: "project",
        class: "ui basic segment",
    }).appendTo(hiddenDiv);

    var pAno = $("<p/>", {
        class: "gbnt-margin-0",
        text: "year: " + obj.ano
    }).appendTo(divProject);

    var pHeader = $("<h1/>", {
        class: "ui header gbnt-margin-0",
        text: obj.titulo
    }).appendTo(divProject);

    var btnViewProj = $("<div/>", {
        id: "btn-view-proj",
        "data-gbnt-url": obj.www,
        class: "ui basic button gbnt-btn-view-proj",
        text: "View Project"
    }).appendTo(divProject);

    if (obj.id === "26" || obj.id === "6") {
        btnViewProj.on('click', function(event) {
            var slide = $('#gbnt-slide');
            slide.empty();
            window._currentSlide = 0;

            var img = $("<img/>", {
                class: "ui big rounded image centered",
                src: "img/slides/" + window._slideArray[window._currentSlide].image
            }).appendTo(slide);

            $('#gbnt-show-proj').dimmer('show');

        });
    } else {
        btnViewProj.on('click', function(event) {
            var url = $(this).attr('data-gbnt-url');
            window.open(url, '_blank');
        });
    }




    var pText = $("<p/>", {
        text: obj.descricao
    }).appendTo(divProject);

    // DIV para o autor ==========================
    var divAuthor = $("<div/>", {
        id: "author",
        class: "ui basic segment gbnt-hide",
    }).appendTo(hiddenDiv);

    var aHeader = $("<h1/>", {
        class: "ui header gbnt-margin-0",
        text: obj.autor
    }).appendTo(divAuthor);

    var aText = $("<p/>", {
        text: obj.autorBio
    }).appendTo(divAuthor);

    aText.css("margin-top", "20px");

    return hiddenDiv;
}


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
    $('#preloader').addClass("gbnt-hide");
    $('#mainContainer').removeClass("gbnt-hide");

    var $container = $('.packery').packery();

    $container.on('click', '[id^=box]', function(event) {

        // if this was a button, then get out of here
        var regEx = new RegExp("^btn");
        if (regEx.test(event.target.id)) {
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
        var selectedID = event.currentTarget.id.split("_")[1];

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
            // if shrinking, just layout
            $container.packery({
                gutter: 10
            });
        } else {
            $('html, body').animate({
                scrollTop: $target.position().top - 10
            }, 500);
            $container.packery({
                gutter: 10
            }, 'fit', event.currentTarget, 0, 0);
        }
    });


    var container = document.querySelector('.packery');
    var pckry;

    imagesLoaded(container, function() {
        pckry = new Packery(container, {
            itemSelector: '.gbnt-item',
            gutter: 10
        });
    });
}



// 17-01-2015 16:41:49
// O codigo para o ESCAPE nao esta a funcionar la muito bem. Tenho que rever isto
// var youClick = $.proxy(function(e) {
//     if (e.keyCode == 84) { //27

//         if (window._currentOpenDiv) {
//             var selectedID = window._currentOpenDiv;
//             window._currentOpenDiv = null;
//         } else {
//             return;
//         }

//         $target.toggleClass('gbnt-size-selected');
//         // faz enable/disable de todos os outros divs
//         $('.gbnt-disabled').toggleClass('gbnt-hide');
//         $('[id^=overlay]').toggleClass('gbnt-hide');

//         // mas o nosso div tem que estar enabled
//         $('#box_' + selectedID + ' .gbnt-disabled').toggleClass('gbnt-hide');
//         $('#overlay_' + selectedID).toggleClass('gbnt-hide');

//         // expande ou encolhe o div com a ficha do projecto        
//         $('#box_' + selectedID).toggleClass('gbnt-no-bckgr-img');
//         $('#overlay_' + selectedID).toggleClass('gbnt-hide');
//         $('#desc_box_' + selectedID).toggleClass('gbnt-hide');


//         $container.packery({
//             gutter: 10
//         });
//     }
// }, this);
// $(document).keyup(youClick);
