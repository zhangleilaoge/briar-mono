import { Toaster } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useLogin from '@/pages/briar/hooks/biz/useLogin';

import { JsonList } from './components/JsonList';
import { UsageStats } from './components/UsageStats';

export default function JsonPage() {
	const { userInfo, initialized } = useLogin({ needCreateUser: false });

	// Wait for initialization to complete before deciding to redirect
	if (!initialized) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-center min-h-[360px]">
					<p className="text-muted-foreground">正在初始化用户信息...</p>
				</div>
			</div>
		);
	}

	// If initialized and not logged in, redirect to account login page with return URL
	if (initialized && !userInfo?.id) {
		if (typeof window !== 'undefined') {
			const redirectTo = encodeURIComponent(window.location.href);
			window.location.href = `/account/login?redirectTo=${redirectTo}`;
		}

		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center py-12">
					<h3 className="text-lg font-medium">请先登录</h3>
					<p className="text-sm text-muted-foreground mt-2">正在跳转到登录页面...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold">JSON 管理中心</h1>
					<p className="text-sm text-muted-foreground mt-1">查看、编辑和管理你的 JSON 数据</p>
				</div>
			</div>

			<Tabs defaultValue="list" className="space-y-6">
				<TabsList>
					<TabsTrigger value="list">JSON 列表</TabsTrigger>
					<TabsTrigger value="stats">用量统计</TabsTrigger>
				</TabsList>

				<TabsContent value="list">
					<JsonList />
				</TabsContent>

				<TabsContent value="stats">
					<UsageStats />
				</TabsContent>
			</Tabs>
			<Toaster />
		</div>
	);
}
