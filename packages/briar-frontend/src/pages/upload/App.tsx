import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { FileUploadArea } from './components/FileUploadArea';
import { ImageGallery } from './components/image-gallery';
import { Profile } from './components/profile';

export default function ImageHostingPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold">图床管理</h1>
				</div>
				<Profile />
			</div>

			<Tabs defaultValue="upload" className="space-y-6">
				<TabsList>
					<TabsTrigger value="upload">上传图片</TabsTrigger>
					<TabsTrigger value="gallery">图片库</TabsTrigger>
					<TabsTrigger value="settings">设置</TabsTrigger>
				</TabsList>

				<TabsContent value="upload">
					<FileUploadArea />
				</TabsContent>

				<TabsContent value="gallery">
					<ImageGallery />
				</TabsContent>

				<TabsContent value="settings">
					<div className="space-y-4">
						<div>
							<h3 className="text-lg font-medium">图床设置</h3>
						</div>
						{/* 设置表单可以在这里添加 */}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
