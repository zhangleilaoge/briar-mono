import React from 'react';
interface Props {
	data: any;
	onChange: (newData: any) => void;
}

type Path = (string | number)[];

function deepClone<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}

function setAtPath(root: any, path: Path, value: any) {
	const copy = deepClone(root);
	if (path.length === 0) {
		return value;
	}
	let cur: any = copy;
	for (let i = 0; i < path.length - 1; i++) {
		cur = cur[path[i] as any];
	}
	cur[path[path.length - 1] as any] = value;
	return copy;
}

function deleteAtPath(root: any, path: Path) {
	const copy = deepClone(root);
	if (path.length === 0) return undefined;
	let cur: any = copy;
	for (let i = 0; i < path.length - 1; i++) {
		cur = cur[path[i] as any];
	}
	const last = path[path.length - 1];
	if (Array.isArray(cur)) {
		cur.splice(Number(last), 1);
	} else {
		delete cur[last as any];
	}
	return copy;
}

function renameKey(root: any, path: Path, newKey: string) {
	const copy = deepClone(root);
	if (path.length === 0) return copy;
	let cur: any = copy;
	for (let i = 0; i < path.length - 2; i++) {
		cur = cur[path[i] as any];
	}
	const oldKey = path[path.length - 1] as string;
	const parent = cur[path[path.length - 2] as any] ?? cur;
	if (Array.isArray(parent)) return copy; // arrays use numeric indices, skip rename
	if (parent && typeof parent === 'object') {
		const val = parent[oldKey];
		delete parent[oldKey];
		parent[newKey] = val;
	}
	return copy;
}

function NodeEditor({
	root,
	data,
	path,
	onChange
}: {
	root: any;
	data: any;
	path: Path;
	onChange: (newRoot: any) => void;
}) {
	const isObject = data && typeof data === 'object' && !Array.isArray(data);
	const isArray = Array.isArray(data);
	const [collapsed, setCollapsed] = React.useState(false);

	const handleValueChange = (raw: string) => {
		let value: any = raw;
		// try JSON parse for complex values
		try {
			value = JSON.parse(raw);
		} catch {
			// keep string
		}
		onChange(setAtPath(root, path, value));
	};

	const handleTypeChange = (type: string) => {
		let next: any;
		switch (type) {
			case 'string':
				next = '';
				break;
			case 'number':
				next = 0;
				break;
			case 'boolean':
				next = false;
				break;
			case 'null':
				next = null;
				break;
			case 'object':
				next = {};
				break;
			case 'array':
				next = [];
				break;
			default:
				next = '';
		}
		onChange(setAtPath(root, path, next));
	};

	const handleDelete = () => {
		onChange(deleteAtPath(root, path));
	};

	const handleRename = (newKey: string) => {
		onChange(renameKey(root, path, newKey));
	};

	const addProperty = () => {
		const cur = deepClone(root);
		let parent: any = cur;
		for (let i = 0; i < path.length; i++) parent = parent[path[i] as any];
		if (parent && typeof parent === 'object' && !Array.isArray(parent)) {
			const base = 'key';
			let k = base;
			let idx = 1;
			while (k in parent) {
				k = `${base}${idx++}`;
			}
			parent[k] = '';
		}
		onChange(setAtPath(root, path, parent));
	};

	const addArrayItem = () => {
		const cur = deepClone(root);
		let arr: any = cur;
		for (let i = 0; i < path.length; i++) arr = arr[path[i] as any];
		if (Array.isArray(arr)) {
			arr.push('');
		}
		onChange(setAtPath(root, path, arr));
	};

	// Leaf primitive editor
	if (!isObject && !isArray) {
		return (
			<div className="flex items-center gap-2 py-1.5">
				<select
					className="border rounded p-1 text-sm bg-background"
					value={
						typeof data === 'string'
							? 'string'
							: typeof data === 'number'
								? 'number'
								: typeof data === 'boolean'
									? 'boolean'
									: data === null
										? 'null'
										: 'string'
					}
					onChange={(e) => handleTypeChange(e.target.value)}
				>
					<option value="string">string</option>
					<option value="number">number</option>
					<option value="boolean">boolean</option>
					<option value="null">null</option>
					<option value="object">object</option>
					<option value="array">array</option>
				</select>
				<input
					className="border p-1 text-sm rounded w-full bg-background"
					value={typeof data === 'object' ? JSON.stringify(data) : String(data)}
					onChange={(e) => handleValueChange(e.target.value)}
				/>
				<button
					className="text-xs text-red-600 hover:underline"
					onClick={handleDelete}
					title="删除"
				>
					删除
				</button>
			</div>
		);
	}

	// Object editor
	if (isObject) {
		const entries = Object.entries(data);
		return (
			<div className="space-y-2 pl-2 border-l">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<button
							className="text-xs"
							onClick={() => setCollapsed((c) => !c)}
							title={collapsed ? '展开' : '折叠'}
						>
							{collapsed ? '▶' : '▼'}
						</button>
						<select
							className="border rounded p-1 text-sm bg-background"
							value="object"
							onChange={(e) => handleTypeChange(e.target.value)}
						>
							<option value="object">object</option>
							<option value="array">array</option>
							<option value="string">string</option>
							<option value="number">number</option>
							<option value="boolean">boolean</option>
							<option value="null">null</option>
						</select>
						<button className="text-xs hover:underline" onClick={addProperty}>
							添加属性
						</button>
					</div>
					{path.length > 0 && (
						<button
							className="text-xs text-red-600 hover:underline"
							onClick={handleDelete}
							title="删除"
						>
							删除
						</button>
					)}
				</div>
				{!collapsed && (
					<div className="space-y-2">
						{entries.map(([key, val]) => (
							<div key={key} className="space-y-1">
								<div className="flex items-center gap-2">
									<input
										className="border p-1 text-sm rounded bg-background"
										defaultValue={key}
										onBlur={(e) => {
											const nv = e.target.value;
											if (nv && nv !== key) handleRename(nv);
										}}
									/>
									<span className="font-medium">:</span>
								</div>
								<div className="pl-4">
									<NodeEditor root={root} data={val} path={[...path, key]} onChange={onChange} />
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		);
	}

	// Array editor
	if (isArray) {
		return (
			<div className="space-y-2 pl-2 border-l">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<button
							className="text-xs"
							onClick={() => setCollapsed((c) => !c)}
							title={collapsed ? '展开' : '折叠'}
						>
							{collapsed ? '▶' : '▼'}
						</button>
						<select
							className="border rounded p-1 text-sm bg-background"
							value="array"
							onChange={(e) => handleTypeChange(e.target.value)}
						>
							<option value="array">array</option>
							<option value="object">object</option>
							<option value="string">string</option>
							<option value="number">number</option>
							<option value="boolean">boolean</option>
							<option value="null">null</option>
						</select>
						<button className="text-xs hover:underline" onClick={addArrayItem}>
							添加项
						</button>
					</div>
					{path.length > 0 && (
						<button
							className="text-xs text-red-600 hover:underline"
							onClick={handleDelete}
							title="删除"
						>
							删除
						</button>
					)}
				</div>
				{!collapsed && (
					<div className="space-y-2">
						{data.map((val: any, idx: number) => (
							<div key={idx} className="pl-4">
								<NodeEditor root={root} data={val} path={[...path, idx]} onChange={onChange} />
							</div>
						))}
					</div>
				)}
			</div>
		);
	}

	return null;
}

export default function TreeEditorView({ data, onChange }: Props) {
	return (
		<div>
			<NodeEditor root={data} data={data} path={[]} onChange={onChange} />
		</div>
	);
}
