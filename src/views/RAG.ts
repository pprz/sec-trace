// const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");
// const { MarkdownLoader } = require("langchain/document_loaders/fs/markdown");
// const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
// const fs = require("fs");
// const path = require("path");

// async function processMarkdownDocs(docs) {
//     // 文本分块处理
//     const textSplitter = new RecursiveCharacterTextSplitter({
//         chunkSize: 1000,
//         chunkOverlap: 200,
//     });

//     // 对每个文档进行分块
//     const splitDocs = await textSplitter.splitDocuments(docs);

//     // 可选：添加元数据或进行其他处理
//     const processedDocs = splitDocs.map((doc, index) => {
//         // 提取文件名作为元数据
//         const fileName = path.basename(doc.metadata.source);

//         return {
//             ...doc,
//             metadata: {
//                 ...doc.metadata,
//                 fileName,
//                 chunkIndex: index,
//             },
//         };
//     });

//     return processedDocs;
// }



// const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
// const { PineconeStore } = require("langchain/vectorstores/pinecone");
// const { PineconeClient } = require("@pinecone-database/pinecone");
// const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
// const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");
// const { MarkdownLoader } = require("langchain/document_loaders/fs/markdown");
// const { Document } = require("langchain/document");
// const fs = require("fs");
// const path = require("path");
// require("dotenv").config();

// // 1. 加载并处理网络安全文档
// async function loadSecurityDocuments() {
//     const loader = new DirectoryLoader(
//         path.join(__dirname, "security_docs"),
//         {
//             ".md": (path) => new MarkdownLoader(path),
//         }
//     );

//     const docs = await loader.load();

//     // 针对网络安全文档的特殊处理
//     const textSplitter = new RecursiveCharacterTextSplitter({
//         chunkSize: 600, // 安全文档通常包含长段落，使用较小的块大小
//         chunkOverlap: 150,
//         separators: ["#", "##", "###", "\n\n", "攻击步骤:", "防御措施:", "漏洞描述:", "CVE-"]
//     });

//     const splitDocs = await textSplitter.splitDocuments(docs);

//     // 提取并添加安全元数据
//     const processedDocs = splitDocs.map((doc) => {
//         const metadata = extractSecurityMetadata(doc.pageContent);
//         return new Document({
//             pageContent: cleanSecurityContent(doc.pageContent),
//             metadata: { ...doc.metadata, ...metadata }
//         });
//     });

//     return processedDocs;
// }

// // 提取网络安全相关元数据
// function extractSecurityMetadata(content) {
//     const metadata = {
//         threatLevel: "Medium", // 默认值
//         attackType: "Unknown",
//         cveId: "None"
//     };

//     // 提取威胁等级
//     const threatMatch = content.match(/威胁等级[:：]\s*([高|中|低|Critical|High|Medium|Low])/i);
//     if (threatMatch) {
//         metadata.threatLevel = threatMatch[1];
//     }

//     // 提取攻击类型
//     const attackTypes = ["勒索软件", "APT", "DDoS", "SQL注入", "XSS"];
//     for (const type of attackTypes) {
//         if (content.includes(type)) {
//             metadata.attackType = type;
//             break;
//         }
//     }

//     // 提取CVE编号
//     const cveMatch = content.match(/CVE-\d{4}-\d{4,7}/i);
//     if (cveMatch) {
//         metadata.cveId = cveMatch[0];
//     }

//     return metadata;
// }

// // 清理网络安全文档内容
// function cleanSecurityContent(content) {
//     // 移除Markdown格式但保留安全关键信息
//     return content
//         .replace(/!\[.*?\]\(.*?\)/g, "") // 移除图片
//         .replace(/\[(.*?)\]\(.*?\)/g, "$1") // 保留链接文本
//         .replace(/`([^`]+)`/g, "$1") // 移除行内代码标记
//         .replace(/```[\s\S]*?```/g, ""); // 移除代码块(如果不需要分析代码)
// }

// // 2. 向量嵌入与存储
// async function embedAndStoreSecurityDocs(docs) {
//     // 初始化Pinecone客户端
//     const pinecone = new PineconeClient();
//     await pinecone.init({
//         environment: process.env.PINECONE_ENVIRONMENT,
//         apiKey: process.env.PINECONE_API_KEY,
//     });

//     // 创建安全领域优化的嵌入模型
//     const embeddings = new OpenAIEmbeddings({
//         openAIApiKey: process.env.OPENAI_API_KEY,
//         modelName: "text-embedding-ada-002",
//         // 可添加安全领域特定的prompt模板
//         batchSize: 512 // 优化批处理大小以提高性能
//     });

//     // 存储到Pinecone
//     await PineconeStore.fromDocuments(
//         docs,
//         embeddings,
//         {
//             pineconeIndex: pinecone.Index(process.env.PINECONE_INDEX),
//             namespace: "security-docs",
//             textKey: "content",
//             // 创建复合元数据索引以加速安全相关查询
//             metadataFilters: ["threatLevel", "attackType", "cveId"]
//         }
//     );

//     console.log(`成功嵌入并存储 ${docs.length} 个安全文档块`);
// }

// // 3. 网络安全相关的检索功能
// async function retrieveSecurityInfo(query, metadataFilters = {}) {
//     const pinecone = new PineconeClient();
//     await pinecone.init({
//         environment: process.env.PINECONE_ENVIRONMENT,
//         apiKey: process.env.PINECONE_API_KEY,
//     });

//     const embeddings = new OpenAIEmbeddings({
//         openAIApiKey: process.env.OPENAI_API_KEY,
//     });

//     // 从Pinecone检索
//     const vectorStore = await PineconeStore.fromExistingIndex(
//         embeddings,
//         {
//             pineconeIndex: pinecone.Index(process.env.PINECONE_INDEX),
//             namespace: "security-docs",
//         }
//     );

//     // 构建基于元数据的过滤条件
//     let filter = {};
//     if (metadataFilters.threatLevel) {
//         filter.threatLevel = metadataFilters.threatLevel;
//     }
//     if (metadataFilters.attackType) {
//         filter.attackType = metadataFilters.attackType;
//     }
//     if (metadataFilters.cveId) {
//         filter.cveId = metadataFilters.cveId;
//     }

//     // 执行带过滤的相似度搜索
//     return vectorStore.similaritySearch(query, 5, filter);
// }

// // 主函数
// async function main() {
//     try {
//         // 加载并处理安全文档
//         const securityDocs = await loadSecurityDocuments();

//         if (securityDocs.length === 0) {
//             console.error("未找到安全文档");
//             return;
//         }

//         // 嵌入并存储向量
//         await embedAndStoreSecurityDocs(securityDocs);

//         // 示例查询：查找关于高威胁等级的勒索软件攻击的文档
//         const query = "如何防御勒索软件攻击?";
//         const results = await retrieveSecurityInfo(query, {
//             threatLevel: "高",
//             attackType: "勒索软件"
//         });

//         console.log(`找到 ${results.length} 个相关文档`);
//         results.forEach((doc, index) => {
//             console.log(`结果 ${index + 1} (威胁等级: ${doc.metadata.threatLevel}):`);
//             console.log(doc.pageContent.substring(0, 100) + "...");
//             console.log("-----------------------------------");
//         });
//     } catch (error) {
//         console.error("处理安全文档时出错:", error);
//     }
// }

// main();