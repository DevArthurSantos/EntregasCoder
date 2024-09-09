const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');

// Gerenciadores de Produto
const ProductManagerFile = require('./dao/filesystem/productDao'); // Gerenciador para FileSystem
const ProductManagerMongo = require('./dao/mongo/productDao'); // Gerenciador para MongoDB

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

// Escolha qual gerenciador usar, com base no ambiente ou configuração
const productManager = process.env.USE_MONGO_DB ? new ProductManagerMongo() : new ProductManagerFile('products.json');

// Configuração do Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', './views'); // Diretório para as views

app.use(express.json());

