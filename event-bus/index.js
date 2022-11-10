const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Event Bus store - collect all the events occurred in the system
const events = [];

// Event Bus route - receive events from other services
app.post('/events', (req, res) => {
  const event = req.body; // get the event from the request body
  events.push(event);

  // send the event to the posts service
  axios.post('http://posts-clusterip-srv:4000/events', event).catch((err) => {
    console.log(err.message);
  });
  // axios.post('http://localhost:4001/events', event).catch((err) => {
  //   console.log(err.message);
  // });
  // // send the event to the query service
  // axios.post('http://localhost:4002/events', event).catch((err) => {
  //   console.log(err.message);
  // });
  // // send the event to the moderation service
  // axios.post('http://localhost:4003/events', event).catch((err) => {
  //   console.log(err.message);
  // });

  res.send({ status: 'OK' }); // send back a response to the client
});

// retrieved all the events occurred in the system
app.get('/events', (req, res) => {
  // send back all the events
  res.send(events);
});

app.listen(4005, () => {
  console.log('Event Bus listening on 4005...');
});
