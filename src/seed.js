import mongoose from "mongoose";
import Product from "./models/Product.js";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedMenu = async () => {
  const items = [
    { name: "California Roll", description: "Roll clásico", price: 1200, category: "Rolls" },
    { name: "Sake Nigiri", description: "Nigiri de salmón", price: 900, category: "Nigiri" },
    { name: "Coca-Cola", description: "Bebida refrescante", price: 500, category: "Bebidas" },
    { name: "Tuna Roll", description: "Roll con atún fresco", price: 1400, category: "Rolls" },
    { name: "Avocado Nigiri", description: "Nigiri con aguacate", price: 950, category: "Nigiri" },
    { name: "Sprite", description: "Bebida gaseosa", price: 500, category: "Bebidas" },
    { name: "Tempura Roll", description: "Roll con camarones tempura", price: 1600, category: "Rolls" },
    { name: "Ebi Nigiri", description: "Nigiri de camarón", price: 1050, category: "Nigiri" },
    { name: "Green Tea", description: "Té verde tradicional", price: 300, category: "Bebidas" },
    { name: "Spicy Tuna Roll", description: "Roll con atún picante", price: 1450, category: "Rolls" },
    { name: "Salmon Sashimi", description: "Sashimi de salmón", price: 1800, category: "Sashimi" },
    { name: "Miso Soup", description: "Sopa de miso tradicional", price: 400, category: "Aperitivos" },
    { name: "Wasabi", description: "Condimento picante", price: 200, category: "Acompañantes" },
    { name: "Gyoza", description: "Empanaditas japonesas", price: 800, category: "Aperitivos" },
  ];

  await Product.insertMany(items);
  console.log("Datos cargados exitosamente.");
  mongoose.connection.close();
};

seedMenu();
