var _ = require('lodash');

var config = {
    port               : 8800,
    host               : "www.ngnice.com",
    domain             : ".ngnice.com",
    baseUrl            : "http://ricefun.herokuapp.com/",
    errorHandlerOptions: {
        dumpExceptions: true,
        showStack     : true
    },
    passport           : {
        weibo: {
            authorizationURL: "https://api.weibo.com/oauth2/authorize",
            tokenURL        : "https://api.weibo.com/oauth2/access_token",
            clientID        : "2012243955",
            clientSecret    : "3af5d86cd7e6309bdc2076c89fd46f97",
            callbackURL     : "http://local.ngnice.com:8800/auth/weibo/callback"
        }
    },
    logger             : {
        dirname : "/home/web-log/node-js",
        filename: "log-info.log",
        level   : "info",
        maxsize : 1024 * 1024 * 10
    }
};
var envConfig = require("./production.confidential.js");

module.exports = exports = _.merge(config, envConfig);;
