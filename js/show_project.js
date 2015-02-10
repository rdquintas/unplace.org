var _source = $("#gbnt-template").html();
var _template = Handlebars.compile(_source);

$(document).ready(function() {
    var url_data = getParameterByName("data");
    url_data = decodeURIComponent(url_data);
    var project = JSON.parse(url_data);
    var projs = [];

    for (var i = 0; i < project.imagens.length; i++) {
        var obj = {};
        obj.index = i + 1;
        obj.img = "projectos/" + project.id + "/" + project.imagens[i];
        obj.author = project.autor;
        obj.title = project.titulo;
        obj.year = project.ano;
        obj.total = project.imagens.length;
        projs.push(obj);
    }

    var data = {
        images: projs
    };

    $('#gbnt-project').append(window._template(data));
    // $('.bxslider').bxSlider({
    //     adaptiveHeight: true,
    //     slideWidth: "500px"
    // });

    $('.slick-cena').slick();
});




function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


Handlebars.registerHelper('getCoverImage', function(img) {
    var str = "background-image: url(" + img + ");";
    return str;
});

Handlebars.registerHelper('getID', function(str, projectID) {
    var val = str + projectID;
    return val;
});
