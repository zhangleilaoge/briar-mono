import { BarChart3, Database, FileJson, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast as sonnerToast } from 'sonner';

import { getJsonStats, IJsonStatsDTO } from '../api';

export function UsageStats() {
	const [stats, setStats] = useState<IJsonStatsDTO | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadStats = async () => {
			try {
				const data = await getJsonStats();
				setStats(data);
			} catch (error) {
				sonnerToast.error('加载统计数据失败，请稍后重试');
			} finally {
				setLoading(false);
			}
		};

		loadStats();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-muted-foreground">加载中...</p>
			</div>
		);
	}

	if (!stats) {
		return (
			<div className="rounded-lg border bg-white p-12">
				<div className="text-center">
					<h3 className="text-lg font-medium mb-2">无法加载统计数据</h3>
					<p className="text-sm text-gray-500">请稍后重试</p>
				</div>
			</div>
		);
	}

	const formatSize = (bytes: number): string => {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
	};

	const storagePercentage =
		stats.storageLimit > 0 ? Math.round((stats.storageUsed / stats.storageLimit) * 100) : 0;

	return (
		<div className="space-y-6">
			{/* 统计卡片 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-gray-600">总文档数</span>
						<FileJson className="h-5 w-5 text-blue-500" />
					</div>
					<p className="text-3xl font-bold text-gray-900">{stats.totalDocuments}</p>
					<p className="text-xs text-gray-500 mt-2">个 JSON 文档</p>
				</div>

				<div className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-gray-600">总大小</span>
						<Database className="h-5 w-5 text-green-500" />
					</div>
					<p className="text-3xl font-bold text-gray-900">{formatSize(stats.totalSize)}</p>
					<p className="text-xs text-gray-500 mt-2">数据总量</p>
				</div>

				<div className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-gray-600">本月请求</span>
						<TrendingUp className="h-5 w-5 text-purple-500" />
					</div>
					<p className="text-3xl font-bold text-gray-900">{stats.monthlyRequests}</p>
					<p className="text-xs text-gray-500 mt-2">API 请求次数</p>
				</div>

				<div className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-gray-600">存储使用</span>
						<BarChart3 className="h-5 w-5 text-orange-500" />
					</div>
					<p className="text-3xl font-bold text-gray-900">{storagePercentage}%</p>
					<p className="text-xs text-gray-500 mt-2">
						{formatSize(stats.storageUsed)} / {formatSize(stats.storageLimit)}
					</p>
				</div>
			</div>

			{/* 存储使用进度条 */}
			<div className="rounded-lg border border-gray-200 bg-white p-6">
				<h3 className="text-lg font-semibold mb-4 text-gray-900">存储空间使用情况</h3>
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span className="text-gray-600">
							已使用 {formatSize(stats.storageUsed)} / {formatSize(stats.storageLimit)}
						</span>
						<span className="text-gray-500">{storagePercentage}%</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
							style={{ width: `${storagePercentage}%` }}
						/>
					</div>
					<p className="text-xs text-gray-500 mt-2">
						还可存储 {formatSize(stats.storageLimit - stats.storageUsed)} 数据
					</p>
				</div>
			</div>

			{/* 最近活动 */}
			<div className="rounded-lg border border-gray-200 bg-white p-6">
				<h3 className="text-lg font-semibold mb-4 text-gray-900">最近活动</h3>
				<div className="space-y-3">
					{stats.recentLogs && stats.recentLogs.length > 0 ? (
						stats.recentLogs.map((item, idx) => (
							<div
								key={idx}
								className="flex items-start justify-between py-3 border-b last:border-b-0"
							>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900">{item.operationType}</p>
									<p className="text-xs text-gray-500">
										{item.createdAt ? new Date(item.createdAt).toLocaleString('zh-CN') : '时间未知'}
									</p>
								</div>
								{item.details && (
									<span className="ml-4 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
										{item.details}
									</span>
								)}
							</div>
						))
					) : (
						<p className="text-sm text-gray-500">暂无活动记录</p>
					)}
				</div>
			</div>

			{/* 使用建议 */}
			<div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
				<h3 className="text-lg font-semibold mb-2 text-blue-900">提示</h3>
				<ul className="space-y-2 text-sm text-blue-800">
					<li>• 您的存储空间使用率为 {storagePercentage}%，建议定期清理不需要的文档</li>
					<li>• 本月已使用 {stats.monthlyRequests} 次 API 请求，请合理分配配额</li>
					<li>• 建议使用描述性名称命名 JSON 文档，方便后续查找和管理</li>
				</ul>
			</div>
		</div>
	);
}
