/*global ngNice*/
(function () {

    var requires = ['ui.bootstrap', 'w5c.validator'];
    var ngApp = ngNice.ngApp = angular.module("app", requires);

    ngApp.config(['$httpProvider', 'w5cValidatorProvider', function ($httpProvider, w5cValidatorProvider) {
        w5cValidatorProvider.config({
            blurTrig   : false,
            showError  : function () {
            },
            removeError: function () {
            }
        });
        w5cValidatorProvider.setRules({
            user_name        : {
                required: "username",
                pattern : "cannot accept"
            },
            user_password    : {
                required: "password"
            },
            user_email       : {
                required: "E-mail",
                email   : "format is wrong"
            },
            repeat_password  : {
                repeat: "password not same"
            },
            user_original_pwd: {
                required: "original password"
            },
            user_new_pwd     : {
                required: "new password"
            }
        });

        marked.setOptions({
            renderer   : new marked.Renderer(),
            gfm        : true,
            tables     : true,
            breaks     : true,
            pedantic   : false,
            sanitize   : true,
            smartLists : true,
            smartypants: false
        });

        $httpProvider.responseInterceptors.push(["$q", function ($q) {
            return function (promise) {
                return promise.then(function (response) {
                    if (response.config.url.toLowerCase().indexOf("/api/") >= 0 && (!response.data || response.data.code !== ngNice.status.ok)) {
                        return $q.reject(response);
                    }
                    return response;
                }, function (response) {
                    return $q.reject(response);
                });
            };
        }]);
    }]).value("config", {
        pageSize  : 20,
        categories: [
         
            {name: "AngularJS", value: 1},
            {name: "NodeJS", value: 2},
            {name: "Javascript", value: 3},
           
        ]
    }).run(['$rootScope', function ($rootScope) {
        $rootScope.global = {
            loading_done: false
        };
        $('pre code').each(function (i, block) {
            hljs.highlightBlock(block);
        });
        $('.height-no-header').height($(window).height() - 70);
        $('[data-height]').each(function () {
            var exHeight = parseInt($(window).height() - $(this).attr('data-height'), 10);
            $(this).css('height', exHeight);
        });
    }]);
})();