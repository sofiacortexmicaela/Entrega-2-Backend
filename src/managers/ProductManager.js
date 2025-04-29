import { promises as fs } from 'fs';

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath; // Guardar la ruta al archivo
        this.products = [];
    }

    async addProduct(product) {
        const products = await this.getProducts(); // Obtener productos existentes
    
        // Validar que el producto tenga un ID único
        const exists = products.some(p => p.code === product.code);
        if (exists) {
            throw new Error(`El producto con código ${product.code} ya existe.`);
        }
    
        // Generar un nuevo ID para el producto
        const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        const newProduct = { id: newId, ...product }; // Crear el nuevo producto con ID
    
        products.push(newProduct); // Agregar producto
        await this.saveProducts(products); // Guardar en el archivo JSON
    
        return newProduct; // Retornar el producto agregado
    }
   
    // Obtener todos los productos
    async getProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer los productos:', error);
            return [];
        }
    }

    // Guardar productos en el archivo
    async saveProducts(products) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error('Error al guardar los productos:', error);
            throw error;
        }
    }

    // Eliminar un producto por ID
    async deleteProduct(productId) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id === parseInt(productId));

        if (productIndex === -1) {
            throw new Error(`Producto con ID ${productId} no encontrado.`);
        }

        products.splice(productIndex, 1); // Eliminar producto
        await this.saveProducts(products); // Guardar cambios
        return true;
    }

}

export default ProductManager;