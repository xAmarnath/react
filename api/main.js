const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the Express app
const app = express();
// https://www.mongodb.com/cloud/atlas, Create a free account and create a cluster and get the connection string
const MONGO_URI = 'mongodb+srv://user:user@cluster0.hlrtz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB URI
const DB_NAME = 'moviesdb';

// Middleware: Enable CORS (allows cross-origin requests)
// This is needed to allow the React app to communicate with the Express app without any issues
app.use(cors());

// Middleware: Parse JSON request bodies
// This is needed to parse JSON data sent in the request body
app.use(bodyParser.json());

// MongoDB client initialization
let db;
MongoClient.connect(MONGO_URI)
    .then(client => {
        // Connect to the specific database
        db = client.db(DB_NAME);
        console.log('Connected to MongoDB');
        console.log('Now run the frontend part of the application');
        console.log('Type npm start in the terminal');
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Endpoint to insert a movie
// This endpoint handles POST requests to add a new movie to the database
app.post('/api/movies', async (req, res) => {
    try {
        // Extract movie details from the request body
        const { name, year, rating } = req.body;

        // Validate that all fields are provided
        if (!name || !year || !rating) {
            return res.status(400).json({ error: 'All fields (name, year, rating) are required.' });
        }

        // Create a new movie object
        const movie = { name, year, rating };

        // Insert the movie into the "movies" collection
        await db.collection('movies').insertOne(movie);

        // Respond with a success message and the inserted movie data
        res.status(201).json({ message: 'Movie added successfully', movie: movie });
    } catch (err) {
        // Handle any errors during the process
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

app.post('/api/delete', async (req, res) => {
    try {
        // Delete the specified movie from the "movies" collection
        const { id } = req.body;
        const result = await db.collection('movies').deleteOne({ _id: new ObjectId(id) });

        // Respond with a success message and the deleted movie data
        res.json({ message: 'Movie deleted successfully', movie: result });
    } catch (err) {
        // Handle any errors during the process
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
})

// Retrieve all movies from the database
app.get('/api/movies/stream', async (req, res) => {
    try {
        // Retrieve all movies from the "movies" collection
        const movies = await db.collection('movies').find().toArray();

        // Respond with the retrieved movies
        res.json(movies);
    } catch (err) {
        // Handle any errors during the process
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// Start the server
// The app listens for incoming requests on the specified port
app.listen(process.env.PORT || 8081, () => {
    console.log(`Server running on http://localhost:${process.env.PORT || 8081}`);
});