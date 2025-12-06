import { MongoClient, MongoClientOptions } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const dbName = process.env.DB_NAME || 'sec_trace'

class Database {
  private client: MongoClient
  private static instance: Database

  private constructor() {
    // 添加连接选项，包括验证和安全设置
    const options: MongoClientOptions = {
      // 启用SSL/TLS加密连接
      tls: process.env.MONGODB_TLS === 'true' || false,

      // 连接超时设置
      connectTimeoutMS: (process.env.MONGODB_CONNECT_TIMEOUT ? parseInt(process.env.MONGODB_CONNECT_TIMEOUT) : undefined) || 10000,
      serverSelectionTimeoutMS: (process.env.MONGODB_SERVER_SELECTION_TIMEOUT ? parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT) : undefined) || 5000,

      // 自动重连设置
      retryWrites: true,
      retryReads: true,

      // 认证机制
      authMechanism: process.env.MONGODB_AUTH_MECHANISM as any || 'SCRAM-SHA-256',

      // 连接池设置
      maxPoolSize: (process.env.MONGODB_MAX_POOL_SIZE ? parseInt(process.env.MONGODB_MAX_POOL_SIZE) : undefined) || 10,
      minPoolSize: (process.env.MONGODB_MIN_POOL_SIZE ? parseInt(process.env.MONGODB_MIN_POOL_SIZE) : undefined) || 1,
    };

    // 如果提供了用户名和密码，则添加认证信息
    if (process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD) {
      options.auth = {
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD
      };
    }

    // this.client = new MongoClient(uri, options) //提交时取消注释，要运行时添加
    this.client = new MongoClient(uri) //运行时取消注释，要提交时删除
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
      // 验证连接是否成功
      await this.client.db(dbName).command({ ping: 1 });
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