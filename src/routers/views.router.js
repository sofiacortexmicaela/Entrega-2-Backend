import express from 'express';
import Product from '../models/Product.js'; // Asegúrate de importar el modelo

const router = express.Router();

// Ruta para renderizar productos en la vista
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();

        const cartId = '6823fdd3887121ec049d71f2'; // <-- ObjectId válido de tu base de datos

        res.render('products', {
            products,
            title: 'Lista de Productos',
            cartId
        });
    } catch (error) {
        res.status(500).send('Error al cargar los productos');
    }
});


// Ruta para renderizar el detalle de un producto
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).render('error', { message: 'Producto no encontrado' });
        }

        res.render('productDetail', {
            title: `Detalle de ${product.title}`,
            product
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).render('error', { message: 'Error del servidor' });
    }
});

export default router;