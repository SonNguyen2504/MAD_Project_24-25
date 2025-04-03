const AuthRoute = require('./AuthRoute');

const route = (app) => {
    app.use('/api/auth', AuthRoute);
}

module.exports = route;