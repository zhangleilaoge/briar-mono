// 该文件暂时无用

const fs = require('fs');
const path = require('path');
const COS = require('cos-nodejs-sdk-v5');

const region = process.env.REGION;
const cos = new COS({
	SecretId: process.env.COS_SECRET_ID,
	SecretKey: process.env.COS_SECRET_KEY
});
const bucket = process.env.COS_BUCKET;

/**
 * 获取目标目录下所有文件的文件路径
 * @param {string} targetDirectory - 目标目录的相对路径
 * @returns {string[]} 包含所有文件路径的数组
 */
function listFilesInDirectory(targetDirectory) {
	const file_paths = [];
	const projectRoot = process.cwd().split('briar-mono')[0];
	const absoluteTargetDirectory = path.join(projectRoot, targetDirectory);

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

// function deleteOldFile() {
// 	return new Promise((resolve) => {
// 		cos.getBucket(
// 			{
// 				Bucket: bucket,
// 				Region: region,
// 				Prefix: 'static', //要清理的目录
// 				Marker: 'static', //要清理的目录
// 				MaxKeys: 1000
// 			},
// 			function (listError, listResult) {
// 				if (listError) return console.log('list error:', listError);
// 				var objects = listResult.Contents.map(function (item) {
// 					return { Key: item.Key };
// 				});
// 				if (objects.length) {
// 					cos.deleteMultipleObject(
// 						{
// 							Bucket: bucket,
// 							Region: region,
// 							Objects: objects
// 						},
// 						function (delError, deleteResult) {
// 							if (delError) {
// 								console.log(delError);
// 							}
// 							if (deleteResult?.statusCode === 200) {
// 								console.log('清理原static目录成功！');
// 								resolve();
// 							}
// 						}
// 					);
// 				} else {
// 					console.log('目录下无资源，无需删除！');
// 					resolve();
// 				}
// 			}
// 		);
// 	});
// }

const uploadFile = (pathItem, retries = 3) => {
	const key = `static/${pathItem.split('static\\')[1]}`.replace('\\', '/');

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
	const targetDirectory = './briar-mono/packages/briar-frontend/dist';
	const staticArr = listFilesInDirectory(targetDirectory);

	// 不要随意删除历史文件，很危险
	// await deleteOldFile();

	for (let i = 0; i < staticArr.length; i++) {
		uploadFile(staticArr[i]);
	}
}

main();
