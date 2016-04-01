/*global exports,require*/(function () {    "use strict";    var config = require("../config"),        data = require("../data"),        _ = require("lodash"),        kits = require("../kits");    exports.index = function (req, res, next) {        var page = req.param("page");        var intPage = 1;        if (page) {            intPage = parseInt(page, 10)        }        if (intPage <= 0) {            intPage = 1;        }        ;        //throw new Error("xxxx");        data.Post.get_list_for_home(intPage, config.perPageCount, function (err, posts, total) {            if (err) {                return res.render('index.html', {                    title      : 'main',                    posts      : [],                    total      : 0,                    pager      : "",                    current_nav: "home",                    currentMenu: "home"                });            }            var new_posts = [];            var uids = _.pluck(posts, "author");            total = total ? total : 0;            data.User.get_list_by_uids(uids, function (err, users) {                if (err) {                    return res.render('index.html', {                        title      : 'main',                        posts      : [],                        total      : 0,                        pager      : "",                        current_nav: "home",                        currentMenu: "home"                    });                }                _.forEach(posts, function (post) {                    var newItem = post.makeSimple();                    newItem.publish_date = kits.utils.date_format.fullDateTime(post.create_date);                    var author = _.findLast(users, function (item) {                        return item.id === newItem.author;                    });                    newItem.author = author.makeSimple();                    new_posts.push(newItem);                });                var pagerHtml = kits.utils.pager_render(intPage, total, config.perPageCount);                return res.render('index.html', {                    title      : 'main',                    posts      : new_posts,                    total      : total,                    pager      : pagerHtml,                    current_nav: "home",                    currentMenu: "home"                });            });        });    };    exports.hots = function (req, res) {        var page = req.param("page");        var intPage = 1;        if (page) {            intPage = parseInt(page, 10)        }        if (intPage <= 0) {            intPage = 1;        }        data.Post.get_list_for_hots(intPage, config.perPageCount, function (err, posts, total) {            if (err) {                return res.render('index.html', {                    title      : 'hots',                    posts      : [],                    total      : 0,                    pager      : "",                    current_nav: "home",                    currentMenu: "hots"                });            }            var new_posts = [];            var uids = _.pluck(posts, "author");            total = total ? total : 0;            data.User.get_list_by_uids(uids, function (err, users) {                if (err) {                    return res.render('index.html', {                        title      : 'hots',                        posts      : [],                        total      : 0,                        pager      : "",                        current_nav: "home",                        currentMenu: "hots"                    });                }                _.forEach(posts, function (post) {                    var newItem = post.makeSimple();                    newItem.publish_date = kits.utils.date_format.fullDateTime(post.create_date);                    var author = _.findLast(users, function (item) {                        return item.id === newItem.author;                    });                    newItem.author = author.makeSimple();                    new_posts.push(newItem);                });                var pagerHtml = kits.utils.pager_render(intPage, total, config.perPageCount);                return res.render('index.html', {                    title      : 'hots',                    posts      : new_posts,                    total      : total,                    pager      : pagerHtml,                    current_nav: "home",                    currentMenu: "hots"                });            });        });    };    exports.about = function (req, res) {        res.render('home/about.html', {title: '关于我们', current_nav: "about"});    };    exports.donate = function (req, res) {        res.render('home/donate.html', {title: '捐赠', current_nav: "donate"});    };    exports.error = function (req, res) {        res.render('home/error.html', {title: '异常', current_nav: "error"});    };    exports.showcase = function (req, res) {        res.redirect("http://showcase.ricefun.herokuapp.com");    };    exports.doc_home = function (req, res) {        res.render('../static/docs/index.html', {title: '', layout: false});    };    exports.doc_guide = function (req, res) {        res.redirect("/docs/guide");    };})();