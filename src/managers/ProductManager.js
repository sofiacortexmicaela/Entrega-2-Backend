import { promises as fs } from 'fs';

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath; // Guardar la ruta al archivo
        this.products = [];
    }

    // Método para obtener todos los productos
    async getProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer el archivo de productos:', error);
            return [];
        }
    }

    async getProductById(pid) {
        const products = await this.getProducts();
        return products.find(product => product.id === pid) || null; // Devuelve null si no encuentra el producto
    }

    async addProduct(product) {
        console.log('Producto recibido en addProduct:', product); // Log para verificar el producto recibido

        const { title, description, code, price, stock, category } = product;

        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Todos los campos obligatorios deben estar presentes.');
        }

        const products = await this.getProducts(); // Obtener productos existentes
        console.log('Productos actuales antes de agregar:', products); // Log para verificar los productos actuales

        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            ...product
        };

        products.push(newProduct); // Agregar el nuevo producto al array
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2)); // Guardar en el archivo
        console.log('Producto agregado a products.json:', newProduct); // Log para confirmar que el producto fue agregado

        return newProduct; // Retornar el producto recién creado
    }

    async updateProduct(pid, updateFields) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === pid);
        if (index === -1) {
            throw new Error(`Producto con ID ${pid} no encontrado.`);
        }

        products[index] = { ...products[index], ...updateFields };
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(pid) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === pid);
        if (index === -1) {
            throw new Error(`Producto con ID ${pid} no encontrado.`);
        }

        products.splice(index, 1);
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    }
}

export default ProductManager;