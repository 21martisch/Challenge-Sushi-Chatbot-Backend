import express from 'express';
import { getMenu } from '../controllers/menuController.js';

const router = express.Router();

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Obtiene el menú de sushi
 *     description: Retorna una lista de todos los productos disponibles en el menú.
 *     responses:
 *       200:
 *         description: Lista del menú obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "65a9b1c5d3e2a5f1b4e5a7c8"
 *                   name:
 *                     type: string
 *                     example: "Sushi Roll Especial"
 *                   description:
 *                     type: string
 *                     example: "Rollo de sushi con salmón, aguacate y queso crema"
 *                   price:
 *                     type: number
 *                     example: 12.50
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', getMenu);

export default router;