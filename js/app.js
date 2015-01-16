$(document).ready(function() {
    var cards = $(".item");
    for (var i = 0; i < cards.length; i++) {
        var target = Math.floor(Math.random() * cards.length - 1) + 1;
        var target2 = Math.floor(Math.random() * cards.length - 1) + 1;
        cards.eq(target).before(cards.eq(target2));
    }
});

// $(document).ready(function() {
// var $container = $('#container');

// init
// $container.packery({
//     itemSelector: '.item',
//     gutter: 10,
//     isInitLayout: false

//     // isHorizontal: false
// });


// $container.packery('on', 'layoutComplete', function() {
//     console.log('layout is complete');
// });
// manually trigger initial layout
// $container.packery();


// });
