import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js'; 

const router = express.Router();


//------------------RUTAS PARA PRODUCTOS-------------------------------//

// Ruta para agregar productos a ese carrito 
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


// Ruta para mostrar detalle de un producto
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

/*----------------------------------------------------//
router.post('/add-to-cart/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;

        let cartId = req.session.cartId;
        let cart;

        // Si no hay carrito, crear uno nuevo
        if (!cartId) {
            const newCart = new Cart({ products: [] });
            const savedCart = await newCart.save();
            cartId = savedCart._id.toString();
            req.session.cartId = cartId;
            cart = savedCart;
        } else {
            cart = await Cart.findById(cartId);
        }

        // ver si el producto ya está en el carrito
        const existing = cart.products.find(p => p.product.toString() === productId);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();

        res.redirect(`/carts/${cart._id}`);
    } catch (error) {
        console.error('Error al agregar producto desde vista:', error);
        res.status(500).send('Error al agregar producto al carrito');
    }
});*/
router.post('/add-to-cart/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;

        let cartId = req.session.cartId;
        let cart;

        // Si no hay carrito en la sesión, creamos uno nuevo
        if (!cartId) {
            const newCart = new Cart({ products: [] });
            const savedCart = await newCart.save();
            cartId = savedCart._id.toString();
            req.session.cartId = cartId;
            cart = savedCart;
        } else {
            cart = await Cart.findById(cartId);
            if (!cart) {
                // Si el carrito guardado ya no existe (ej: fue eliminado), crear uno nuevo
                const newCart = new Cart({ products: [] });
                const savedCart = await newCart.save();
                cartId = savedCart._id.toString();
                req.session.cartId = cartId;
                cart = savedCart;
            }
        }

        // Buscar si el producto ya existe en el carrito
        const existingProduct = cart.products.find(item => item.product.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();

        res.redirect(`/carts/${cartId}`);
    } catch (error) {
        console.error('Error al agregar producto desde vista:', error);
        res.status(500).send('Error al agregar producto al carrito');
    }
});
//-----------------
router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).populate('products.product');

        if (!cart) return res.status(404).send('Carrito no encontrado');

        res.render('cartView', {
            title: 'Tu carrito',
            cart
        });
    } catch (error) {
        console.error('Error al mostrar el carrito:', error);
        res.status(500).send('Error del servidor');
    }
});

router.get('/datosDeCompra', (req, res) => {
    const cartId = req.session.cartId;

    if (!cartId) {
        return res.redirect('/products');
    }

    res.render('checkout', {
        title: 'Finalizar compra',
        cartId
    });
});

//-------------Ruta para que cuando el cliete toque boton finalizar compra, se------------------//
//-------------------cierre el carrito y lo rediriga a /products--------------------------//
router.post('/procesarCompra', async (req, res) => {
    try {
        const { nombre, email, direccion, cartId } = req.body;

        // Obtener y vaciar el carrito
        const cart = await Cart.findById(cartId).populate('products.product');
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        // Simular procesamiento (acá podrías enviar un correo real)
        console.log(`Compra realizada por ${nombre} ${email}>`);
        console.log(`Enviando a: ${direccion}`);
        console.log(`Productos:`, cart.products.map(p => ({
            nombre: p.product.title,
            cantidad: p.quantity
        })));

        // Vaciar el carrito
        cart.products = [];
        await cart.save();

        // Eliminar el carrito de la sesión
        req.session.cartId = null;

        // Redirigir a productos con un mensaje flash si querés
        res.redirect('/products');
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).send('Error al finalizar la compra');
    }
});


export default router;