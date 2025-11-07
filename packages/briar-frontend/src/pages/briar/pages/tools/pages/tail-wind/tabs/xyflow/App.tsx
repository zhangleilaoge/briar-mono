import '@xyflow/react/dist/style.css';
import './style.scss';

import {
	addEdge,
	Background,
	MiniMap,
	Node,
	OnConnect,
	OnConnectEnd,
	ReactFlow,
	ReactFlowProvider,
	useEdgesState,
	useNodesState,
	useReactFlow
} from '@xyflow/react';
import { useCallback } from 'react';

import DevTools from './DevTools';
import { defaultEdges } from './edges';
import { defaultNodes } from './nodes';
import TextUpdaterNode from './TextUpdaterNode';

const nodeColor = (node: Node) => {
	switch (node.type) {
		case 'input':
			return '#6ede87';
		case 'output':
			return '#6865A5';
		case 'textUpdater':
			return '#493811';
		default:
			return '#ff0072';
	}
};

const nodeTypes = { textUpdater: TextUpdaterNode };
const nodeOrigin: [number, number] = [0.5, 0];
let id = 100;
const getId = () => `${id++}`;

function Flow() {
	const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
	const { screenToFlowPosition } = useReactFlow();

	const onConnect: OnConnect = useCallback(
		(params) => setEdges((eds) => addEdge(params, eds)),
		[setEdges]
	);

	const onConnectEnd: OnConnectEnd = useCallback(
		(event, connectionState) => {
			// when a connection is dropped on the pane it's not valid
			if (!connectionState.isValid) {
				// we need to remove the wrapper bounds, in order to get the correct position
				const id = getId();
				const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
				const newNode = {
					id,
					position: screenToFlowPosition({
						x: clientX,
						y: clientY
					}),
					data: { label: `Node ${id}` },
					origin: [0.5, 0.0]
				};

				// @ts-ignore
				setNodes((nds) => nds.concat(newNode));
				// @ts-ignore
				setEdges((eds) => eds.concat({ id, source: connectionState.fromNode.id, target: id }));
			}
		},
		[screenToFlowPosition, setEdges, setNodes]
	);
	return (
		<div className="h-[calc(100vh-300px)]">
			<ReactFlow
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				nodes={nodes}
				edges={edges}
				onConnect={onConnect}
				onConnectEnd={onConnectEnd}
				fitView
				nodeTypes={nodeTypes}
				nodeOrigin={nodeOrigin}
			>
				<Background />
				<MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
				<DevTools />
			</ReactFlow>
		</div>
	);
}

// eslint-disable-next-line react/display-name
export default () => (
	<ReactFlowProvider>
		<Flow />
	</ReactFlowProvider>
);
