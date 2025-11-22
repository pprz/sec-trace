import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const dbName = process.env.DB_NAME || 'sec_trace'

class Database {
  private client: MongoClient
  private static instance: Database

  private constructor() {
    this.client = new MongoClient(uri)
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect()
      console.log('Connected to MongoDB')
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error)
      process.exit(1)
    }
  }

  public getDb() {
    return this.client.db(dbName)
  }

  public async close(): Promise<void> {
    await this.client.close()
  }
}

export default Database