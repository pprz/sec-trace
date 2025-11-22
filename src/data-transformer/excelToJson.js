const XLSX = require('xlsx');

const headerMapping = {
  "发生时间": "occurrence",
  "受害IP": "assetIP",
  "攻击IP": "attackerIP",
  "一级告警类型": "level1Type",
  "二级告警类型": "level2Type",
  "攻击结果": "attackResult",
  "威胁级别": "threatLevel",
  "威胁名称": "threatName",
  "事件名称": "eventNamet",
  "安全设备": "safety",
  "处置状态": "disposalstatus",
  "终端详情": "terminalDetails",
  "载荷内容": "payload",
  "请求头": "requestHeader",
  "请求体": "requestBody",
  "响应头": "responseHeader",
  "响应体": "responseBody",
};

function excelToJson(filePath) {
  // 读取 Excel 文件
  // const workbook = XLSX.readFile(filePath);
  const workbook = XLSX.readFile(filePath);
  // 获取第一个工作表
  const sheetName = workbook.SheetNames[1];
  const worksheet = workbook.Sheets[sheetName];
  // 将工作表转换为 JSON 数组
  let data = XLSX.utils.sheet_to_json(worksheet);

  // 转换表头
  data = data.map(row => {
    const newRow = {};
    for (const [chineseKey, value] of Object.entries(row)) {
      const englishKey = headerMapping[chineseKey] || chineseKey;
      newRow[englishKey] = value;
    }
    return newRow;
  });

  return data;
}

module.exports = excelToJson;