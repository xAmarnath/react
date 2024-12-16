const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Middleware: Enable CORS (allows cross-origin requests)
// This is needed to allow the React app to communicate with the Express app without any issues
app.use(cors());

// Middleware: Parse JSON request bodies
// This is needed to parse JSON data sent in the request body
app.use(bodyParser.json());


app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    if (username === 'admin' && password === 'admin') {
        return res.json({ message: 'Login successful' });
    } else {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
});


// Start the server
// The app listens for incoming requests on the specified port
app.listen(process.env.PORT || 8081, () => {
    console.log(`Server running on http://localhost:${process.env.PORT || 8081}`);
});
// cool