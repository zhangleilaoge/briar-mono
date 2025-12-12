import 'jsoneditor/dist/jsoneditor.css';

import JSONEditor, { JSONEditorOptions } from 'jsoneditor';
import React, { useEffect, useRef } from 'react';

interface Props {
	jsonText: string;
	onChange: (newJsonText: string) => void;
	height?: string;
}

export default function JsonTableEditor({ jsonText, onChange, height = '300px' }: Props) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const editorRef = useRef<JSONEditor | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;
		const options: JSONEditorOptions = {
			mode: 'table',
			onChange() {
				try {
					const data = editorRef.current?.get();
					const text = JSON.stringify(data, null, 2);
					onChange(text);
				} catch {
					// ignore invalid states
				}
			}
		};
		editorRef.current = new JSONEditor(containerRef.current, options);
		try {
			const initial = JSON.parse(jsonText || '{}');
			editorRef.current.set(initial);
		} catch {
			editorRef.current.set({});
		}

		return () => {
			editorRef.current?.destroy();
			editorRef.current = null;
		};
	}, []);

	useEffect(() => {
		if (!editorRef.current) return;
		try {
			const current = editorRef.current.get();
			const next = JSON.parse(jsonText || '{}');
			if (JSON.stringify(current) !== JSON.stringify(next)) {
				editorRef.current.set(next);
			}
		} catch {
			// ignore
		}
	}, [jsonText]);

	return <div ref={containerRef} style={{ height, position: 'relative' }} />;
}
