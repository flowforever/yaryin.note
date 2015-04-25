/**
 * Created by trump.wang on 2015/4/24.
 */
(function () {


    jQuery.browser = {};
    jQuery.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit    /.test(navigator.userAgent.toLowerCase());
    jQuery.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
    jQuery.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
    jQuery.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());

})();