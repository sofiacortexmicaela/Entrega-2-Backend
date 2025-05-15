import express from 'express';
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';
import viewsRouter from './routers/views.router.js';
import { engine } from 'express-handlebars';
import __dirname from './utils.js';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import ProductManager from './managers/ProductManager.js';
import methodOverride from 'method-override'; 
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

// Verificar si MONGO_URI se está cargando correctamente
console.log("MONGO_URI desde .env:", process.env.MONGO_URI)

// servidor
const app = express(); 
const port = 8080;
const server = http.createServer(app);
const io = new Server(server);

// Middleware para parsear JSON y datos de formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para soportar otros métodos HTTP (DELETE, PUT) a través de _method
app.use(methodOverride('_method'));

//la ruta para el nageador 
app.use('/', viewsRouter);

// Handlebars
app.engine(
    'handlebars',
    engine({
        extname: '.handlebars',
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, 'views/layouts'),
        partialsDir: path.join(__dirname, 'views/partials'),
        runtimeOptions: {
            allowProtoPropertiesByDefault: true, // Permitir acceso a propiedades del prototipo
            allowProtoMethodsByDefault: true,   // Permitir acceso a métodos del prototipo (opcional)
        },
    })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para la vista products
app.get('/products', async (req, res) => {
    const productManager = new ProductManager(path.join(__dirname, 'data', 'products.json'));
    const products = await productManager.getProducts(); // Obtener productos desde el archivo
    res.render('products', { products, title: 'Lista de Productos' }); // Renderizar la vista
});

// Ruta para vista realTimeProducts
app.get('/realTimeProducts', async (req, res) => {
    const productManager = new ProductManager(path.join(__dirname, 'data', 'products.json'));
    const products = await productManager.getProducts(); // Asegúrate de obtener los productos correctamente
    res.render('realtimeProducts', { products, title: 'Productos en Tiempo Real' }); // Pasar productos a la vista
});

// Socket.IO configuración
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado.');

    // Enviar la lista de productos al cliente
    const productManager = new ProductManager(path.join(__dirname, 'data', 'products.json'));
    productManager.getProducts().then((products) => {
        socket.emit('productList', products);
    });

    // Escuchar nuevos productos
    socket.on('addProduct', async (product) => {
        try {
            await productManager.addProduct(product); // Agregar producto
            const products = await productManager.getProducts();
            io.emit('productList', products); // Actualizar la lista para todos los clientes
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });
    // Escuchar eliminación de productos
    socket.on('deleteProduct', async (productId) => {
        try {
            console.log(`Intentando eliminar producto con ID: ${productId}`);
            await productManager.deleteProduct(productId); // Eliminar producto
            const products = await productManager.getProducts();
            io.emit('productList', products); // Actualizar la lista para todos los clientes
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
        }
    })
});

// Iniciar el servidor
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conexión a MongoDB Atlas exitosa'))
    .catch(err => console.error('Error al conectar a MongoDB Atlas:', err.message));   