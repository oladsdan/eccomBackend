import express from 'express';
import { deleteUser, getUser, getallUser, handleRefreshToken, logout, updateUser } from '../controllers/userControllers.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/all-users', getallUser )
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
//get a single user
router.get('/:id', authMiddleware, isAdmin, getUser )
router.delete('/:id', deleteUser)


//for update
// router.put('/:id', authMiddleware, updateUser)
router.put('/edit-user', authMiddleware, updateUser)



export default router