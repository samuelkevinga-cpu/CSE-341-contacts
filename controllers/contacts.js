const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const databaseName = process.env.MONGODB_DATABASE || 'cse341';
const requiredFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];

const hasAllFields = (body) => requiredFields.every((field) => body[field]);

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

const createContact = async (req, res) => {
    if (!hasAllFields(req.body)) {
        return res.status(400).json({ message: 'All contact fields are required.' });
    }

    try {
        const result = await mongodb.getDb().db(databaseName).collection('contacts').insertOne(req.body);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(500).json({ message: 'Unable to create contact.' });
    }
};

const updateContact = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid contact id.' });
    }

    if (!hasAllFields(req.body)) {
        return res.status(400).json({ message: 'All contact fields are required.' });
    }

    try {
        const result = await mongodb.getDb().db(databaseName).collection('contacts').replaceOne(
            { _id: new ObjectId(req.params.id) },
            req.body
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Contact not found.' });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Unable to update contact.' });
    }
};

const deleteContact = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid contact id.' });
    }

    try {
        const result = await mongodb.getDb().db(databaseName).collection('contacts').deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Contact not found.' });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Unable to delete contact.' });
    }
};

module.exports = {
    getAll,
    getSingle,
    createContact,
    updateContact,
    deleteContact
};
