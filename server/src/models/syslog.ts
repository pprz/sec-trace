import { Db, Collection } from 'mongodb'
import Database from '../config/db'

export interface FaultLog {
  id?: string
  occurrence: string
  assetIP: string
  attackerIP: string
  level1Type: string
  level2Type: string
  attackResult: string
  threatLevel: string
  threatName: string
  eventNamet:string
  safety: string
  disposalstatus: string
  terminalDetails: string
  payload?: string
  requestHeader?: string
  responseHeader?: string
  responseBody?: string
  createdAt?: Date
  updatedAt?: Date
}

export class FaultLogModel {
  private db: Db
  private collection: Collection<FaultLog>

  constructor() {
    this.db = Database.getInstance().getDb()
    this.collection = this.db.collection<FaultLog>('faultLogs')
  }

  async create(faultLog: Omit<FaultLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<FaultLog> {
    const now = new Date()
    const newFaultLog: FaultLog = {
      ...faultLog,
      createdAt: now,
      updatedAt: now
    }

    const result = await this.collection.insertOne(newFaultLog as any)
    return {
      ...newFaultLog,
      id: result.insertedId.toString()
    }
  }

  async findById(id: string): Promise<FaultLog | null> {
    const faultLog = await this.collection.findOne({ _id: { $oid: id } })
    return faultLog ? { ...faultLog, id: faultLog._id.toString() } as FaultLog : null
  }

  async findAll(): Promise<FaultLog[]> {
    const faultLogList = await this.collection.find({}).toArray()
    return faultLogList.map(item => ({
      ...item,
      id: item._id.toString()
    }))
  }

  async findByAssetIP(assetIP: string): Promise<FaultLog[]> {
    const faultLogList = await this.collection.find({ assetIP }).toArray()
    return faultLogList.map(item => ({
      ...item,
      id: item._id.toString()
    }))
  }

  async findByAttackerIP(attackerIP: string): Promise<FaultLog[]> {
    const faultLogList = await this.collection.find({ attackerIP }).toArray()
    return faultLogList.map(item => ({
      ...item,
      id: item._id.toString()
    }))
  }

  async findByThreatLevel(threatLevel: string): Promise<FaultLog[]> {
    const faultLogList = await this.collection.find({ threatLevel }).toArray()
    return faultLogList.map(item => ({
      ...item,
      id: item._id.toString()
    }))
  }

  async update(id: string, updates: Partial<FaultLog>): Promise<FaultLog | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: { $oid: id } },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )

    if (!result || !result?.ok || !result?.value) {
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
