const AuthRoute = require('./AuthRoute');
const FoodRoute = require('./FoodRoute');
const UserRoute = require('./UserRoute');
const MealRoute = require('./MealRoute');
const NoteRoute = require('./NoteRoute');
const TargetRoute = require('./TargetRoute');

const route = (app) => {
    app.use('/api/auth', AuthRoute);
    app.use('/api/user', UserRoute);
    app.use('/api/food', FoodRoute);
    app.use('/api/meal', MealRoute);
    app.use('/api/note', NoteRoute);
    app.use('/api/target', TargetRoute);
}

module.exports = route;