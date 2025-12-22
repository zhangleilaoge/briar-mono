import 'jsoneditor/dist/jsoneditor.css';

import { useCallback, useState } from 'react';
import { toast as sonnerToast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import JsonCodeEditor from '../components/JsonCodeEditor';
import JsonTreeEditor from '../components/JsonTreeEditor';

export default function JsonEditor({
	jsonText,
	setJsonText,
	isValid,
	setIsValid
}: {
	jsonText: string;
	setJsonText: (text: string) => void;
	isValid: boolean;
	setIsValid: (valid: boolean) => void;
}) {
	const [isTreeView, setIsTreeView] = useState<boolean>(false);

	const validate = useCallback(
		(text: string) => {
			try {
				JSON.parse(text);
				setIsValid(true);
				return true;
			} catch {
				setIsValid(false);
				return false;
			}
		},
		[setIsValid]
	);

	const copyJson = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(jsonText || '');
			sonnerToast.success('已复制');
		} catch {
			sonnerToast.error('复制失败');
		}
	}, [jsonText]);

	const clearJson = useCallback(() => {
		setJsonText('');
		setIsValid(true);
	}, [setIsValid, setJsonText]);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h2 className="text-xl font-semibold">JSON 编辑器</h2>
					<p className="text-sm text-muted-foreground">支持格式化、压缩、复制、清空</p>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Button variant="outline" size="sm" onClick={copyJson}>
					复制
				</Button>
				<Button variant="outline" size="sm" onClick={clearJson}>
					清空
				</Button>
				<div className="flex items-center space-x-2">
					<Switch id="tree-view" checked={isTreeView} onCheckedChange={setIsTreeView} />
					<Label htmlFor="tree-view">树状图预览</Label>
				</div>
			</div>

			{isTreeView ? (
				<JsonTreeEditor
					jsonText={jsonText}
					onChange={(text) => {
						setJsonText(text);
						validate(text);
					}}
					height="calc(100vh - 360px)"
				/>
			) : (
				<JsonCodeEditor
					jsonText={jsonText}
					onChange={(text) => {
						setJsonText(text);
						validate(text);
					}}
					height="calc(100vh - 360px)"
				/>
			)}

			{!isValid && <p className="text-sm text-red-500">当前内容不是有效的 JSON</p>}
		</div>
	);
}
