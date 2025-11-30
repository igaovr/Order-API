const Order = require('../models/orderModel');

/**
 * Faz o mapeamento do JSON de entrada
 * para o formato que será salvo no MongoDB.
 */
function mapRequestToOrderData(body) {
  if (!body) return null;

  const {
    numeroPedido,
    valorTotal,
    dataCriacao,
    items
  } = body;

  // validações básicas
  if (!numeroPedido || !valorTotal || !dataCriacao) {
    throw new Error('Campos obrigatórios: numeroPedido, valorTotal, dataCriacao');
  }

  // Converte data
  const creationDate = new Date(dataCriacao);

  if (isNaN(creationDate.getTime())) {
    throw new Error('dataCriacao inválida');
  }

  const mappedItems = (items || []).map((item) => {
    return {
      productId: Number(item.idItem),
      quantity: Number(item.quantidadeItem),
      price: Number(item.valorItem)
    };
  });

  return {
    orderId: numeroPedido,
    value: valorTotal,
    creationDate,
    items: mappedItems
  };
}

// POST /order - criar novo pedido
async function createOrder(req, res) {
  try {
    const orderData = mapRequestToOrderData(req.body);

    const existingOrder = await Order.findOne({ orderId: orderData.orderId });
    if (existingOrder) {
      return res.status(409).json({
        message: 'Já existe um pedido com esse numeroPedido (orderId).'
      });
    }

    const order = await Order.create(orderData);

    return res.status(201).json({
      message: 'Pedido criado com sucesso.',
      data: order
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error.message);
    return res.status(400).json({
      message: 'Erro ao criar pedido.',
      error: error.message
    });
  }
}

// GET /order/:orderId - obter pedido por ID
async function getOrderById(req, res) {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        message: 'Pedido não encontrado.'
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('Erro ao obter pedido:', error.message);
    return res.status(500).json({
      message: 'Erro interno ao buscar pedido.',
      error: error.message
    });
  }
}

// listar todos os pedidos
async function listOrders(req, res) {
  try {
    const orders = await Order.find().sort({ creationDate: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error.message);
    return res.status(500).json({
      message: 'Erro interno ao listar pedidos.',
      error: error.message
    });
  }
}

// atualizar pedido
async function updateOrder(req, res) {
  try {
    const { orderId } = req.params;

    // mapeia o body para o formato do banco
    const orderData = mapRequestToOrderData(req.body);

    // garante que o orderId siga o parâmetro
    orderData.orderId = orderId;

    const updated = await Order.findOneAndUpdate(
      { orderId },
      orderData,
      { new: true } // retorna o documento já atualizado
    );

    if (!updated) {
      return res.status(404).json({
        message: 'Pedido não encontrado para atualização.'
      });
    }

    return res.status(200).json({
      message: 'Pedido atualizado com sucesso.',
      data: updated
    });
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error.message);
    return res.status(400).json({
      message: 'Erro ao atualizar pedido.',
      error: error.message
    });
  }
}

//apagar pedido
async function deleteOrder(req, res) {
  try {
    const { orderId } = req.params;

    const deleted = await Order.findOneAndDelete({ orderId });

    if (!deleted) {
      return res.status(404).json({
        message: 'Pedido não encontrado para exclusão.'
      });
    }

    return res.status(200).json({
      message: 'Pedido deletado com sucesso.'
    });
  } catch (error) {
    console.error('Erro ao deletar pedido:', error.message);
    return res.status(500).json({
      message: 'Erro interno ao deletar pedido.',
      error: error.message
    });
  }
}

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder
};
