const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
// MongoClient is a class that allows us to connect to a MongoDB database
// ObjectId is a class that allows us to create a unique identifier for each item
const bodyParser = require('body-parser');
const path = require('path');
// we need to install ejs module, to load ejs views

// Create an Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // used to parse URL-encoded data
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB configuration
const MONGO_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'SNIST';
let db;

// Connect to MongoDB
MongoClient.connect(MONGO_URI)
.then(client => {
    console.log('Connected to MongoDB');
    db = client.db(DATABASE_NAME);
})
.catch(err => console.error(err));

// Routes

// Home route to list all items
app.get('/', async (req, res) => {
    try {
        const items = await db.collection('items').find().toArray();
        console.log(items);
        res.render('index', { items });
    } catch (error) {
        res.status(500).send('Error fetching items');
    }
});

// Form to create a new item
app.get('/create', (req, res) => {
    res.render('create');
});

// Create a new item
app.post('/create', async (req, res) => {
    try {
        await db.collection('items').insertOne({
            name: req.body.name,
            description: req.body.description
        });
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error creating item');
    }
});

// Form to edit an item
app.get('/edit/:id', async (req, res) => {
    try {
        const item = await db.collection('items').findOne({
            _id: new ObjectId(req.params.id)
        });
        res.render('edit', { item });
    } catch (error) {
        res.status(500).send('Error fetching item');
    }
});

// Update an item
app.post('/edit/:id', async (req, res) => {
    try {
        await db.collection('items').updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    name: req.body.name,
                    description: req.body.description
                }
            }
        );
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error updating item');
    }
});

// Delete an item
app.post('/delete/:id', async (req, res) => {
    try {
        await db.collection('items').deleteOne({
            _id: new ObjectId(req.params.id)
        });
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error deleting item');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});