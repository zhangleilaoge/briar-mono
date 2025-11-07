export const defaultNodes = [
	{
		id: '1',
		type: 'input',
		data: { label: 'Input Node' },
		position: { x: 250, y: 25 },
		style: { backgroundColor: '#6ede87', color: 'white' }
	},

	{
		id: '2',
		data: { label: <div>Default Node</div> },
		position: { x: 100, y: 125 },
		style: { backgroundColor: '#ff0072', color: 'white' }
	},
	{
		id: '3',
		// type: 'output',
		data: { label: 'Output Node' },
		position: { x: 250, y: 250 },
		style: { backgroundColor: '#6865A5', color: 'white' }
	},
	{
		id: '4',
		type: 'textUpdater',
		position: { x: 100, y: 375 },
		data: { value: 123 }
	}
];
