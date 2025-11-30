const express = require('express');
const router = express.Router();

const {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController');

// Criar um novo pedido
router.post('/order', createOrder);

// Obter pedido por número 
router.get('/order/:orderId', getOrderById);

// Listar todos os pedidos 
router.get('/order/list', listOrders);

// Atualizar pedido por número 
router.put('/order/:orderId', updateOrder);

// Deletar pedido por número 
router.delete('/order/:orderId', deleteOrder);

module.exports = router;
