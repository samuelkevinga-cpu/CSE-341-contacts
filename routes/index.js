const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Use /contacts to view the contacts API.');
});

router.use('/contacts', require('./contacts'));

module.exports = router;
