import { Button, Flex, Form, GetRef, Input, InputRef, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { useContext, useEffect, useRef, useState } from 'react';
import React from 'react';

import { LocalStorageKey } from '@/pages/briar/constants/env';
import { leFormatNumber } from '@/pages/briar/utils/format';

// @ts-ignore
import Cal from './App';
import CalculateContext from './context';
import s from './style.module.scss';

interface IData {
	createdAt: string;
	result: string;
	remark: string;
}

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<{
	form: FormInstance<IData> | null;
}>({
	form: null
});

interface EditableCellProps {
	title: React.ReactNode;
	editable: boolean;
	dataIndex: keyof IData;
	record: IData;
	handleSave: (record: IData) => void;
}

const COLS: ColumnsType<IData> = [
	{
		title: '创建日期',
		dataIndex: 'createdAt',
		key: 'createdAt',
		width: 200,
		render: (value) => new Date(value).toLocaleString()
	},
	{
		title: '计算结果',
		dataIndex: 'result',
		key: 'result',
		render: (value) => value
	},
	{
		title: '备注',
		dataIndex: 'remark',
		key: 'remark',
		width: 300,
		render: (value) => value
	}
];

const EditableRow = ({ ...props }) => {
	const [form] = Form.useForm();
	return (
		<Form form={form} component={false}>
			<EditableContext.Provider
				value={{
					form
				}}
			>
				<tr {...props} />
			</EditableContext.Provider>
		</Form>
	);
};

// 后续有需要集成一下这个能力
const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
	title,
	editable,
	children,
	dataIndex,
	record,
	handleSave,
	...restProps
}) => {
	const [editing, setEditing] = useState(false);
	const inputRef = useRef<InputRef>(null);

	const { form } = useContext(EditableContext)!;
	const { calculatorDisabledRef } = useContext(CalculateContext);

	useEffect(() => {
		if (editing) {
			inputRef.current?.focus();
		}
	}, [editing]);

	const toggleEdit = () => {
		setEditing(!editing);
		form?.setFieldsValue({ [dataIndex]: record[dataIndex] });
	};

	const save = async (e: any) => {
		e.preventDefault();
		calculatorDisabledRef.current = false;
		try {
			const values = await form?.validateFields();

			toggleEdit();
			handleSave({ ...record, ...values });
		} catch (errInfo) {
			console.log('Save failed:', errInfo);
		}
	};

	let childNode = children;

	if (editable) {
		childNode = editing ? (
			<Form.Item
				style={{ margin: 0 }}
				name={dataIndex}
				rules={[{ required: true, message: `${title} is required.` }]}
			>
				<Input
					ref={inputRef}
					onPressEnter={save}
					onBlur={save}
					onFocus={() => {
						calculatorDisabledRef.current = true;
					}}
				/>
			</Form.Item>
		) : (
			<div
				className={s['editable-cell-value-wrap']}
				style={{ paddingInlineEnd: 24 }}
				onClick={toggleEdit}
			>
				{children}
			</div>
		);
	}

	return <td {...restProps}>{childNode}</td>;
};

const components = {
	body: {
		row: EditableRow,
		cell: EditableCell
	}
};

const Calculator = () => {
	const [data, setData] = useState<IData[]>(
		JSON.parse(localStorage.getItem(LocalStorageKey.CalculateResult) || '[]')
	);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const calculatorDisabledRef = useRef(false);

	const addResult = (res: string) => {
		const newData = [
			{
				createdAt: new Date().toLocaleString(),
				result: res,
				remark: '-'
			},
			...data
		];
		setData(newData);
		localStorage.setItem(LocalStorageKey.CalculateResult, JSON.stringify(newData));
	};

	const deleteResults = () => {
		const newData = data.filter((item) => !selectedRowKeys.includes(item.createdAt));
		setData(newData);
		localStorage.setItem(LocalStorageKey.CalculateResult, JSON.stringify(newData));

		setSelectedRowKeys([]);
	};

	const onEqual = (res: string | number) => {
		addResult(res.toString().replace(' ', ''));
	};

	const rowSelection: TableRowSelection<IData> = {
		selectedRowKeys,
		onChange: (newSelectedRowKeys: React.Key[]) => {
			setSelectedRowKeys(newSelectedRowKeys);
		}
	};

	const hasSelected = selectedRowKeys.length > 0;

	const handleSave = (row: IData) => {
		const newData = [...data];
		const index = newData.findIndex((item) => row.createdAt === item.createdAt);
		const item = newData[index];
		newData.splice(index, 1, {
			...item,
			...row
		});
		setData(newData);
		localStorage.setItem(LocalStorageKey.CalculateResult, JSON.stringify(newData));
	};

	const columns = COLS.map((col) => {
		if (col.key !== 'remark') {
			return col;
		}
		return {
			...col,
			onCell: (record: IData) => ({
				record,
				editable: true,
				dataIndex: col.key,
				title: col.title as string,
				handleSave
			})
		};
	});

	return (
		<CalculateContext.Provider value={{ calculatorDisabledRef }}>
			<div className="flex justify-between gap-6">
				<Cal onEqual={onEqual} />
				<div className="flex-1 flex flex-col gap-4">
					<Flex align="center" gap="middle">
						<Button type="primary" onClick={deleteResults} disabled={!hasSelected}>
							删除
						</Button>
						{hasSelected ? `选中 ${selectedRowKeys.length} 项` : null}
					</Flex>
					<Table
						components={components}
						rowSelection={rowSelection}
						dataSource={data.map(
							(item) =>
								({
									...item,
									result: leFormatNumber({
										value: item.result,
										isAmount: true
									})
								}) as any
						)}
						columns={columns}
						scroll={{ x: '100%' }}
						rowKey={(row) => row.createdAt}
						pagination={{ pageSize: 6 }}
					/>
				</div>
			</div>
		</CalculateContext.Provider>
	);
};

export default Calculator;
