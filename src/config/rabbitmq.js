// src/config/rabbitmq.js
const amqp = require('amqplib');
const { rabbitmqUrl, rabbitmqExchange } = require('./index');

let connection = null;
let channel = null;
const exchange = rabbitmqExchange || 'payment_exchange';

const connectRabbitMQ = async (retries = 5, delay = 5000) => {
  while (retries > 0) {
    try {
      connection = await amqp.connect(rabbitmqUrl);
      console.log('Connected to RabbitMQ');
      
      channel = await connection.createChannel();
      console.log('Channel created');

      await channel.assertExchange(exchange, 'fanout', { durable: true });
      console.log(`Exchange '${exchange}' is asserted`);

      connection.on('close', () => {
        console.error('RabbitMQ connection closed');
        channel = null;
        connection = null;
      });

      return { connection, channel };
    } catch (error) {
      console.error(`RabbitMQ connection error: ${error.message}`);
      retries -= 1;
      console.log(`Retrying in ${delay / 1000} seconds... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  console.error('Unable to connect to RabbitMQ after several attempts');
  process.exit(1);
};

// Define a separate function for getting the channel if needed in other parts of the app
const getChannel = () => {
  if (!channel) throw new Error('RabbitMQ channel is not initialized');
  return channel;
};

// Export both connectRabbitMQ and getChannel functions
module.exports = { connectRabbitMQ, getChannel };
