import express from 'express';
import Product from '../models/Product.js'; // Asegúrate de importar el modelo

const router = express.Router();

// Ruta para renderizar productos en la vista
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find(); // Obtén todos los productos de MongoDB
        res.render('products', { products, title: 'Lista de Productos' }); // Renderiza la vista
    } catch (error) {
        res.status(500).send('Error al cargar los productos');
    }
});

export default router;