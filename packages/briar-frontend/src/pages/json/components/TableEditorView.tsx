interface Props {
	data: any;
	onChange: (newData: any) => void;
}

export default function TableEditorView({ data, onChange }: Props) {
	if (!data || typeof data !== 'object') return <div className="text-sm">--</div>;
	const entries = Object.entries(data);

	const handleChange = (key: string, value: string) => {
		const copy = { ...data };
		// try to parse JSON for objects/arrays/numbers
		try {
			copy[key] = JSON.parse(value);
		} catch {
			copy[key] = value;
		}
		onChange(copy);
	};

	return (
		<table className="w-full text-sm table-auto border-collapse">
			<thead>
				<tr>
					<th className="text-left p-1 border">Key</th>
					<th className="text-left p-1 border">Value</th>
				</tr>
			</thead>
			<tbody>
				{entries.map(([k, v]) => (
					<tr key={k}>
						<td className="p-1 border align-top">{k}</td>
						<td className="p-1 border align-top">
							<input
								className="w-full border p-1 rounded text-sm"
								value={typeof v === 'object' ? JSON.stringify(v) : String(v)}
								onChange={(e) => handleChange(k, e.target.value)}
							/>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
