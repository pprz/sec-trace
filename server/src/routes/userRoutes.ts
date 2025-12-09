import { Hono } from 'hono'
import { UserController } from '../controllers/UserController'
import { UserModel } from '../models/User'
import bcrypt from 'bcrypt'
import { adminUser } from '../middleware/authMiddleware'
const userRoutes = new Hono()
const userController = new UserController()

// userRoutes.use('*', adminUser); //提交安全审计时需取消注释

userRoutes.get('/', userController.getAllUsers)
userRoutes.get('/:id', userController.getUserById)
userRoutes.post('/', userController.createUser)
userRoutes.put('/:id', userController.updateUser)
userRoutes.delete('/:id', userController.deleteUser)
//提交安全审计时删除该方法
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
                console.log(`用户 ${user.username} 的初始密码哈希:`, hashedPassword)
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