import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Referencia al modelo Product
            quantity: { type: Number, required: true, min: 1 }, // Cantidad de productos
        },
    ],
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;