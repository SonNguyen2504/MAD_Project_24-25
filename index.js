const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const route = require('./routes/index.js');

dotenv.config();
const db = require('./config/db/index.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

route(app);

db.connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
})