// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
        'clientID'      : '1094347910597809', // your App ID
        'clientSecret'  : '95715f3b7ed3dba3e6d25aa432c04775', // your App Secret
        'callbackURL'   : 'https://jiapei-login-system.herokuapp.com/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : '3dxPqFr6sJbxB1PUOOLnect3i',
        'consumerSecret'    : 'G4IQkVq3GVUd1XCSkN2UzT1JKKQf1i2dCGkQiNPqw8P4Mj9G9s',
        'callbackURL'       : 'https://jiapei-login-system.herokuapp.com/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};