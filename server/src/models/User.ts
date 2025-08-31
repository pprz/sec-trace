import { Db, Collection, ObjectId, WithId } from 'mongodb'
import Database from '../config/db'
import bcrypt from 'bcrypt'
// 用户基础接口（不含ID和时间戳）
export interface UserBase {
  username: string
  password: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

// 完整用户接口（包含ID）
export interface User extends UserBase {
  id?: string
}

// 扩展UserModel实现密码哈希和用户创建
export class UserModel {
  private db: Db
  private collection: Collection<User>

  constructor() {
    this.db = Database.getInstance().getDb()
    this.collection = this.db.collection<User>('users')
    this.createIndexes()
  }

  // 创建唯一索引
  private async createIndexes() {
    await this.collection.createIndex({ username: 1 }, { unique: true })
  }

  // 创建新用户
  async create(userData: Omit<UserBase, 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date()
    const hashedPassword = await this.hashPassword(userData.password)

    const newUser: User = {
      ...userData,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now
    }

    const result = await this.collection.insertOne(newUser)
    return {
      ...newUser,
      id: result.insertedId.toString()
    }
  }

  // 密码哈希方法
  private async hashPassword(password: string): Promise<string> {
    // 使用bcrypt进行密码哈希处理
    const saltRounds = 10
    const hashed = await bcrypt.hash(password, saltRounds)
    return hashed
  }

  // 根据用户名查找用户
  async findByUsername(username: string): Promise<User | null> {
    // 添加用户名格式验证
    if (!username || typeof username !== 'string') {
      return null;
    }
    
    const user = await this.collection.findOne({ username });
    if (!user) {
      return null;
    }
    
    return {
      ...user,
      id: user._id.toString()
    };
  }

  // 修改findById方法，添加id格式验证
  async findById(id: string): Promise<User | null> {
    // 添加24位十六进制字符串验证
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return null;
    }
    
    const user = await this.collection.findOne({ _id: new ObjectId(id) })
    return user ? { ...user, id: user._id.toString() } as User : null
  }

  async findAll(): Promise<User[]> {
    const users = await this.collection.find({}).toArray()
    return users.map(user => ({
      ...user,
      id: user._id.toString()
    }))
  }

  // 修改update方法，添加id格式验证
  async update(id: string, updates: Partial<User>): Promise<User | null> {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return null;
    }
    
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )

    if (!result) {
      return null;
    }

    return {
      ...result as User,
      id: result._id.toString()
    }
  }

  // 修改delete方法，添加id格式验证
  async delete(id: string): Promise<boolean> {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return false;
    }
    
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
  }
}