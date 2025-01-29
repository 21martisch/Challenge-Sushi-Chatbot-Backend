import Product from '../models/Product.js';

export const getMenu = async (req, res) => {
    try {
        const menu = await Product.find();
        res.json(menu);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el menú' });
    }
};