const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.nextId = 1;

        this.loadProducts();
    }

    loadProducts() {
        if (fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, 'utf-8');
            this.products = JSON.parse(data);
            this.nextId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
        }
    }

    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
    }

    addProduct({ title, description, price, thumbnail, code, stock }) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos os campos são obrigatórios");
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.error(`O produto com o código ${code} já existe`);
            return;
        }

        const newProduct = {
            id: this.nextId++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(newProduct);
        this.saveProducts();
        console.log(`Produto ${newProduct.title} adicionado com sucesso`);
    }

    getProducts(limit) {
        this.loadProducts();
        if (limit) {
            return this.products.slice(0, limit);
        }
        return this.products;
    }

    getProductById(id) {
        this.loadProducts();
        const product = this.products.find(product => product.id === id);
        if (!product) {
            console.error("Não encontrado");
            return null;
        }
        return product;
    }

    updateProduct(id, updatedFields) {
        this.loadProducts();
        const productIndex = this.products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            console.error("Produto não encontrado");
            return;
        }

        const updatedProduct = { ...this.products[productIndex], ...updatedFields, id };
        this.products[productIndex] = updatedProduct;
        this.saveProducts();
        console.log(`Produto ${updatedProduct.title} atualizado com sucesso`);
    }
}

module.exports = ProductManager;