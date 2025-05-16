import express from 'express';
import Cart from '../models/Cart.js'; // Modelo de carrito
import Product from '../models/Product.js'; // Modelo de producto
import { getCartById, emptyCart, addToCart } from '../controllers/carts.controller.js';

const router = express.Router(); 

//---------------------------USAR POPULATE-------------------------------------//
router.get('/:cid', getCartById); // Obtener un carrito con productos poblados
router.delete('/:cid', emptyCart); // Vaciar el carrito
router.post('/:cid/products/:pid', addToCart);// Ruta para agregar productos al carrito

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new Cart({ products: [] }); // Crear un carrito vacío
        const savedCart = await newCart.save(); // Guardar en MongoDB
        res.status(201).json(savedCart);
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Agregar un producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Verificar si el producto ya existe en el carrito
        const existingProduct = cart.products.find((item) => item.product.toString() === pid);
        if (existingProduct) {
            existingProduct.quantity += quantity; // Incrementar la cantidad
        } else {
            cart.products.push({ product: pid, quantity }); // Agregar nuevo producto
        }

        await cart.save(); // Guardar cambios en MongoDB
        
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Controlador para eliminar un producto del carrito
const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // Buscar el carrito
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    // Filtrar el producto a eliminar
    const initialLength = cart.products.length;
    cart.products = cart.products.filter(p => p.product.toString() !== pid);

    // Verificar si algo cambió
    if (cart.products.length === initialLength) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito." });
    }

    // Guardar el carrito actualizado
    await cart.save();

    res.status(200).json({
      message: "Producto eliminado del carrito.",
      cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Ruta para eliminar un producto del carrito
router.delete('/:cid/products/:pid', deleteProductFromCart);


// Obtener un carrito por ID con productos poblados
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        // Buscar el carrito y poblar los detalles de los productos
        const cart = await Cart.findById(cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const product = cart.products.find((item) => item.product.toString() === pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        product.quantity = quantity; // Actualizar la cantidad
        await cart.save(); // Guardar cambios en MongoDB
        res.json(cart);
    } catch (error) {
        console.error('Error al actualizar cantidad del producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Vaciar el carrito (eliminar todos los productos)
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        cart.products = []; // Vaciar el carrito
        await cart.save(); // Guardar cambios en MongoDB
        res.status(204).send(); // Éxito sin contenido
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;
