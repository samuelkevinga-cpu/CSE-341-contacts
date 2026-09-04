const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

// Basic route returning "Hello World"
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});