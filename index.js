const express = require('express');
const cors = require('cors');
const route = require('./routes/index.js');
const path = require('path');
const passport = require('passport');
const dotenv = require('dotenv');

require('./config/passport.js');
const setupSwagger = require('./config/swagger.js');

dotenv.config();
const db = require('./config/db/index.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

setupSwagger(app); // Setup Swagger for API documentation

route(app);

db.connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
    console.log(`swagger is running on http://localhost:${process.env.PORT}/api-docs`);
})