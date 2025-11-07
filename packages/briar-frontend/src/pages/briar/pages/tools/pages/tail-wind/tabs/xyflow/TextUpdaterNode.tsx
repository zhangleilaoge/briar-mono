import { Handle, NodeProps, Position } from '@xyflow/react';
import { useCallback } from 'react';

function TextUpdaterNode(props: NodeProps) {
	const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
		console.log(evt.target.value);
	}, []);

	console.log(props);

	return (
		<div className="text-updater-node">
			{/* 添加目标连接点 */}
			<Handle
				type="target"
				position={Position.Top}
				onConnect={(params) => console.log('连接到节点4', params)}
			/>
			<Handle type="source" position={Position.Bottom} />
			<div>
				<label htmlFor="text">Text: </label>
				<input
					id="text"
					name="text"
					onChange={onChange}
					className="nodrag"
					defaultValue={props.data.value as string}
				/>
			</div>
		</div>
	);
}

export default TextUpdaterNode;
