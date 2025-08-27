// import { MongoClient } from 'mongodb';

// // MongoDB 连接字符串
// const uri = 'mongodb://localhost:27017';
// const client = new MongoClient(uri);

// // 数据库和集合名称
// const databaseName = 'security_alerts';
// const collectionName = 'alerts';

// // 原始数据（来自 fault.ts）
// const alertData = [
//     {
//         firstOccurrence: '2025-04-02 00:58:32',
//         lastOccurrence: '2025-04-02 22:58:55',
//         victimIP: '192.168.130.2',
//         attackerIP: '221.204.66.204',
//         assetIP: '192.168.130.2',
//         level1Type: '攻击利用',
//         level2Type: '代理工具',
//         threatName: '发现远程连接工具ToDesk活动',
//         ioc: '0x5dde',
//         attackResult: '企图',
//         threatLevel: '中危',
//         count: 30,
//         attackStage: '入侵',
//         assetGroup: '未分配资产组',
//         xffProxy: '',
//         uri: '/api/login',
//         cascadeUnit: '本级',
//         status: '未处置',
//         hostDomain: '',
//         source: '流量探针2',
//         attackOrg: 'menuPass,Strider,Soft Cell,MuddyWater,APT39,Turla,APT28,APT3,Lazarus Group',
//         attackMethod: '连接代理',
//         httpStatus: '',
//         attackDimension: '外部攻击',
//         isWhitelist: '否',
//         payload: '',
//         requestHeader: '{ "User-Agent": "Mozilla/5.0" }',
//         requestBody: '{"username":"admin","password":"test"}',
//         responseHeader: '{ "Content-Type": "text/html" }',
//         responseBody: '',
//         webshellContent: '',
//         responsiblePerson: '张三',
//         assetTags: '核心资产',
//         assetName: 'DB_Server',
//         isKeyFocus: '是',
//         attackerGeo: '中国·北京',
//         eventReported: '未上报',
//         isRead: '未读',
//         attackerAssetGroup: '外部IP',
//         victimAssetGroup: '内部IP',
//         alertTags: '紧急',
//         srcIP: '192.168.130.2',
//         dstIP: '221.204.66.204',
//         srcPort: 21590,
//         dstPort: 53,
//         protocol: 'dns',
//         srcMAC: '60:de:f3:40:62:0f',
//         dstMAC: 'dc:36:43:e2:fc:bf',
//         vlan: '0x68',
//         alertID: '20250402_c90d148f623f9705184efb5dd2e0333e',
//         username: 'admin',
//         password: '********'
//     }
//     // 更多数据...
// ];

// async function insertData() {
//     try {
//         // 连接数据库
//         await client.connect();
//         console.log('Connected to MongoDB');

//         const database = client.db(databaseName);
//         const collection = database.collection(collectionName);

//         // 插入数据
//         const result = await collection.insertMany(alertData);
//         console.log(`${result.insertedCount} documents inserted`);
//     } finally {
//         await client.close();
//     }
// }

// insertData().catch(console.error);