import 'dotenv/config';

import { TencentHunyuanEmbeddings } from '@langchain/community/embeddings/tencent_hunyuan';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import path from 'path';

const baseDir = __dirname;

const main = async () => {
	const loader = new TextLoader(path.join(baseDir, '../assets/TriplyDoors.txt'));
	const docs = await loader.load();
	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 500,
		chunkOverlap: 80
	});

	const splitDocs = await splitter.splitDocuments(docs);

	const embeddings = new TencentHunyuanEmbeddings({
		tencentSecretId: process.env.BRIAR_TX_SEC_ID,
		tencentSecretKey: process.env.BRIAR_TX_SEC_KEY
	});

	const vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);
	await vectorStore.save(path.join(baseDir, '../db/TriplyDoors'));
};

main().catch(console.error);
