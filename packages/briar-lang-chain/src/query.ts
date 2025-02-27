// process.env.LANGCHAIN_VERBOSE = "true"; // * enable verbose logging

import { TencentHunyuanEmbeddings } from '@langchain/community/embeddings/tencent_hunyuan';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { Document } from '@langchain/core/documents';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { ChatOpenAI } from '@langchain/openai';
import path from 'path';

const baseDir = __dirname;

const main = async () => {
	const directory = path.join(baseDir, '../db/article');
	const embeddings = new TencentHunyuanEmbeddings();
	const vectorstore = await FaissStore.load(directory, embeddings);

	// * 1、仅仅根据相似度算法搜索到两条数据
	const retriever = vectorstore.asRetriever(2);

	const convertDocsToString = (documents: Document[]): string => {
		return documents.map((document) => document.pageContent).join('\n');
	};

	const contextRetrieverChain = RunnableSequence.from([
		(input) => input.question,
		retriever,
		convertDocsToString
	]);

	const TEMPLATE = `
你是一个熟读《夜晚的潜水艇》的终极原著党，精通根据作品原文详细解释和回答问题，你在回答时会引用作品原文。
并且回答时仅根据原文，尽可能回答用户问题，如果原文中没有相关内容，你可以回答“原文中没有相关内容”，

以下是原文中跟用户回答相关的内容：
{context}

现在，你需要基于原文，回答以下问题：
{question}`;

	const prompt = ChatPromptTemplate.fromTemplate(TEMPLATE);

	const chatModel = new ChatOpenAI({
		configuration: {
			baseURL: 'https://api.hunyuan.cloud.tencent.com/v1',
			apiKey: process.env.HUNYUAN_API_KEY
		},
		temperature: 0.6,
		modelName: 'hunyuan-turbo'
	});

	const ragChain = RunnableSequence.from([
		{
			context: contextRetrieverChain,
			question: (input) => input.question
		},
		prompt,
		chatModel,
		new StringOutputParser()
	]);

	const answer = await ragChain.invoke({
		question: '什么是作者几岁开始创造潜水艇的'
	});
	console.log(answer);
};

main().catch(console.error);
