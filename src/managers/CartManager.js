import { promises as fs } from 'fs'; 

class CartManager {
    constructor(path) {
        this.path = path;
    }

    // Obtiene todos los carritos
    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return []; // Devuelve un array vacío si el archivo no existe
        }
    }

    // Guarda los carritos en el archivo
    async saveCarts(carts) {
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    }

    // Crea un nuevo carrito
    async createCart() {
      try {
          const carts = await this.getCarts(); // Obtiene los carritos existentes
          console.log('Carritos obtenidos:', carts); // Log
          const newCart = {
              id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1, // Genera un ID único
              products: [] // Inicializa el carrito vacío
          };
          carts.push(newCart); // Agrega el nuevo carrito al array
          console.log('Nuevo carrito creado:', newCart); // Log
          await this.saveCarts(carts); // Guarda los carritos actualizados
          return newCart; // Devuelve el carrito creado
      } catch (error) {
          console.error('Error en createCart:', error); // Log del error
          throw error;
      }
  }

    // Obtiene un carrito por ID
    async getCartById(cid) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === cid) || null; // Devuelve el carrito o null si no existe
    }

    // Agrega un producto al carrito
    async addProductToCart(cid, pid) {
        const carts = await this.getCarts(); // Obtiene los carritos existentes
        const cartIndex = carts.findIndex(cart => cart.id === cid); // Encuentra el carrito por ID

        if (cartIndex === -1) {
            throw new Error(`Carrito con ID ${cid} no encontrado.`);
        }

        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(p => p.product === pid); // Encuentra el producto en el carrito

        if (productIndex === -1) {
            // Si el producto no existe, lo agrega con quantity: 1
            cart.products.push({ product: pid, quantity: 1 });
        } else {
            // Si el producto ya existe, incrementa la cantidad
            cart.products[productIndex].quantity += 1;
        }

        carts[cartIndex] = cart; // Actualiza el carrito en el array
        await this.saveCarts(carts); // Guarda los carritos actualizados
        return cart; // Devuelve el carrito actualizado
    }
}

export default CartManager;