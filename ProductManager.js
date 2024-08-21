const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        if (fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, 'utf-8');
            this.products = JSON.parse(data);
            this.nextId = this.products.length > 0 ? Math.max(this.products.map(p => p.id)) + 1 : 1;
        } else {
            this.nextId = 1;
        }
    }

    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
    }

    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.error('Todos os campos são obrigatórios');
            return;
        }

        const codeExists = this.products.some(p => p.code === product.code);
        if (codeExists) {
            console.error(`Produto com o código ${product.code} já existe`);
            return;
        }

        const newProduct = { ...product, id: this.nextId++ };
        this.products.push(newProduct);
        this.saveProducts();
        console.log(`Produto ${newProduct.title} adicionado com sucesso`);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            console.error('Produto não encontrado');
            return null;
        }
        return product;
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            console.error('Produto não encontrado');
            return;
        }

        const product = this.products[index];
        this.products[index] = { ...product, ...updatedProduct };
        this.saveProducts();
        console.log(`Produto com ID ${id} atualizado com sucesso`);
    }

    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            console.error('Produto não encontrado');
            return;
        }

        this.products.splice(index, 1);
        this.saveProducts();
        console.log(`Produto com ID ${id} deletado com sucesso`);
    }
}

// Exemplo de uso:
const manager = new ProductManager('products.json');

manager.addProduct({
    title: 'Produto 1',
    description: 'Descrição do produto 1',
    price: 100.0,
    thumbnail: 'imagem1.png',
    code: 'abc123',
    stock: 10
});

manager.addProduct({
    title: 'Produto 2',
    description: 'Descrição do produto 2',
    price: 150.0,
    thumbnail: 'imagem2.png',
    code: 'xyz456',
    stock: 5
});

console.log(manager.getProducts());

const product = manager.getProductById(1);
if (product) {
    console.log('Produto encontrado:', product);
}

manager.updateProduct(1, { price: 120.0, stock: 8 });

manager.deleteProduct(2);
