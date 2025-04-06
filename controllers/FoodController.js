const Food = require('../models/Food');

const testRoute = (req, res) => {
    res.status(200).json({ message: 'Test route is working!' });
}

module.exports = {
    testRoute,
};
