import express from 'express';
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth,
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();
console.log('Registering  post /signup');
router.post('/signup', signup);
console.log('Registering  post /login');
router.post('/login', login);
console.log('Registering  post /logout');
router.post('/logout', logout);
console.log('Registering  put /update-profile');
router.put('/update-profile', protectRoute, updateProfile);
console.log('Registering  get /check');
router.get('/check', protectRoute, checkAuth);

export default router;
