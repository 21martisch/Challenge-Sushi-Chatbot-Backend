import Product from '../models/Product.js';
import Order from '../models/Order.js';

const rules = [
    { keywords: ['hola'], reply: '¡Hola! Soy tu asistente para pedidos de sushi. ¿Cómo puedo ayudarte hoy? Puedes ver el menú, hacer un pedido, o agregar productos a tu pedido.' },
    {
        keywords: ['finalizar', 'finalizar pedido', 'completar', 'completar mi pedido'],
        dynamic: async (message, userId) => {
            const orders = await Order.find({ userId, status: 'Pendiente' });
            if (orders.length === 0) {
                return 'No tienes pedidos pendientes para finalizar. Si quieres hacer un pedido, simplemente di "quiero" seguido de los productos que deseas.'; 
            }

            const order = orders[0];
            order.status = 'Finalizado';
            await order.save();

            return `Tu pedido de $${order.total} ha sido finalizado con éxito. ¡Gracias por tu compra!`;
        },
    },
    {
        keywords: ['ver pedido', 'mi pedido', 'pedido actual'],
        dynamic: async (message, userId) => {
            const orders = await Order.find({ userId, status: { $in: ['Pendiente', 'Finalizado'] } });
            if (orders.length === 0) {
                return 'No tienes un pedido en curso. Para realizar un pedido, escribe "quiero" y menciona los productos que deseas comprar.';
            }

            const order = orders[0];
            let itemsDetails = [];

            for (const item of order.items) {
                const product = await Product.findOne({ name: item.name });
                const totalPrice = item.quantity * product.price;
                itemsDetails.push(`${item.quantity} x ${item.name} - $${totalPrice}`);
            }

            return `Este es tu pedido actual:\n${itemsDetails.join('\n')}\nTotal: $${order.total}`;
        },
    },
    {
        keywords: ['menu', 'ver el menú'],
        dynamic: async () => {
            const products = await Product.find();
            const menu = products
              .map((p) => `🍣 **${p.name}** - $${p.price}`)
              .join('\n\n');

            return `¡Aquí está nuestro menú! \n\n${menu}\n\nPara hacer un pedido, solo menciona la cantidad y el nombre del producto que deseas, por ejemplo: "Quiero 2 Sake Nigiri".`;
        },
    },
    { keywords: ['pedido', 'hacer un pedido'], reply: 'Para hacer un pedido, solo dime qué productos deseas pedir y en qué cantidad. Ejemplo: "Quiero 1 sushi roll".' },
    { keywords: ['gracias'], reply: '¡De nada! ¿Te gustaría hacer algo más? Puedes ver el menú, agregar productos a tu pedido, o finalizarlo.' },
    { keywords: ['horario', 'abierto'], reply: 'Estamos abiertos todos los días de 11:00 AM a 11:00 PM.' },
    { keywords: ['ubicados', 'direccion', 'lugar', 'donde'], reply: 'Nos encontramos en Corrientes 1100, Ciudad de Rosario.' },
    { keywords: ['contacto', 'teléfono'], reply: 'Puedes contactarnos al (+54) 123-4567.' },
    { keywords: ['Cómo funciona', 'Ayuda'], reply: '¡Claro! Puedes pedir sushi enviando mensajes con el formato "cantidad producto". También puedes ver el menú o finalizar tu pedido.' },
    {
        keywords: ['cuanto cuesta', 'precio'],
        dynamic: async (message) => {
            const products = await Product.find();
            for (const product of products) {
                if (message.includes(product.name.toLowerCase())) {
                    return `${product.name} cuesta $${product.price}.`;
                }
            }
            return 'No encontré el producto que mencionaste. Por favor, revisa el nombre e intenta nuevamente.';
        },
    },
    {
        keywords: ['agregar producto', 'añadir producto', 'agregar al pedido'],
        dynamic: async (message, userId) => {
            const productRegex = /(\d+)\s+([a-zA-Z\s\-]+)/g;
            const itemsToAdd = [];
        
            let match;
            while ((match = productRegex.exec(message)) !== null) {
                const quantity = parseInt(match[1], 10);
                const name = match[2].trim();
        
                const product = await Product.findOne({ name: new RegExp(`^${name}$`, 'i') });
        
                if (product) {
                    itemsToAdd.push({
                        name: product.name,
                        quantity,
                        price: product.price,
                    });
                }
            }
        
            if (itemsToAdd.length === 0) {
                return 'No pude encontrar productos válidos en tu mensaje. Asegúrate de escribir la cantidad seguida del nombre del producto, como "1 Sake Nigiri".';
            }
        
            const order = await Order.findOne({ userId, status: 'Pendiente' });
        
            if (!order) {
                return 'No tienes un pedido pendiente. Para comenzar un nuevo pedido, escribe "quiero" seguido de los productos que deseas pedir.';
            }
        
            order.items.push(...itemsToAdd);

            let newTotal = 0;
            for (const item of order.items) {
                const product = await Product.findOne({ name: new RegExp(`^${item.name}$`, 'i') });
                if (product) {
                    newTotal += item.quantity * product.price;
                }
            }

            order.total = newTotal;
            await order.save();

            return `Los siguientes productos han sido añadidos a tu pedido:\n${itemsToAdd
                .map((item) => `${item.quantity} x ${item.name} - $${item.quantity * item.price}`)
                .join('\n')}\nTotal actualizado: $${order.total}\n\nEscribe "finalizar pedido" cuando quieras completar tu compra.`;
        },
    }
];

export const handleChatMessage = async (req, res) => {
    const { message } = req.body;
    const userId = req.userId || 'guest';
    if (!message) {
        return res.status(400).json({ error: 'Mensaje vacío' });
    }

    try {
        const normalizedMessage = message.toLowerCase();
        const parts = normalizedMessage.split(/[,\.y]/).map((part) => part.trim());
        let reply = '';
        const productRegex = /(\d+)\s+([a-zA-Z\s\-]+)/g;
        let items = [];
        let isNewOrder = false; // Variable para verificar si debe crear un nuevo pedido

        // Verificar si el mensaje contiene la palabra "quiero"
        if (normalizedMessage.includes('quiero')) {
            isNewOrder = true; // Si contiene "quiero", se creará un nuevo pedido
        }

        // Procesamos las partes del mensaje para identificar productos
        for (const part of parts) {
            for (const rule of rules) {
                if (rule.keywords.some((keyword) => part.includes(keyword))) {
                    if (rule.dynamic) {
                        reply += `${await rule.dynamic(part, userId)}\n`;
                    } else {
                        reply += `${rule.reply}\n`;
                    }
                    break;
                }
            }

            let match;
            while ((match = productRegex.exec(part)) !== null) {
                const quantity = parseInt(match[1], 10);
                const name = match[2].trim();
                const product = await Product.findOne({ name: new RegExp(`^${name}$`, 'i') });

                if (product) {
                    items.push({
                        name: product.name,
                        quantity,
                        price: product.price,
                    });
                }
            }
        }

        if (items.length > 0) {
            let order;

            if (isNewOrder) {
                // Si es un pedido nuevo, creamos uno
                order = new Order({
                    userId: userId,
                    items,
                    total: items.reduce((sum, item) => sum + item.quantity * item.price, 0),
                    status: 'Pendiente',
                });
                await order.save();
                reply += `Tu pedido ha sido registrado con éxito:\n${items
                    .map((item) => `${item.quantity} x ${item.name} - $${item.quantity * item.price}`)
                    .join('\n')}\nTotal: $${order.total}\n\nPuede seguir agregando productos o finalizar tu pedido.`;
            } else {
                // Si ya existe un pedido pendiente, agregamos los productos al pedido existente
                order = await Order.findOne({ userId, status: 'Pendiente' });

                if (!order) {
                    return res.status(400).json({ error: 'No tienes un pedido pendiente. Para iniciar un pedido, escribe "quiero".' });
                }

                // Agregar los productos al pedido existente
                order.items.push(...items);

                // Recalcular el total
                let newTotal = 0;
                for (const item of order.items) {
                    const validQuantity = !isNaN(item.quantity) ? item.quantity : 0;

                    // Buscar el producto correspondiente para obtener el precio
                    const product = await Product.findOne({ name: new RegExp(`^${item.name}$`, 'i') });

                    if (product) {
                        const validPrice = !isNaN(product.price) ? product.price : 0;
                        newTotal += validQuantity * validPrice; // Sumar al total
                    }
                }

                // Verificar si el nuevo total es un número válido antes de asignarlo
                if (isNaN(newTotal)) {
                    return res.status(500).json({ error: 'Hubo un error al calcular el total del pedido. Intenta nuevamente.' });
                }

                order.total = newTotal; // Asignar el total recalculado
                await order.save();

                reply += `Los siguientes productos han sido añadidos a tu pedido:\n${items
                    .map((item) => `${item.quantity} x ${item.name} - $${item.quantity * item.price}`)
                    .join('\n')}\nTotal actualizado: $${order.total}\n\nPara finalizar tu pedido, escribe "Finalizar pedido".`;
            }
        }

        if (!reply.trim()) {
            reply = 'No entendí tu mensaje. Por favor, intenta nuevamente.';
        }

        return res.status(200).json({ reply: reply.trim() });
    } catch (err) {
        console.error('Error al procesar el mensaje:', err);
        return res.status(500).json({ error: 'Error al procesar el mensaje' });
    }
};
