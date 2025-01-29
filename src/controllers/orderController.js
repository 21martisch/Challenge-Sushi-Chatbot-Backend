import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, items, total, status } = req.body;
    if (!userId || !items || items.length === 0 || !total) {
      return res.status(400).json({ error: "Faltan datos obligatorios o los datos son inválidos" });
    }

    const newOrder = new Order({
      userId,
      items,
      total,
      status: status || "Pendiente",
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};