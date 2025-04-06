const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const dotenv = require('dotenv');
dotenv.config();

// Cấu hình Swagger
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Documentation for Nutrition App',
        version: '1.0.0',
        description: 'Documentation for your API',
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT}`, // Thay bằng URL thực tế của bạn
            description: 'Development server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // Đường dẫn đến các tệp chứa chú thích Swagger
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
