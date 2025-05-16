import Cart from '../models/Cart.js';

export const ensureCartExists = async (req, res, next) => {
  if (!req.session.cartId) {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    req.session.cartId = newCart._id.toString();
  }
  next();
};