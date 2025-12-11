import { autocompletion } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { json } from '@codemirror/lang-json';
import { EditorView, highlightActiveLine, keymap } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast as sonnerToast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// notifications handled by sonner in this component
import { createJsonDocument, JsonDocument, updateJsonDocument } from '../api';

interface JsonViewDialogProps {
	document: JsonDocument | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSaved: () => void;
}

export function JsonViewDialog({ document, open, onOpenChange, onSaved }: JsonViewDialogProps) {
	const [name, setName] = useState('');
	const [content, setContent] = useState('');
	const [isValid, setIsValid] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isReadOnly, setIsReadOnly] = useState(false);
	const [isCopied, setIsCopied] = useState(false);

	const extensions = useMemo(
		() => [
			json(),
			autocompletion(),
			history(),
			keymap.of([...defaultKeymap, ...historyKeymap]),
			EditorView.lineWrapping,
			highlightActiveLine()
		],
		[]
	);

	useEffect(() => {
		if (document) {
			setName(document.name);
			setContent(document.content);
		} else {
			setName('');
			setContent('');
		}
		setIsValid(true);
		setIsReadOnly(false);
	}, [document]);

	const validateJson = (value: string) => {
		try {
			JSON.parse(value);
			setIsValid(true);
			return true;
		} catch {
			setIsValid(false);
			return false;
		}
	};

	const handleContentChange = (value: string) => {
		setContent(value);
		validateJson(value);
	};

	const formatJson = () => {
		try {
			const parsed = JSON.parse(content);
			const formatted = JSON.stringify(parsed, null, 2);
			setContent(formatted);
			setIsValid(true);
			sonnerToast.success('JSON 已格式化');
		} catch {
			sonnerToast('JSON 格式不正确');
		}
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(content);
			setIsCopied(true);
			console.log('Content copied to clipboard');
			sonnerToast.success('已复制');
			setTimeout(() => setIsCopied(false), 1500);
		} catch {
			sonnerToast.error('复制失败，请手动复制内容');
		}
	};

	const handleSave = async () => {
		if (!name.trim()) {
			sonnerToast.error('文档名称不能为空');
			return;
		}
		if (!validateJson(content)) {
			sonnerToast.error('JSON 格式不正确');
			return;
		}

		setIsSaving(true);
		try {
			if (document) {
				await updateJsonDocument(document.id, { name, content });
				sonnerToast.success(`文档 "${name}" 已更新`);
			} else {
				await createJsonDocument({ name, content });
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
					<DialogDescription>修改文档名称和内容，然后保存更改</DialogDescription>
				</DialogHeader>

				{document && (
					<div className="mb-3 text-xs text-muted-foreground flex flex-wrap gap-4">
						<span>创建: {formatTimestamp(document.createdAt)}</span>
						<span>更新: {formatTimestamp(document.updatedAt)}</span>
						<span>大小: {formatSize(document.contentSize)}</span>
					</div>
				)}

				<div className="space-y-4 py-4">
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
						<div className="flex flex-wrap items-center justify-between gap-2">
							<Label htmlFor="edit-content">JSON 内容</Label>
							<div className="flex flex-wrap items-center gap-2">
								<Button variant="outline" size="sm" onClick={formatJson}>
									格式化
								</Button>
								<Button variant="outline" size="sm" onClick={handleCopy}>
									{isCopied ? '已复制' : '复制内容'}
								</Button>
								<Button variant="outline" size="sm" onClick={() => setIsReadOnly((prev) => !prev)}>
									{isReadOnly ? '切换编辑' : '只读模式'}
								</Button>
							</div>
						</div>
						<div className="relative">
							<CodeMirror
								id="edit-content"
								value={content}
								extensions={extensions}
								height="300px"
								theme="light"
								className={`rounded-md border bg-background text-sm font-mono border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
								onChange={handleContentChange}
								editable={!isReadOnly}
								placeholder='{
  "key": "value"
}'
							/>
							{!isValid && <p className="text-sm text-red-500 mt-2">JSON 格式不正确，请检查语法</p>}
						</div>
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
