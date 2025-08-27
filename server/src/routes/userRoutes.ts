import { Hono } from 'hono'
import { UserController } from '../controllers/UserController'

const userRoutes = new Hono()
const userController = new UserController()

userRoutes.get('/', userController.getAllUsers)
userRoutes.get('/:id', userController.getUserById)
userRoutes.post('/', userController.createUser)
userRoutes.put('/:id', userController.updateUser)
userRoutes.delete('/:id', userController.deleteUser)

export default userRoutes