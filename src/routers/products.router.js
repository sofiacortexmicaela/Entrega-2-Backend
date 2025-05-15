import express from 'express';
import Product from '../models/Product.js'; // Asegúrate de importar el modelo

const router = express.Router();  

// Obtener productos con paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        let filter = {};
        if (query) {
            filter = { category: query }; // Filtra por categoría
        }

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined,
        };

        const products = await Product.paginate(filter, options); // Usando mongoose-paginate-v2
        res.json({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.hasPrevPage ? page - 1 : null,
            nextPage: products.hasNextPage ? page + 1 : null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


//Ruta para agregar productos en la base de datos de MongoDB Atlas directo del POSTMAN
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, available, thumbnails } = req.body;

        // Valida que los campos requeridos estén presentes
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
        }

        // Crea un nuevo producto
        const newProduct = new Product({
            title,
            description,
            code,
            price,
            stock,
            category,
            available: available ?? true, // Valor predeterminado: true
            thumbnails: thumbnails || [], // Valor predeterminado: array vacío
        });

        // Guarda el producto en la base de datos
        const savedProduct = await newProduct.save();

        res.status(201).json({ status: 'success', product: savedProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Ruta para eliminar un producto por su ID directo del POSTMAN
router.delete('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid, 10);
        await productManager.deleteProduct(pid);ñ
        res.status(204).send(); // Sin contenido
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(404).json({ error: error.message });
    }
});

export default router;

/*import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Crear equivalente de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// archivo JSON
const productManager = new ProductManager(path.join(__dirname, '../data/products.json'));

/* --------------------RUTAS PARA VISTAS (HTML)-----------------------------

// Ruta para renderizar la vista de productos
router.get('/view', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('products', { products, title: 'Lista de Productos' });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al cargar los productos');
    }
});

/*---------------RUTAS PARA API (JSON)----------------------- 

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products); // Devuelve los productos en formato JSON
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Ruta para obtener un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid, 10);
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: `Producto con ID ${pid} no encontrado.` });
        }
        res.json(product);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;

        // Validar que los campos obligatorios estén presentes
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos requeridos deben estar completos.' });
        }

        const newProduct = await productManager.addProduct({
            title,
            description,
            code,
            price,
            status: status !== undefined ? status : true, //true
            stock,
            category,
            thumbnails: thumbnails || [], // arreglo vacio?
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(400).json({ error: error.message });
    }
});

// Ruta para actualizar un producto existente
router.put('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid, 10);
        const updateFields = req.body;

        // Evitar la actualización del ID
        if (updateFields.id) {
            return res.status(400).json({ error: 'No se puede modificar el ID del producto.' });
        }

        const updatedProduct = await productManager.updateProduct(pid, updateFields);
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(404).json({ error: error.message });
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid, 10);
        await productManager.deleteProduct(pid);ñ
        res.status(204).send(); // Sin contenido
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(404).json({ error: error.message });
    }
});

export default router;*/