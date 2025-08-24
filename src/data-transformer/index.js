const excelToJson = require('./excelToJson');
const fs = require('fs');
const path = require('path');

// 替换为你的 Excel 文件路径
const filePath = './may-data.xlsx';
const jsonData = excelToJson(filePath);

// 定义要写入的文件路径
const outputFilePath = path.join(__dirname, 'data-json.json');

// 将 JSON 数据转换为字符串并写入文件
fs.writeFile(outputFilePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
    if (err) {
        console.error('写入文件时出错:', err);
    } else {
        console.log('JSON 数据已成功写入到 data-json.json 文件中');
    }
});