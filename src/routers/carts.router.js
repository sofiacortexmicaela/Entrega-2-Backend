import express from 'express';
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

export default router;