const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const route = require('./routes/index.js');

const setupSwagger = require('./config/swagger.js');

dotenv.config();
const db = require('./config/db/index.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

setupSwagger(app); // Setup Swagger for API documentation

route(app);

db.connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
    console.log(`swagger is running on http://localhost:${process.env.PORT}/api-docs`);
})