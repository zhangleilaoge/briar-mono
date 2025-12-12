import JSONEditor, { JSONEditorOptions } from 'jsoneditor';
import { useEffect, useRef } from 'react';

interface Props {
	jsonText: string;
	onChange: (newJsonText: string) => void;
	height?: string;
}

export default function JsonCodeEditor({ jsonText, onChange, height = '300px' }: Props) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const editorRef = useRef<JSONEditor | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;
		const options: JSONEditorOptions = {
			mode: 'code',
			onChangeText(text: string) {
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
		try {
			const initial = JSON.parse(jsonText || '{}');
			editorRef.current.set(initial);
		} catch {
			// if invalid, set as text
			editorRef.current.setText(jsonText || '{}');
		}

		return () => {
			editorRef.current?.destroy();
			editorRef.current = null;
		};
	}, []);

	// sync external changes
	useEffect(() => {
		if (!editorRef.current) return;
		try {
			const current = editorRef.current.getText?.();
			if (current !== jsonText) {
				// prefer setText to preserve formatting in code mode
				editorRef.current.setText(jsonText || '{}');
			}
		} catch {
			// ignore
		}
	}, [jsonText]);

	return <div ref={containerRef} style={{ height, position: 'relative' }} />;
}
