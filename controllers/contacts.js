const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const databaseName = process.env.MONGODB_DATABASE || 'cse341';

const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDb().db(databaseName).collection('contacts').find();
        const lists = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    } catch (err) {
        res.status(500).json({ message: 'Unable to get contacts.' });
    }
};

const getSingle = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid contact id.' });
    }

    try {
        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db(databaseName).collection('contacts').find({ _id: userId });
        const lists = await result.toArray();

        if (!lists[0]) {
            return res.status(404).json({ message: 'Contact not found.' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    } catch (err) {
        res.status(500).json({ message: 'Unable to get contact.' });
    }
};

module.exports = { getAll, getSingle };
