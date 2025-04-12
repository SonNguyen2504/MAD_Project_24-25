const AuthRoute = require('./AuthRoute');
const FoodRoute = require('./FoodRoute');
const UserRoute = require('./UserRoute');

const route = (app) => {
    app.use('/api/auth', AuthRoute);
    app.use('/api/user', UserRoute);
    app.use('/api/food', FoodRoute);
}

module.exports = route;