// src/app.js
const express = require('express');
const { connectRabbitMQ } = require('./config/rabbitmq'); // Correct import for connectRabbitMQ
const { consumePaymentEvents } = require('./consumers/paymentConsumer');
const { rabbitmqExchange } = require('./config');

const app = express();
const PORT = process.env.PORT || 4002;

async function startServer() {
  console.log(`Order Service running on port ${PORT}`);

  try {
    // Connect to RabbitMQ and get the channel
    const { channel } = await connectRabbitMQ();
    
    // Start consuming events
    await consumePaymentEvents(channel, rabbitmqExchange);
    console.log('Started consuming payment events');
  } catch (error) {
    console.error('Failed to initialize RabbitMQ consumer:', error);
    process.exit(1); // Exit if unable to connect to RabbitMQ
  }
}

app.listen(PORT, startServer);
