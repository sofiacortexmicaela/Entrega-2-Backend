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
        res.json(cart);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/*Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        cart.products = cart.products.filter((item) => item.product.toString() !== pid); // Quitar el producto
        await cart.save(); // Guardar cambios en MongoDB
        res.status(204).send(); // Éxito sin contenido
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});*/

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

/*import express from 'express';
import CartManager from '../managers/CartManager.js'; 

const router = express.Router(); // Crear una instancia del router
//json
const cartManager = new CartManager('./data/carts.json'); 

// Exporta el router para usarlo en otros archivos 

// Ruta para obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts(); // Obtener todos los carritos
        res.json(carts); // Enviar los carritos como respuesta
    } catch (error) {
        console.error('Error al obtener los carritos:', error);
        res.status(500).json({ error: 'Error al obtener los carritos.' });
    }
}); 

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart(); // Crea un carrito vacío
        res.status(201).json(newCart); // Devuelve el carrito creado
    } catch (error) {
        console.error('Error al crear el carrito:', error); // Agrega este log
        res.status(500).json({ error: 'Error al crear el carrito.' });
    }
});

// Ruta para obtener los productos de un carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid, 10); // Convierte el ID del carrito a número
        if (isNaN(cid)) {
            return res.status(400).json({ error: 'ID de carrito inválido.' });
        }

        const cart = await cartManager.getCartById(cid); // Obtiene el carrito por ID
        if (!cart) {
            return res.status(404).json({ error: `Carrito con ID ${cid} no encontrado.` });
        }

        res.json(cart); // Devuelve los productos del carrito
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito.' });
    }
});

// Ruta para agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid, 10); // Convierte el ID del carrito a número
        const pid = parseInt(req.params.pid, 10); // Convierte el ID del producto a número

        if (isNaN(cid) || isNaN(pid)) {
            return res.status(400).json({ error: 'ID de carrito o producto inválido.' });
        }

        const updatedCart = await cartManager.addProductToCart(cid, pid); // Agrega el producto al carrito
        res.status(200).json(updatedCart); // Devuelve el carrito actualizado
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;*/