import { autocompletion } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { json } from '@codemirror/lang-json';
import { EditorView, highlightActiveLine, keymap } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';

interface Props {
	content: string;
	onChange: (value: string) => void;
	className?: string;
}

export default function CodeEditorView({ content, onChange, className }: Props) {
	const extensions = [
		json(),
		autocompletion(),
		history(),
		keymap.of([...defaultKeymap, ...historyKeymap]),
		EditorView.lineWrapping,
		highlightActiveLine()
	];

	return (
		<div className={className}>
			<CodeMirror
				id="edit-content"
				value={content}
				extensions={extensions}
				height="300px"
				theme="light"
				className={`rounded-md border bg-background text-sm font-mono border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
				onChange={onChange}
				placeholder='{
  "key": "value"
}'
			/>
		</div>
	);
}
