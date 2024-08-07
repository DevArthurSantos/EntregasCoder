const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const PORT = 3000;

const productManager = new ProductManager('products.json');

app.use(express.json());

app.get('/products', (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = productManager.getProducts(limit);
    res.json(products);
});

app.get('/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    const product = productManager.getProductById(pid);
    if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(product);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
