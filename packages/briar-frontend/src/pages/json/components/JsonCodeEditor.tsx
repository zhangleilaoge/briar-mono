import { useMount } from 'ahooks';
import JSONEditor, { JSONEditorOptions } from 'jsoneditor';
import { useEffect, useRef } from 'react';

interface Props {
	jsonText: string;
	onChange: (newJsonText: string) => void;
	height?: string;
}

const removeEscapes = (input: string) => {
	const remove = (str: string) => {
		return str.replace(/\\\"/g, '"').replace(/\\\\/g, '\\');
	};
	let result = input;
	let prevResult = input;
	do {
		result = remove(result);
	} while (result !== prevResult && (prevResult = result));
	// 使用正则表达式去除转义字符
	return result;
};

export default function JsonCodeEditor({ jsonText, onChange, height = '300px' }: Props) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const editorRef = useRef<JSONEditor | null>(null);

	useMount(() => {
		if (!containerRef.current || editorRef.current) return;
		const options: JSONEditorOptions = {
			mode: 'code',
			mainMenuBar: true,
			navigationBar: true,
			statusBar: true,
			history: true,
			language: 'zh-CN',
			// escapeUnicode: true,
			onChangeText(_text: string) {
				const text = removeEscapes(_text);
				console.log('onChangeText', text);
				try {
					// validate parse; if invalid, keep text but don't propagate invalid JSON upstream
					JSON.parse(text);
					onChange(text);
				} catch {
					onChange(text); // allow upstream to mark invalid if needed
				}
			}
		};
		editorRef.current = new JSONEditor(containerRef.current, options);
		// initialize as text to avoid resetting history; empty string means cleared editor
		editorRef.current.setText(jsonText || '');

		return () => {
			editorRef.current?.destroy();
			editorRef.current = null;
		};
	});

	// sync external changes
	useEffect(() => {
		if (!editorRef.current) return;
		try {
			const current = editorRef.current.getText?.();
			const next = removeEscapes(jsonText) || '';
			if (current !== next) {
				// prefer updateText to preserve history (undo/redo) on programmatic changes
				if (typeof (editorRef.current as any).updateText === 'function') {
					(editorRef.current as any).updateText(next);
				} else {
					editorRef.current.setText(next);
				}
			}
		} catch {
			console.log('???');
			// ignore
		}
	}, [jsonText]);

	return <div ref={containerRef} style={{ height, position: 'relative' }} />;
}
