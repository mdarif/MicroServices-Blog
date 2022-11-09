const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

// create express app
const app = express();

// use body-parser middleware for parsing application/json
app.use(bodyParser.json());
app.use(cors()); // wire up CORS

// temporary data
const commentsByPostId = [];

app.get('/posts/:id/comments', (req, res) => {
  // send back the comments for the post with the given id
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  // generate a random id
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body; // get the content from the request body

  // get the post id from the request params
  const comments = commentsByPostId[req.params.id] || [];

  // add the new comment to the comments array
  comments.push({ id: commentId, content, status: 'pending' });

  // add the comments array to the commentsByPostId object
  commentsByPostId[req.params.id] = comments;

  // send an event to the event bus
  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending',
    },
  });

  // send back the new comment to the client
  res.status(201).send(comments);
});

// Receive events from the event bus
app.post('/events', async (req, res) => {
  console.log('Received event:', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;

    // Emit the updated comments
    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }

  res.send({});
});

// listen on port 4001
app.listen(4001, () => {
  console.log('Listening on 4001...');
});
