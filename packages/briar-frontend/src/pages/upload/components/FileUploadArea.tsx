import { message } from 'antd';
import { THUMB_URL_SUFFIX } from 'briar-shared';
import { CheckCircle, FolderOpen, Loader2, Upload, XCircle } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

import { createImgMaterial, uploadBase64 } from '../api';

interface UploadResult {
	url: string;
	filename: string;
	status: 'uploaded' | 'addedToLibrary' | 'error';
	thumbUrl?: string;
}

export function FileUploadArea() {
	const [uploading, setUploading] = useState(false);
	const [addingToLibrary, setAddingToLibrary] = useState(false);
	const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
	const [uploadProgress, setUploadProgress] = useState(0);

	const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		try {
			setUploading(true);
			setUploadProgress(0);
			setUploadResults([]);

			// 使用 Promise.all 并行处理所有文件
			const uploadPromises = Array.from(files).map(async (file, index) => {
				try {
					// 检查文件大小和类型
					if (file.size > 10 * 1024 * 1024) {
						throw new Error(`文件大小超过10MB限制`);
					}

					if (!file.type.startsWith('image/')) {
						throw new Error(`不是有效的图片格式`);
					}

					// 将文件转换为base64
					const base64 = await new Promise<string>((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = (e) => resolve(e.target?.result as string);
						reader.onerror = reject;
						reader.readAsDataURL(file);
					});

					// 确保base64数据有效
					if (!base64 || typeof base64 !== 'string') {
						throw new Error('文件读取失败');
					}

					// 上传到COS获取URL - uploadBase64返回的就是字符串URL
					const image = await uploadBase64({
						filename: file.name,
						base64 // 这里传递的是纯base64数据
					});

					// 更新进度
					setUploadProgress(((index + 1) / files.length) * 100);

					return {
						url: image?.url, // uploadBase64直接返回字符串URL
						filename: file.name,
						status: 'uploaded' as const,
						thumbUrl: image?.url + THUMB_URL_SUFFIX
					};
				} catch (error) {
					console.error(`文件 ${file.name} 上传失败:`, error);
					return {
						url: '',
						filename: file.name,
						status: 'error' as const
					};
				}
			});

			// 使用Promise.all并行执行所有上传
			const results = (await Promise.all(uploadPromises)) as UploadResult[];
			setUploadResults(results);

			// 统计上传结果
			const successCount = results.filter((r) => r.status === 'uploaded').length;
			const errorCount = results.filter((r) => r.status === 'error').length;

			if (errorCount === 0) {
				message.success(`成功上传 ${successCount} 张图片到COS`);
			} else if (successCount === 0) {
				message.error('所有文件上传失败');
			} else {
				message.warning(`成功上传 ${successCount} 张，失败 ${errorCount} 张`);
			}
		} catch (error) {
			console.error('上传过程出错:', error);
			message.error('上传过程出现异常');
		} finally {
			setUploading(false);
			setUploadProgress(0);
			if (event.target) event.target.value = '';
		}
	};

	// 添加到图床库
	const handleAddToLibrary = async () => {
		const uploadedFiles = uploadResults.filter((r) => r.status === 'uploaded');

		if (uploadedFiles.length === 0) {
			message.warning('没有可添加到图床的图片');
			return;
		}

		try {
			setAddingToLibrary(true);

			// 调用创建图片素材接口
			await createImgMaterial({
				files: uploadedFiles.map((file) => ({
					name: file.filename,
					thumbUrl: file.thumbUrl,
					url: file.url
				}))
			});

			// 更新状态为已添加到图床
			setUploadResults((prev) =>
				prev.map((item) =>
					item.status === 'uploaded' ? { ...item, status: 'addedToLibrary' } : item
				)
			);

			message.success(`成功将 ${uploadedFiles.length} 张图片添加到图床`);
		} catch (error) {
			console.error('添加到图床失败:', error);
			message.error('添加到图床失败，请重试');
		} finally {
			setAddingToLibrary(false);
		}
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const files = event.dataTransfer.files;
		if (files.length > 0) {
			const mockEvent = {
				target: { files }
			} as React.ChangeEvent<HTMLInputElement>;
			handleFileSelect(mockEvent);
		}
	};

	const getStatusBadge = (status: UploadResult['status']) => {
		switch (status) {
			case 'uploaded':
				return (
					<Badge variant="outline" className="bg-blue-50 text-blue-700">
						已上传
					</Badge>
				);
			case 'addedToLibrary':
				return (
					<Badge variant="outline" className="bg-green-50 text-green-700">
						已入库
					</Badge>
				);
			case 'error':
				return (
					<Badge variant="outline" className="bg-red-50 text-red-700">
						失败
					</Badge>
				);
			default:
				return null;
		}
	};

	const getStatusIcon = (status: UploadResult['status']) => {
		switch (status) {
			case 'uploaded':
				return <CheckCircle className="w-4 h-4 text-blue-500" />;
			case 'addedToLibrary':
				return <CheckCircle className="w-4 h-4 text-green-500" />;
			case 'error':
				return <XCircle className="w-4 h-4 text-red-500" />;
			default:
				return null;
		}
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>上传图片</CardTitle>
				<CardDescription>支持拖放或点击选择文件，最大支持10MB</CardDescription>
			</CardHeader>
			<CardContent>
				<div
					className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
					onDrop={handleDrop}
					onDragOver={(e) => e.preventDefault()}
				>
					{uploading ? (
						<div className="flex flex-col items-center">
							<Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
							<div className="mt-4 w-full max-w-xs">
								<Progress value={uploadProgress} className="w-full" />
								<p className="text-sm text-gray-500 mt-2">
									上传中... {Math.round(uploadProgress)}%
								</p>
							</div>
						</div>
					) : (
						<>
							<Upload className="mx-auto h-12 w-12 text-gray-400" />
							<div className="mt-4 flex justify-center text-sm text-gray-600">
								<Label htmlFor="file-upload" className="relative cursor-pointer">
									<Button variant="outline" disabled={uploading || addingToLibrary}>
										<FolderOpen className="w-4 h-4 mr-2" />
										选择文件
									</Button>
									<Input
										id="file-upload"
										name="file-upload"
										type="file"
										className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
										accept="image/*"
										multiple
										onChange={handleFileSelect}
										disabled={uploading || addingToLibrary}
									/>
								</Label>
							</div>

							<p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF 最大10MB</p>
						</>
					)}
				</div>

				{/* 上传结果展示 */}
				{uploadResults.length > 0 && (
					<div className="mt-6">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-medium">上传结果</h3>
							<Button
								onClick={handleAddToLibrary}
								disabled={
									addingToLibrary ||
									uploadResults.filter((r) => r.status === 'uploaded').length === 0
								}
								variant="default"
							>
								{addingToLibrary ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										添加中...
									</>
								) : (
									'添加到图床'
								)}
							</Button>
						</div>

						<div className="space-y-3 max-h-60 overflow-y-auto">
							{uploadResults.map((result, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-3 border rounded-lg"
								>
									<div className="flex items-center space-x-3">
										{getStatusIcon(result.status)}
										<span className="text-sm font-medium truncate max-w-xs">{result.filename}</span>
									</div>
									<div className="flex items-center space-x-2">{getStatusBadge(result.status)}</div>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
