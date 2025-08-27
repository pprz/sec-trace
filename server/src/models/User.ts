import { Db, Collection } from 'mongodb'
import Database from '../config/db'

export interface User {
  id?: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export class UserModel {
  private db: Db
  private collection: Collection<User>

  constructor() {
    this.db = Database.getInstance().getDb()
    this.collection = this.db.collection<User>('users')
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date()
    const newUser: User = {
      ...user,
      createdAt: now,
      updatedAt: now
    }

    const result = await this.collection.insertOne(newUser as any)
    return {
      ...newUser,
      id: result.insertedId.toString()
    }
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.collection.findOne({ _id: { $oid: id } })
    return user ? { ...user, id: user._id.toString() } as User : null
  }

  async findAll(): Promise<User[]> {
    const users = await this.collection.find({}).toArray()
    return users.map(user => ({
      ...user,
      id: user._id.toString()
    }))
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: { $oid: id } },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )

    if (!result.ok || !result.value) {
      return null
    }

    return {
      ...result.value,
      id: result.value._id.toString()
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: { $oid: id } })
    return result.deletedCount === 1
  }
}