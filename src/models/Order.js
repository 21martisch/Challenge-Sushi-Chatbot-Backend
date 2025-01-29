import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  status: { type: String, default: "Pendiente" },
});

export default mongoose.model("Order", orderSchema);
