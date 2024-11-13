const { saveOrderData } = require('../services/orderService');

async function consumePaymentEvents(channel, rabbitmqExchange) {
  const queueName = 'payment_success_queue';
  
  // Assert queue and bind it to the exchange
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, rabbitmqExchange, '');

  console.log('Waiting for payment success events...');

  channel.consume(queueName, async (msg) => {
    if (msg && msg.content) {
      try {
        const paymentEvent = JSON.parse(msg.content.toString());
        console.log('Received payment event:', paymentEvent);

        // Process and save order data
        const orderData = {
          paymentId: paymentEvent.id,
          amount: paymentEvent.amount,
          status: paymentEvent.status,
          timestamp: new Date(),
        };

        await saveOrderData(orderData);

        // Acknowledge the message after successful processing
        channel.ack(msg);
        console.log('Message acknowledged');
      } catch (error) {
        console.error('Failed to process payment event:', error);
        channel.nack(msg);  // Nack the message for retry
      }
    }
  }, { noAck: false }); // Use noAck: false to manually acknowledge
}

module.exports = { consumePaymentEvents };
