require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(express.json());

// Rotas
app.use('/', orderRoutes);

// Rota raiz 
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Order API is running 🚀' });
});

// Inicia a aplicação
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  });
});
