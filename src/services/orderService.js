const { firestore } = require('../config/firebase');

async function saveOrderData(orderData) {
  try {
    const ordersCollection = firestore.collection('orders');
    const result = await ordersCollection.add(orderData);
    console.log(`Order saved with ID: ${result.id}`);
    return result.id;
  } catch (error) {
    console.error('Error saving order data:', error);
    throw new Error('Failed to save order data');
  }
}

module.exports = { saveOrderData };
