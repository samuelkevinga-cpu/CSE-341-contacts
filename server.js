const express = require('express');
const app = express();
const mongodb = require('./db/connect');

const port = process.env.PORT || 8080;

app.use('/', require('./routes'));

mongodb.initDb((err) => {
    if (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    } else {
        app.listen(port, () => {
            console.log(`Connected to DB and listening on port ${port}`);
        });
    }
});
