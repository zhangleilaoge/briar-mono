import { useRequest } from 'alova/client';
import { Button, Divider, Form, Input, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { IPageInfo, IShortUrlDTO, UrlEnum } from 'briar-shared';
import { useState } from 'react';

import { getShortUrlList } from '@/pages/briar/api/short-url';

const { Text } = Typography;

const columns: ColumnsType<IShortUrlDTO> = [
	{
		title: '短链',
		dataIndex: 'code',
		key: 'code',
		width: 300,
		render: (value) => <Text>{UrlEnum.Base + value}</Text>
	},
	{
		title: '原始链接',
		dataIndex: 'url',
		key: 'url',
		render: (value) => <Text>{value}</Text>
	}
];

const ShortUrList = () => {
	const [searchText, setSearchText] = useState('');
	const [pageInfo, setPageInfo] = useState<IPageInfo>({
		page: 1,
		pageSize: 10,
		total: 0
	});
	const [data, setData] = useState<IShortUrlDTO[]>([]);
	const { send, onSuccess, loading } = useRequest(getShortUrlList, {
		immediate: false
	});

	onSuccess(({ data }) => {
		const { items, paginator } = data;
		setData(items);
		setPageInfo({
			...pageInfo,
			...paginator
		});
	});

	const handleSearchInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		setSearchText(e.target.value);
	};

	const handleSearch = () => {
		send({
			...pageInfo,
			url: searchText
		});
	};

	const handleChange = (page: number, pageSize: number) => {
		setPageInfo({
			...pageInfo,
			page,
			pageSize
		});

		setData([]);
	};

	return (
		<div>
			<Form.Item label="url" name="url">
				<Input placeholder="输入 URL" onChange={handleSearchInput} className="mr-[8px]" />
			</Form.Item>
			<Button type="primary" onClick={handleSearch}>
				搜索
			</Button>
			<Divider plain></Divider>
			<Table
				loading={loading}
				dataSource={data}
				columns={columns}
				className="mt-[16px]"
				pagination={{
					current: pageInfo.page,
					pageSize: pageInfo.pageSize,
					total: pageInfo.total,
					onChange: handleChange
				}}
				scroll={{ x: '100%' }}
			/>
		</div>
	);
};

export default ShortUrList;
