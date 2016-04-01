var config = {
    port               : 8800,
    host               : "127.0.0.1",
    domain             : ".ngnice.local",
    baseUrl            : "http://127.0.0.1:8888",
    mongoServer        : "mongodb://127.0.0.1/ngnice",
    cookieSecret       : "WOJIUSHINIUBI123456",
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
            callbackURL     : "http://local.ricefun.herokuapp.com:8800/auth/weibo/callback"
        }
    },
    logger             : {
        dirname : "logs",
        filename: "",
        level   : "info",
        maxsize : 1024 * 1024 * 10
    }
};

module.exports = exports = config;
