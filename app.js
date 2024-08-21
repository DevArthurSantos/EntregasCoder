const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const ProductManager = require('./ProductManager'); // Ajuste o caminho se necessário

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;
const productManager = new ProductManager('products.json');

// Configurar Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', './views'); // Diretório para as views

app.use(express.json());
app.use(express.static('public'));

// Endpoint para a página inicial com a lista de produtos
app.get('/', async (req, res) => {
    const products = productManager.getProducts();
    res.render('home', { products });
});

// Endpoint para a página em tempo real com WebSocket
app.get('/realtimeproducts', async (req, res) => {
    const products = productManager.getProducts();
    res.render('realTimeProducts', { products });
});

// Endpoint para obter todos os produtos com suporte a limite
app.get('/api/products', (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = productManager.getProducts();
    if (isNaN(limit) || limit <= 0) {
        return res.json(products);
    }
    return res.json(products.slice(0, limit));
});

// Endpoint para obter um produto específico pelo ID
app.get('/api/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    const product = productManager.getProductById(pid);
    if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(product);
});

// Configuração do WebSocket
io.on('connection', (socket) => {
    console.log('Um cliente conectado');

    // Enviar lista de produtos quando um novo cliente se conecta
    socket.emit('updateProducts', productManager.getProducts());

    // Escutar eventos de adição e exclusão de produtos
    socket.on('addProduct', (product) => {
        productManager.addProduct(product);
        io.emit('updateProducts', productManager.getProducts());
    });

    socket.on('deleteProduct', (id) => {
        productManager.deleteProduct(id);
        io.emit('updateProducts', productManager.getProducts());
    });

    socket.on('disconnect', () => {
        console.log('Um cliente desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
