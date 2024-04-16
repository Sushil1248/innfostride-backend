require('dotenv').config();

const frontendUrl = process.env.FRONTEND_APP_URL.replace(/\/$/, '');

var originsWhitelist = [
    frontendUrl
];

const corsOptions = {
    origin: function (origin, callback) {
        if (originsWhitelist.includes(origin)) {
            callback(null, true)
        } else {
            console.log('origin:', origin, 'not allowed')
            callback(new Error('Not allowed by CORS'))
        }
    }
}

module.exports = corsOptions