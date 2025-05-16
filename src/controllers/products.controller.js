import Product from '../models/Product.js'; 

// Obtener productos con paginación, filtros y ordenamiento
export const getProductsWithPagination = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = query ? { category: query } : {};
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
    };

    const products = await Product.paginate(filter, options);
    res.render('products', {
      products: products.docs,
      totalPages: products.totalPages,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      cartId: 'yourCartId', // Reemplazar con el ID del carrito actual
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos.');
  }
};

//--------------------------------------------------------------------------------//
// Agregar un nuevo producto a la base de datos
export const addProduct = async (req, res) => {
  try {
    const { title, description, code, price, stock, category } = req.body;

    // Crear un nuevo producto
    const newProduct = new Product({ title, description, code, price, stock, category });
    await newProduct.save();

    // Redirigir a la lista de productos después de agregar
    res.redirect('/products');
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    res.status(500).send('Error al agregar el producto.');
  }
};

// Obtener productos y renderizar la vista products.handlebars
export const getProducts = async (req, res) => {
  try {
    // Obtener todos los productos de MongoDB
    const products = await Product.find().lean();

    // Convertir los productos en objetos planos para Handlebars
    const plainProducts = products.map((product) => product.toObject());

    // Renderizar la vista y pasar los productos
    res.render('products', {
      title: 'Lista de Productos',
      products: plainProducts, // Pasar productos planos
    });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).send('Error al obtener los productos.');
  }
  
};

export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params; // Asegúrate de que el ID venga de req.params
    await Product.findByIdAndDelete(pid);

    // Redirigir al usuario de vuelta a la lista de productos
    res.redirect('/products');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto.' });
  }
};