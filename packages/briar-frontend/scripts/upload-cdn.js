import fs from 'fs';
import path from 'path';
import COS from 'cos-nodejs-sdk-v5';
import 'dotenv/config';

const region = process.env.BRIAR_TX_BUCKET_REGION;
const cos = new COS({
	SecretId: process.env.BRIAR_TX_SEC_ID,
	SecretKey: process.env.BRIAR_TX_SEC_KEY
});
const bucket = process.env.BRIAR_TX_BUCKET_NAME;

/**
 * 获取目标目录下所有文件的文件路径
 * @param {string} targetDirectory - 目标目录的相对路径
 * @returns {string[]} 包含所有文件路径的数组
 */
function listFilesInDirectory(targetDirectory) {
	const file_paths = [];
	const projectRoot = process.cwd().split('briar-mono')[0];
	const absoluteTargetDirectory = path.join(
		projectRoot,
		'briar-mono/packages/briar-frontend',
		targetDirectory
	);

	if (!fs.existsSync(absoluteTargetDirectory)) {
		console.log(`目录 ${absoluteTargetDirectory} 不存在`);
		return [];
	}

	function walkDir(dir) {
		const files = fs.readdirSync(dir);
		for (const file of files) {
			const filePath = path.join(dir, file);
			const stat = fs.statSync(filePath);
			if (stat.isDirectory()) {
				walkDir(filePath);
			} else {
				file_paths.push(filePath);
			}
		}
	}

	walkDir(absoluteTargetDirectory);
	return file_paths;
}

function deleteOldFile() {
	return new Promise((resolve) => {
		cos.getBucket(
			{
				Bucket: bucket,
				Region: region,
				Prefix: 'static', //要清理的目录
				Marker: 'static', //要清理的目录
				MaxKeys: 1000
			},
			function (listError, listResult) {
				if (listError) return console.log('list error:', listError);
				var objects = listResult.Contents.map(function (item) {
					return { Key: item.Key };
				});
				if (objects.length) {
					cos.deleteMultipleObject(
						{
							Bucket: bucket,
							Region: region,
							Objects: objects
						},
						function (delError, deleteResult) {
							if (delError) {
								console.log(delError);
							}
							if (deleteResult?.statusCode === 200) {
								console.log('清理原static目录成功！');
								resolve();
							}
						}
					);
				} else {
					console.log('目录下无资源，无需删除！');
					resolve();
				}
			}
		);
	});
}

const uploadFile = (pathItem, retries = 3) => {
	const key = `static/${pathItem.split('dist/')[1]}`;

	// 若文件为js文件，且同名的js.gz文件存在,跳过上传
	// if (pathItem.endsWith('.js')) {
	// 	const gzPath = pathItem.replace(/\.js$/, '.js.gz'); // 生成同名的 .js.gz 文件路径
	// 	if (fs.existsSync(gzPath)) {
	// 		// 检查 .js.gz 文件是否存在
	// 		console.log(`跳过上传 ${pathItem}，同名的 .js.gz 文件 ${gzPath} 已存在`);
	// 		return;
	// 	}
	// }

	const attemptUpload = (retryCountLeft) => {
		cos.putObject(
			{
				Bucket: bucket,
				Region: region,
				Key: key, // 上传到存储桶的路径 *
				StorageClass: 'STANDARD',
				Body: fs.createReadStream(pathItem) // 被上传的文件对象
			},
			function (err, data) {
				if (err) {
					console.log(err);
					if (retryCountLeft > 0) {
						console.log(
							`Retrying upload for ${pathItem} (${retries - retryCountLeft + 1} attempt(s) left)...`
						);
						setTimeout(() => attemptUpload(retryCountLeft - 1), 3000); // 2秒后重试
					} else {
						console.log(`Failed to upload ${pathItem} after ${retries} attempts.`);
					}
					return;
				}
				if (data?.statusCode === 200) {
					console.log(`上传${pathItem.split('/').pop()}到cdn成功！`);
				}
			}
		);
	};

	attemptUpload(retries);
};

async function main() {
	const targetDirectory = './dist';
	const staticArr = listFilesInDirectory(targetDirectory);

	// 没必要删除历史文件
	// await deleteOldFile();

	for (let i = 0; i < staticArr.length; i++) {
		uploadFile(staticArr[i]);
	}
}

main();
