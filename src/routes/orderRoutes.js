import express from 'express';
import { createOrder } from '../controllers/orderController.js';

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crea un nuevo pedido de sushi
 *     description: Permite crear un pedido con una lista de productos seleccionados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 example: "Juan Pérez"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "65a9b1c5d3e2a5f1b4e5a7c8"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               total:
 *                 type: number
 *                 example: 25.50
 *     responses:
 *       201:
 *         description: Pedido creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: string
 *                   example: "659c1b9ad4f8e8a3c1a7b9c3"
 *                 message:
 *                   type: string
 *                   example: "Pedido realizado con éxito"
 *       400:
 *         description: Error en la solicitud (datos incorrectos)
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', createOrder);

export default router;