import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'; // Importa el plugin de paginación

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    available: { type: Boolean, default: true },
    thumbnails: { type: [String], default: [] },
}, { timestamps: true });

// Agrega el plugin de paginación al esquema
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;