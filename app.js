const express = require('express');
const { engine } = require('express-handlebars'); // Corrigido para usar a forma atualizada
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const ProductManagerFile = require('./ProductManager');
const ProductManagerMongo = require('./mongo/productDao.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

mongoose.connect(mongoURI, {
}).then(() => {
    console.log('Conectado ao MongoDB com sucesso!');
}).catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
});

const productManager = process.env.USE_MONGO_DB ? new ProductManagerMongo() : new ProductManagerFile('products.json');

app.engine('handlebars', engine()); // Correção para a função engine()
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());

app.get('/products', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).send('Erro ao buscar produtos');
    }
});

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

io.on('connection', (socket) => {
    console.log('Um cliente se conectou');

    socket.on('disconnect', () => {
        console.log('Um cliente se desconectou');
    });
});
