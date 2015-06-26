


require(function($) {

    var timer;
    
    function resizeMain() {

        if (timer) {
            clearTimeout(timer);
        } else {
            timer = setTimeout(function(){
                var H = $('#bgImg').height();

                $('#aside, #main, #panels').height(H);
            }, 100);
        }
    }

    $(window).resize(function(){
        resizeMain();
    });
    resizeMain();


    var $panelsCon = $('#panels'),
        $panels = $panelsCon.children();


    $('#nav > a').on('click', function(e){
        e.preventDefault();
        var $elem = $(this),
            index = $elem.index();

        $panelsCon.show();
        $panels.hide().eq(index).fadeIn();
    });

    $('.colunm-close').on('click', function(e){
        e.preventDefault();
        var $elem = $(this);

        $elem.parents('section').fadeOut(function(){
            $panelsCon.hide();
        });
    });

    setTimeout(function(){
        $('#footer').show();
    }, 500);

    $('.mod-skill a').tipsy({
        gravity: "s"
    });

    $("#inviteShare").vshare({
        content: msg,
        pic: _bd_share_config.common.bdPic
    });
    
});
define("main", function(){});
