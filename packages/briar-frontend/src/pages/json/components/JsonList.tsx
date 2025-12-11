import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast as sonnerToast } from 'sonner';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { deleteJsonDocument, getJsonDocuments, JsonDocument } from '../api';
import { JsonViewDialog } from './JsonViewDialog';

const ITEMS_PER_PAGE = 5;

export function JsonList() {
	const [documents, setDocuments] = useState<JsonDocument[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedDoc, setSelectedDoc] = useState<JsonDocument | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [docToDelete, setDocToDelete] = useState<JsonDocument | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	const [totalPages, setTotalPages] = useState(1);

	const loadDocuments = useCallback(async (page: number) => {
		setLoading(true);
		try {
			const result = await getJsonDocuments({ page, pageSize: ITEMS_PER_PAGE });
			console.log('Total Pages:', result);
			setDocuments(result.items);

			setTotalPages(result.totalPages || 1);
		} catch (error) {
			console.log('Error loading documents:', error);
			sonnerToast.error('无法加载 JSON 文档列表');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadDocuments(currentPage);
	}, [loadDocuments, currentPage]);

	const handleView = (doc: JsonDocument) => {
		setSelectedDoc(doc);
		setDialogOpen(true);
	};

	const handleDelete = (doc: JsonDocument) => {
		setDocToDelete(doc);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!docToDelete) return;

		try {
			await deleteJsonDocument(docToDelete.id);
			sonnerToast.success(`文档 "${docToDelete.name}" 已删除`);
			loadDocuments(currentPage);
		} catch (error) {
			sonnerToast.error('删除失败，请稍后重试');
		} finally {
			setDeleteDialogOpen(false);
			setDocToDelete(null);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString('zh-CN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	const getPreviewContent = (content: string) => {
		try {
			const obj = JSON.parse(content);
			const str = JSON.stringify(obj);
			return str.length > 100 ? str.substring(0, 100) + '...' : str;
		} catch {
			return content.substring(0, 100) + '...';
		}
	};

	return (
		<>
			{loading ? (
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-muted-foreground">加载中...</p>
				</div>
			) : documents.length === 0 ? (
				<div className="rounded-lg border bg-white p-12">
					<div className="text-center">
						<h3 className="text-lg font-medium mb-2">暂无 JSON 文档</h3>
						<p className="text-sm text-gray-500">从编辑器开始创建你的第一个 JSON 文档</p>
						<div className="mt-4">
							<Button
								onClick={() => {
									setSelectedDoc(null);
									setDialogOpen(true);
								}}
							>
								新增文档
							</Button>
						</div>
					</div>
				</div>
			) : (
				<>
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-medium">JSON 列表</h2>
						<div>
							<Button
								onClick={() => {
									setSelectedDoc(null);
									setDialogOpen(true);
								}}
							>
								新增文档
							</Button>
						</div>
					</div>

					<div className="space-y-4">
						{documents.map((doc) => (
							<div
								key={doc.id}
								className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow duration-200"
							>
								<div className="flex items-start justify-between mb-3">
									<div className="flex-1 min-w-0">
										<h3 className="text-lg font-semibold text-gray-900 truncate">{doc.name}</h3>
									</div>
									<div className="flex gap-2 ml-4 flex-shrink-0">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleView(doc)}
											className="border-gray-300 hover:bg-gray-50"
										>
											<Pencil className="h-4 w-4 mr-1" />
											编辑
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleDelete(doc)}
											className="border-gray-300 hover:bg-red-50 text-red-600 hover:text-red-700"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>

								<div className="mb-3">
									<p className="text-sm text-gray-600 font-mono bg-gray-50 p-3 rounded border border-gray-200 break-all">
										{getPreviewContent(doc.content)}
									</p>
								</div>

								<div className="flex flex-wrap gap-4 text-xs text-gray-500">
									<span>创建: {formatDate(doc.createdAt)}</span>
									<span>更新: {formatDate(doc.updatedAt)}</span>
								</div>
							</div>
						))}
					</div>

					{totalPages > 1 && (
						<div className="flex items-center justify-between mt-6 pt-6 border-t">
							<span className="text-sm text-gray-600">
								第 {currentPage} 页 / 共 {totalPages} 页
							</span>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
									disabled={currentPage === 1}
								>
									<ChevronLeft className="h-4 w-4 mr-1" />
									上一页
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
									disabled={currentPage === totalPages}
								>
									下一页
									<ChevronRight className="h-4 w-4 ml-1" />
								</Button>
							</div>
						</div>
					)}
				</>
			)}

			<JsonViewDialog
				document={selectedDoc}
				open={dialogOpen}
				onOpenChange={(open) => {
					if (!open) {
						setSelectedDoc(null);
						setDialogOpen(false);
					}
				}}
				onSaved={() => {
					loadDocuments(currentPage);
					setDialogOpen(false);
				}}
			/>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>确认删除</AlertDialogTitle>
						<AlertDialogDescription>
							确定要删除文档 {docToDelete?.name ? `"${docToDelete.name}"` : '该文档'}{' '}
							吗？此操作无法撤销。
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>取消</AlertDialogCancel>
						<AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
							删除
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
