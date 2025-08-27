import { Hono } from 'hono'
import { FaultLogController } from '../controllers/FaultLogController'

const faultLogRoutes = new Hono()
const faultLogController = new FaultLogController()

// 获取所有故障日志
faultLogRoutes.get('/', faultLogController.getAllFaultLogs)

// 根据ID获取特定故障日志
faultLogRoutes.get('/:id', faultLogController.getFaultLogById)

// 根据资产IP获取故障日志
faultLogRoutes.get('/asset/:assetIP', faultLogController.getFaultLogsByAssetIP)

// 根据攻击者IP获取故障日志
faultLogRoutes.get('/attacker/:attackerIP', faultLogController.getFaultLogsByAttackerIP)

// 根据威胁等级获取故障日志
faultLogRoutes.get('/threat/:threatLevel', faultLogController.getFaultLogsByThreatLevel)

// 创建新的故障日志
faultLogRoutes.post('/', faultLogController.createFaultLog)

// 保存faultData数组到数据库
faultLogRoutes.post('/save', faultLogController.saveFaultLogs)

// 更新故障日志
faultLogRoutes.put('/:id', faultLogController.updateFaultLog)

// 删除故障日志
faultLogRoutes.delete('/:id', faultLogController.deleteFaultLog)

export default faultLogRoutes