require.config({
    baseUrl: 'http://td.17m3.com/res/js/',
    paths: {
        'jquery': 'core/jquery-1.10.2.min',
        'template': 'plugs/artTemplate/template',
        'jpages': 'plugs/jpages/jPages.min',
        'flexslider': 'plugs/flexslider/jquery.flexslider.min',
        'vtab': 'v/vtab/vtab',
        'vdropdown': 'v/vdropdown/vdropdown',
        'validate': 'plugs/validation/jquery.validate.min',
        'json2': 'utils/json2',
        'login': 'ctrl/public-module-init',
        'dhlogin': 'http://static.m3guo.com/passport/v1/js/msloginV2',
        'bdlogin': 'ctrl/temp_bd_login_v1',
        'artDialog': 'plugs/artDialog/dialog-min',
        'jplayer': 'plugs/jplayer/jquery.jplayer.min',
        'cookie': 'utils/jquery.cookie',
        'clipboard': 'http://imba.17m3.com/res/js/utils/clip/ZeroClipboard.min',
        'vshare': 'v/vshare/vshare',
        'tipsy': 'plugs/tipsy/jquery.tipsy'
    },
    shim: {
        'template': {
            exports: 'template',
            deps: ['jquery']
        },
        'jpages': {
            exports: 'jpages',
            deps: ['jquery']
        },
        'flexslider': {
            exports: 'flexslider',
            deps: ['jquery']
        },
        'assets/js/vslide.js': {
            exports: 'flexslider',
            deps: ['jquery']
        },
        'vtab': {
            exports: 'vtab',
            deps: ['jquery']
        },
        'vdropdown': {
            exports: 'vdropdown',
            deps: ['jquery']
        },
        'login': {
            exports: 'login',
            deps: ['jquery', 'dhlogin', 'bdlogin']
        },
        'dhlogin': {
            exports: 'dhlogin',
            deps: ['jquery']
        },
        'bdlogin': {
            exports: 'flexslider',
            deps: ['jquery']
        },
        'artDialog': {
            exports: 'artDialog',
            deps: ['jquery']
        },
        'tipsy': {
            deps: ['jquery']
        }
    }
});


require(['jquery', 'vtab', 'vshare','tipsy'], function($) {

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