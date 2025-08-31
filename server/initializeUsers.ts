import { UserModel } from './src/models/User.ts'
import bcrypt from 'bcrypt'

async function initializeUsers() {
  try {
    const userModel = new UserModel()

    // 定义初始用户数据
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

    // 批量插入用户
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

    // 使用insertMany进行批量插入
    const result = await userModel['collection'].insertMany(hashedUsers);

    console.log(`成功插入 ${result.insertedCount} 个用户：`)

    // 使用insertedIds获取插入的用户ID并查询文档
    const insertedIds = Object.values(result.insertedIds);
    for (let i = 0; i < insertedIds.length; i++) {
      const user = await userModel.findById(insertedIds[i].toString());
      if (user) {
        console.log(`用户 ${i + 1}: ${user.username}, ID: ${user.id}`)
      }
    }

    process.exit(0)
  } catch (error) {
    console.error('初始化用户失败:', error)
    process.exit(1)
  }
}

// 执行脚本
initializeUsers()