
var core = (function(){
    return {
        init: function(){
            core.setCaptchaTitle();
            core.bindButtons();
            core.prepareContactForm();

            $(document).ajaxSend(function(event, xhr, settings) {
                function getCookie(name) {
                    var cookieValue = null;
                    if (document.cookie && document.cookie != '') {
                        var cookies = document.cookie.split(';');
                        for (var i = 0; i < cookies.length; i++) {
                            var cookie = jQuery.trim(cookies[i]);
                            // Does this cookie string begin with the name we want?
                            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                }
                function sameOrigin(url) {
                    // url could be relative or scheme relative or absolute
                    var host = document.location.host; // host + port
                    var protocol = document.location.protocol;
                    var sr_origin = '//' + host;
                    var origin = protocol + sr_origin;
                    // Allow absolute or scheme relative URLs to same origin
                    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
                        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
                        // or any other URL that isn't scheme relative or absolute i.e relative.
                        !(/^(\/\/|http:|https:).*/.test(url));
                }
                function safeMethod(method) {
                    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
                }

                if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                }
            });
            if(window.location.hash === '#contact') {
                $('.aContact').click();
            }
        },

        bindButtons: function(){
            $('.aContact').click(function(){
                $.fancybox('#contact', {
                    afterClose: core.resetContactForm
                })
            });

            $('#contact form').submit(function(){
                $.fancybox.showLoading();

                var elems = $('#contact input, textarea');

                for(var i = 0; i < elems.length; i++) {
                    var elem = $(elems[i]);

                    if(elem.attr('title') == elem.val()) {
                        elem.val('');
                    }
                }

                var data = $(this).serialize();

                for(var i = 0; i < elems.length; i++) {
                    var elem = $(elems[i]);

                    if(elem.val() == '') {
                        elem.val(elem.attr('title'));
                    }
                }

                $.post($(this).attr('action'), data, function(response){
                    $.fancybox.hideLoading();
                    $('#contact input, textarea').removeClass('is-error');
                    $('#contact .error').remove();

                    $('.captcha').empty();
                    $('.captcha').append(response.captcha.toString());
                    core.setCaptchaTitle();
                    $('.captcha input[type=text]').val($('.captcha input[type=text]').attr('title'));

                    $('.captcha input[type=text]').focus(function(){
                        if($(this).val() == $(this).attr('title')) {
                            $(this).val('');
                            $(this).css('color', 'black');
                        }
                    });

                    $('.captcha input[type=text]').blur(function(){
                        if($(this).val() == '') {
                            $(this).val($(this).attr('title'));
                            $(this).css('color', '#cdcdcd');
                        }
                    });

                    $('.captcha input[type=text]').attr('id', 'id_captcha_1');

                    if(response.type == 'success') {
                        $.fancybox('Your message has been sent.');
                    } else {
                        for (var i = 0; i < response.fields.length; i ++) {
                            for (var key in response.fields[i]) {
                                if (response.fields[i].hasOwnProperty(key)) {
                                    var elem = key == 'captcha' ? $('#id_captcha_1') :  $('#id_' + key);
                                    elem.addClass('is-error');
                                    $('<span class="error" id="' + key + 'error">' + response.fields[i][key] + '</span>').insertBefore(elem);
                                }
                            }
                        }
                    }

                }, 'JSON')

                return false;
            });
        },

        resetContactForm: function(){
            core.prepareContactForm();
            $('#contact input, textarea').removeClass('is-error');
            $('#contact .error').remove();
        },

        prepareContactForm: function(){
            var elems = $('#contact input, textarea');
            var hiddenValue = $('#contact input[type=hidden]').val();

            for(var i = 0; i < elems.length; i++) {
                var elem = $(elems[i]);

                elem.val(elem.attr('title'));

                elem.focus(function(){
                    if($(this).val() == $(this).attr('title')) {
                        $(this).val('');
                        $(this).css('color', 'black');
                    }
                });

                elem.blur(function(){
                    if($(this).val() == '') {
                        $(this).val($(this).attr('title'));
                        $(this).css('color', '#cdcdcd');
                    }
                });
            }
            $('#contact input[type=hidden]').val(hiddenValue);
        },

        setCaptchaTitle: function(){
            $('.captcha input[type=text]').attr('title', 'Type here the characters above*');
        }
    }
})()

$(document).ready(function(){
    core.init();
});