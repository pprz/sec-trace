import { Context } from 'hono'
import { User, UserModel } from '../models/User'

export class UserController {
  private userModel: UserModel

  constructor() {
    this.userModel = new UserModel()
  }

  getAllUsers = async (c: Context) => {
    try {
      const users = await this.userModel.findAll()
      return c.json({ users })
    } catch (error) {
      console.error('Error fetching users:', error)
      return c.json({ error: 'Failed to fetch users' }, 500)
    }
  }

  getUserById = async (c: Context) => {
    try {
      const id = c.req.param('id')
      const user = await this.userModel.findById(id)

      if (!user) {
        return c.json({ error: 'User not found' }, 404)
      }

      return c.json({ user })
    } catch (error) {
      console.error('Error fetching user:', error)
      return c.json({ error: 'Failed to fetch user' }, 500)
    }
  }

  createUser = async (c: Context) => {
    try {
      const body = await c.req.json()
      const user = await this.userModel.create(body)
      return c.json({ user }, 201)
    } catch (error) {
      console.error('Error creating user:', error)
      return c.json({ error: 'Failed to create user' }, 500)
    }
  }

  updateUser = async (c: Context) => {
    try {
      const id = c.req.param('id')
      const body = await c.req.json()
      const user = await this.userModel.update(id, body)

      if (!user) {
        return c.json({ error: 'User not found' }, 404)
      }

      return c.json({ user })
    } catch (error) {
      console.error('Error updating user:', error)
      return c.json({ error: 'Failed to update user' }, 500)
    }
  }

  deleteUser = async (c: Context) => {
    try {
      const id = c.req.param('id')
      const deleted = await this.userModel.delete(id)

      if (!deleted) {
        return c.json({ error: 'User not found' }, 404)
      }

      return c.json({ message: 'User deleted successfully' })
    } catch (error) {
      console.error('Error deleting user:', error)
      return c.json({ error: 'Failed to delete user' }, 500)
    }
  }
}