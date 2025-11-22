import { Hono } from 'hono'
import { UserController } from '../controllers/UserController'
import { UserModel } from '../models/User'
import bcrypt from 'bcrypt'
const userRoutes = new Hono()
const userController = new UserController()

userRoutes.get('/', userController.getAllUsers)
userRoutes.get('/:id', userController.getUserById)
userRoutes.post('/', userController.createUser)
userRoutes.put('/:id', userController.updateUser)
userRoutes.delete('/:id', userController.deleteUser)

// 修改用户初始化API路由，确保插入的用户ID格式正确
userRoutes.post('/initialize', async (c) => {
  try {
    const userModel = new UserModel()
    // 重用initializeUsers.ts中的用户数据
    const users = [
      {
        username: 'admin',
        password: 'Admin123456@',
        name: '系统管理员',
        email: 'admin@example.com'
      },
      {
        username: 'user',
        password: 'Admin123456@',
        name: '普通用户',
        email: 'user@example.com'
      }
    ]

    // 批量插入用户时让MongoDB自动生成正确的ObjectId
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10)
        const now = new Date()
        return {
          ...user,
          password: hashedPassword,
          createdAt: now,
          updatedAt: now
        }
      })
    )

    const result = await userModel['collection'].insertMany(hashedUsers)
    
    // 添加延迟确保数据写入
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return c.json({
      success: true,
      insertedCount: result.insertedCount,
      ids: Object.values(result.insertedIds).map(id => id.toString())
    })
  } catch (error) {
    console.error('用户初始化失败:', error)
    return c.json({ success: false, error: '初始化用户失败' }, 500)
  }
})

export default userRoutes