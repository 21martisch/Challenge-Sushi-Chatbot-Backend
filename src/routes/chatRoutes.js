import express from 'express';
import { handleChatMessage } from '../controllers/chatController.js';

const router = express.Router();

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Envía un mensaje al chatbot y recibe una respuesta
 *     description: Permite enviar un mensaje de texto al chatbot y obtener una respuesta en función del contexto del pedido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Quiero pedir sushi"
 *     responses:
 *       200:
 *         description: Respuesta del chatbot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: "¿Qué tipo de sushi te gustaría pedir?"
 *       400:
 *         description: Error en la solicitud
 */
router.post('/', handleChatMessage);

export default router;