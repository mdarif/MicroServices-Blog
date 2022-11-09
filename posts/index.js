const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

// Create a new app
const app = express();

// Use body-parser middleware for parsing application/json
app.use(bodyParser.json());
app.use(cors()); // wire up CORS

// temporary data
const posts = {};

// Get all posts
app.get('/posts', (req, res) => {
  // send back the posts object to the client
  res.send(posts);
});

// Create a new post
app.post('/posts', async (req, res) => {
  // generate a random id
  const id = randomBytes(4).toString('hex');
  const { title } = req.body; // get the title from the request body

  // add the new post to the posts object
  posts[id] = {
    id,
    title,
  };

  // send an event to the event bus
  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: {
      id,
      title,
    },
  });

  // send back the new post to the client
  res.status(201).send(posts[id]);
});

// Receive events from the event bus
app.post('/events', (req, res) => {
  console.log('Received event:', req.body.type);

  res.send({});
});

// Listen on port 4000
app.listen(4000, () => {
  console.log('Listening on 4000...');
});
