import { v4 as uuidv4 } from 'uuid';

export const assignUserId = (req, res, next) => {
    const storedUserId = req.body.userId; 
    if (!storedUserId) {
        const newUserId = uuidv4(); 
        res.cookie('userId', newUserId, { 
            httpOnly: true, 
            maxAge: 60 * 60 * 1000,
            sameSite: 'None',
            secure: true
        });
        req.userId = newUserId;
        console.log("Nuevo userId asignado:", req.userId);
    } else {
        req.userId = storedUserId;
    }
    
    next();
};