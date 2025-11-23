import express from 'express';
import { signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', (req, res) => {
    // Handle user login
    res.send('Login route');
});

router.post('/signup',signup);

router.get('/logout', (req, res) => {
    // Handle user logout
    res.send('Logout route');
});

export default router;