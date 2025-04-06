const AuthRoute = require('./AuthRoute');
const FoodRoute = require('./FoodRoute');

const route = (app) => {
    app.use('/api/auth', AuthRoute);
    app.use('/api/food', FoodRoute);
}

module.exports = route;