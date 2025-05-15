import Cart from '../models/Cart.js'; 
import Product from '../models/Product.js'; 

export const addToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params; // Obtener el ID del carrito y del producto
    const { quantity = 1 } = req.body; // Leer la cantidad del cuerpo de la solicitud
    
    // Verificar que el producto existe
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    // Buscar el carrito
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado.' });
    }

    // Verificar si el producto ya está en el carrito
    const productInCart = cart.products.find((p) => p.product.equals(pid));
    if (productInCart) {
      // Si ya existe, actualizar la cantidad
      productInCart.quantity += parseInt(quantity);
    } else {
      // Si no existe, agregarlo al carrito
      cart.products.push({ product: pid, quantity });
    }

    // Guardar el carrito actualizado
    await cart.save();
    res.status(200).json({ message: 'Producto agregado al carrito correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// Obtener un carrito por su ID y mostrar los productos poblados
export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;

    // Buscar el carrito y poblar los detalles de los productos
    const cart = await Cart.findById(cid).populate('products.product'); // Usar .populate()
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    // Responder con el carrito y sus productos poblados
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/*Vaciar el carrito por su ID
export const emptyCart = async (req, res) => {
  try {
    const { cid } = req.params;

    // Buscar el carrito por su ID
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    // Vaciar el array de productos
    cart.products = [];

    // Guardar el carrito actualizado
    await cart.save();

    res.status(200).json({ message: "Carrito vaciado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};*/

/*import Cart from '../models/Cart.js'; // importar modelo de carrito

export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;

    //buscar el carrito y poblar los detalles de los productos
    const cart = await Cart.findById(cid).populate('products.product'); // usar .populate()
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    // Vaciar el array de productos
    cart.products = [];

    // Guardar el carrito actualizado
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};*/


//-----------------------------RUTAS PARA POSTMAN--------------------------------//
//Eliminar un producto del carrito (DELETE /api/carts/:cid/products/:pid)

export const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.products = cart.products.filter((item) => item.product.toString() !== pid);
    await cart.save();

    res.status(200).json({ message: 'Producto eliminado del carrito', cart });
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
//Actualizar todos los productos del carrito (PUT /api/carts/:cid)
export const updateCartProducts = async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.products = products;
    await cart.save();

    res.status(200).json({ message: 'Productos del carrito actualizados', cart });
  } catch (error) {
    console.error('Error al actualizar productos del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
//Actualizar la cantidad de un producto (PUT /api/carts/:cid/products/:pid)
export const updateProductQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const productIndex = cart.products.findIndex((item) => item.product.toString() === pid);
    if (productIndex === -1) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({ message: 'Cantidad de producto actualizada', cart });
  } catch (error) {
    console.error('Error al actualizar cantidad del producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//Vaciar el carrito completo (DELETE /api/carts/:cid)
export const emptyCart = async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();

    res.status(200).json({ message: 'Carrito vaciado correctamente', cart });
  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};