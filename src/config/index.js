require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4002,
  rabbitmqUrl: process.env.RABBITMQ_URL,
  rabbitmqExchange: process.env.RABBITMQ_EXCHANGE || 'payment_exchange',
  firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
};
