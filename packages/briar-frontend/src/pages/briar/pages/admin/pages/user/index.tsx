import { useRequest } from 'alova/client';
import { Button, Divider, Form, Input, message, Select, Table } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { SorterResult } from 'antd/es/table/interface';
import { IPageInfo, IRoleDTO, IUserInfoDTO } from 'briar-shared';
import { omitBy } from 'lodash-es';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { getRoleList, getUserList, updateUser } from '@/pages/briar/api/user';

import Edit from './components/edit';
import { getCols } from './constants';
interface FieldType {
	keyword: string;
	roles: number[];
}

const DEFAULT_PAGE_INFO: IPageInfo = {
	page: 1,
	pageSize: 10,
	total: 0
};

const Role = () => {
	const [pageInfo, setPageInfo] = useState<IPageInfo>(DEFAULT_PAGE_INFO);
	const [data, setData] = useState<IUserInfoDTO[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [roleList, setRoleList] = useState<IRoleDTO[]>([]);
	const [searchForm] = useForm();
	const [editForm] = useForm();
	const { state } = useLocation();
	const [sortInfo, setSortInfo] = useState<{
		sortBy: string;
		sortType: 'asc' | 'desc' | null;
	}>({
		sortBy: '',
		sortType: null
	});
	const { onSuccess, loading, send } = useRequest(getUserList, {
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

	const onStartEdit = useCallback(
		(user: IUserInfoDTO) => {
			setIsModalOpen(true);
			editForm.setFieldsValue({
				...user
			});
		},
		[editForm]
	);

	const cols = useMemo(() => {
		return getCols({ roleList, onStartEdit, sortBy: sortInfo.sortBy, sortType: sortInfo.sortType });
	}, [onStartEdit, roleList, sortInfo.sortBy, sortInfo.sortType]);

	const defaultSearchFormValue = useMemo(() => {
		return {
			roles: state?.roleId ? [state.roleId] : []
		};
	}, [state]);

	const search = useCallback(
		(paginator?: IPageInfo) => {
			const { keyword, roles } = searchForm.getFieldsValue();

			if (pageInfo) {
				setPageInfo({
					...pageInfo,
					...paginator
				});
			}

			send({
				...pageInfo,
				...sortInfo,
				...paginator,
				...omitBy(
					{
						keyword,
						roles: roles?.join(',')
					},
					(v) => !v
				)
			});
		},
		[searchForm, pageInfo, send, sortInfo]
	);

	const editFinish = useCallback(() => {
		setIsModalOpen(false);
		updateUser(editForm.getFieldsValue()).then(() => {
			message.success('编辑成功');
			setPageInfo(DEFAULT_PAGE_INFO);
			search(DEFAULT_PAGE_INFO);
		});
	}, [editForm, search]);

	const onFinish = useCallback(() => {
		search(DEFAULT_PAGE_INFO);
	}, [search]);

	const roleOption = useMemo(() => {
		return roleList.map((item) => {
			return {
				label: item.name,
				value: item.id
			};
		});
	}, [roleList]);

	useEffect(() => {
		search();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pageInfo.page, sortInfo]);

	useEffect(() => {
		getRoleList().then(setRoleList);
	}, []);

	const handleChange = (
		_1: any,
		_2: any,
		sorter: SorterResult<IUserInfoDTO> | SorterResult<IUserInfoDTO>[]
	) => {
		const _sorter = sorter as SorterResult<IUserInfoDTO>;
		setSortInfo({
			sortBy: _sorter.field as string,
			sortType: _sorter.order ? (_sorter.order === 'ascend' ? 'asc' : 'desc') : null
		});
		setPageInfo(DEFAULT_PAGE_INFO);
	};

	return (
		<div>
			<Edit
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				onFinish={editFinish}
				form={editForm}
				roleOption={roleOption}
			/>
			<Form
				onFinish={onFinish}
				initialValues={defaultSearchFormValue}
				form={searchForm}
				className="flex justify-between"
			>
				<div className="flex gap-[28px] items-start">
					<Form.Item<FieldType>
						label="用户"
						name="keyword"
						validateTrigger="onBlur"
						className="mb-0"
					>
						<Input placeholder="请输入关键字" />
					</Form.Item>
					<Form.Item<FieldType> label="角色" name="roles" className="mb-0">
						<Select mode="multiple" allowClear options={roleOption} className="min-w-[180px]" />
					</Form.Item>
				</div>
				<Form.Item className="mb-0">
					<Button htmlType="submit" type="primary">
						查询
					</Button>
				</Form.Item>
			</Form>
			<Divider plain></Divider>
			<Table
				loading={loading}
				dataSource={data}
				columns={cols}
				scroll={{ x: 'max-content' }}
				bordered
				pagination={{
					total: pageInfo.total,
					pageSize: pageInfo.pageSize,
					current: pageInfo.page,
					showSizeChanger: false,
					onChange: (page) => {
						setPageInfo({
							...pageInfo,
							page
						});
					}
				}}
				onChange={handleChange}
			/>
		</div>
	);
};

export default Role;
