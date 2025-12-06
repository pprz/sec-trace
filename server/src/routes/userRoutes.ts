import { Hono } from 'hono'
import { UserController } from '../controllers/UserController'
import { UserModel } from '../models/User'
import bcrypt from 'bcrypt'
import { adminUser } from '../middleware/authMiddleware'
const userRoutes = new Hono()
const userController = new UserController()

userRoutes.use('*', adminUser);

userRoutes.get('/', userController.getAllUsers)
userRoutes.get('/:id', userController.getUserById)
userRoutes.post('/', userController.createUser)
userRoutes.put('/:id', userController.updateUser)
userRoutes.delete('/:id', userController.deleteUser)

export default userRoutes