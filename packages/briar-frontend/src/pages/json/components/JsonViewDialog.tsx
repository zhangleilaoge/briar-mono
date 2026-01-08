import { useCallback, useEffect, useState } from 'react';
import { toast as sonnerToast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// notifications handled by sonner in this component
import { createJsonDocument, JsonDocument, updateJsonDocument } from '../api';
import JsonEditor from './JsonEditor';

interface JsonViewDialogProps {
	document: JsonDocument | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSaved: () => void;
}

export function JsonViewDialog({ document, open, onOpenChange, onSaved }: JsonViewDialogProps) {
	const [name, setName] = useState('');
	const [jsonText, setJsonText] = useState<string>('');
	const [isValid, setIsValid] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	// Populate form fields when document changes
	useEffect(() => {
		if (document) {
			setName(document.name || '');
			setJsonText(document.content || '');
		} else {
			setName('');
			setJsonText('');
		}
	}, [document, open]);

	const handleSave = async () => {
		if (!name.trim()) {
			sonnerToast.error('文档名称不能为空');
			return;
		}
		if (!isValid) {
			sonnerToast.error('JSON 格式不正确');
			return;
		}

		setIsSaving(true);
		try {
			if (document) {
				await updateJsonDocument(document.id, { name, content: jsonText });
				sonnerToast.success(`文档 "${name}" 已更新`);
			} else {
				await createJsonDocument({ name, content: jsonText });
				sonnerToast.success(`文档 "${name}" 已创建`);
			}
			onSaved();
			onOpenChange(false);
		} catch {
			sonnerToast.error('保存失败，请稍后重试');
		} finally {
			setIsSaving(false);
		}
	};

	const formatTimestamp = useCallback((value?: string) => {
		if (!value) return '--';
		return new Date(value).toLocaleString('zh-CN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
	}, []);

	const formatSize = useCallback((bytes?: number) => {
		if (!bytes) return '--';
		return `${(bytes / 1024).toFixed(2)} KB`;
	}, []);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>查看/编辑 JSON 文档</DialogTitle>
					{/* <DialogDescription>修改文档名称和内容，然后保存更改</DialogDescription> */}
				</DialogHeader>

				{document && (
					<div className="mb-3 text-xs text-muted-foreground flex flex-wrap gap-4">
						<span>创建: {formatTimestamp(document.createdAt)}</span>
						<span>更新: {formatTimestamp(document.updatedAt)}</span>
						<span>大小: {formatSize(document.contentSize)}</span>
					</div>
				)}

				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="edit-name">文档名称</Label>
						<Input
							id="edit-name"
							placeholder="输入文档名称"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<JsonEditor
							jsonText={jsonText}
							setJsonText={setJsonText}
							isValid={isValid}
							setIsValid={setIsValid}
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						取消
					</Button>
					<Button onClick={handleSave} disabled={isSaving || !isValid}>
						{isSaving ? '保存中...' : '保存更改'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
