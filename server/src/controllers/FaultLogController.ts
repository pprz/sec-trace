import { Context } from 'hono'
import { FaultLogModel } from '../models/FaultLog'
import faultData from './faultData'
import newFaultData from './newFaultData'


export class FaultLogController {
  private faultLogModel: FaultLogModel

  constructor() {
    this.faultLogModel = new FaultLogModel()
  }

  getAllFaultLogs = async (c: Context) => {
    try {
      const faultLogList = await this.faultLogModel.findAll()
      return c.json({ faultLogs: faultLogList })
    } catch (error) {
      console.error('Error fetching fault logs:', error)
      return c.json({ error: 'Failed to fetch fault logs' }, 500)
    }
  }

  getFaultLogById = async (c: Context) => {
    try {
      const id = c.req.param('id')
      const faultLog = await this.faultLogModel.findById(id)

      if (!faultLog) {
        return c.json({ error: 'Fault log not found' }, 404)
      }

      return c.json({ faultLog })
    } catch (error) {
      console.error('Error fetching fault log:', error)
      return c.json({ error: 'Failed to fetch fault log' }, 500)
    }
  }

  getFaultLogsByAssetIP = async (c: Context) => {
    try {
      const assetIP = c.req.param('assetIP')
      const faultLogList = await this.faultLogModel.findByAssetIP(assetIP)
      return c.json({ faultLogs: faultLogList })
    } catch (error) {
      console.error('Error fetching fault logs by asset IP:', error)
      return c.json({ error: 'Failed to fetch fault logs' }, 500)
    }
  }

  getFaultLogsByAttackerIP = async (c: Context) => {
    try {
      const attackerIP = c.req.param('attackerIP')
      const faultLogList = await this.faultLogModel.findByAttackerIP(attackerIP)
      return c.json({ faultLogs: faultLogList })
    } catch (error) {
      console.error('Error fetching fault logs by attacker IP:', error)
      return c.json({ error: 'Failed to fetch fault logs' }, 500)
    }
  }

  getFaultLogsByThreatLevel = async (c: Context) => {
    try {
      const threatLevel = c.req.param('threatLevel')
      const faultLogList = await this.faultLogModel.findByThreatLevel(threatLevel)
      return c.json({ faultLogs: faultLogList })
    } catch (error) {
      console.error('Error fetching fault logs by threat level:', error)
      return c.json({ error: 'Failed to fetch fault logs' }, 500)
    }
  }

  createFaultLog = async (c: Context) => {
    try {
      const body = await c.req.json()
      const faultLog = await this.faultLogModel.create(body)
      return c.json({ faultLog }, 201)
    } catch (error) {
      console.error('Error creating fault log:', error)
      return c.json({ error: 'Failed to create fault log' }, 500)
    }
  }

  updateFaultLog = async (c: Context) => {
    try {
      const id = c.req.param('id')
      const body = await c.req.json()
      const faultLog = await this.faultLogModel.update(id, body)

      if (!faultLog) {
        return c.json({ error: 'Fault log not found' }, 404)
      }

      return c.json({ faultLog })
    } catch (error) {
      console.error('Error updating fault log:', error)
      return c.json({ error: 'Failed to update fault log' }, 500)
    }
  }

  deleteFaultLog = async (c: Context) => {
    try {
      const id = c.req.param('id')
      const deleted = await this.faultLogModel.delete(id)

      if (!deleted) {
        return c.json({ error: 'Fault log not found' }, 404)
      }

      return c.json({ message: 'Fault log deleted successfully' })
    } catch (error) {
      console.error('Error deleting fault log:', error)
      return c.json({ error: 'Failed to delete fault log' }, 500)
    }
  }

  saveFaultLogs = async (c: Context) => {
    try {
      // 将faultData数组中的所有数据保存到数据库
      const savedLogs = []

      for (const faultItem of faultData) {
        // 确保所有必需字段都存在，特别是attackerIP
        const faultItemWithDefaults = {
          attackerIP: '',
          ...faultItem
        };
        const savedLog = await this.faultLogModel.create(faultItemWithDefaults)
        savedLogs.push(savedLog)
      }

      return c.json({
        message: `Successfully saved ${savedLogs.length} fault logs`,
        count: savedLogs.length,
        faultLogs: savedLogs
      }, 201)
    } catch (error) {
      console.error('Error saving fault logs:', error)
      return c.json({ error: 'Failed to save fault logs' }, 500)
    }
  }

  saveNewFaultLogs = async (c: Context) => {
    try {
      // 随机选择5-20条数据
      const randomCount = Math.floor(Math.random() * 16) + 5;
      const shuffled = [...newFaultData].sort(() => Math.random() - 0.5);
      const selectedData = shuffled.slice(0, randomCount);
      console.log("🚀 ~ FaultLogController ~ selectedData:", selectedData.length)

      const savedLogs = []

      for (const { _id, createdAt, updatedAt, ...other } of selectedData) {
        // 确保所有必需字段都存在，特别是attackerIP
        const faultItemWithDefaults = {
          attackerIP: '',
          ...other
        };
        const savedLog = await this.faultLogModel.create(faultItemWithDefaults)
        savedLogs.push(savedLog)

      }

      return c.json({
        message: `Successfully saved new ${savedLogs.length} fault logs`,
        count: savedLogs.length,
        faultLogs: savedLogs
      }, 201)
    } catch (error) {
      console.error('Error saving fault logs:', error)
      return c.json({ error: 'Failed to save fault logs' }, 500)
    }
  }
}