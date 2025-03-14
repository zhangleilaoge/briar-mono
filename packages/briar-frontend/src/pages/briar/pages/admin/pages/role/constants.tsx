import { Button, TreeDataNode } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { IRoleDTO } from 'briar-shared';

import { MenuKeyEnum, ROUTER_CONFIG } from '@/pages/briar/constants/router';
import useNavigateTo from '@/pages/briar/hooks/biz/useNavigateTo';

import { FieldType, ModelType } from './type';
import { convertLabelsToText } from './utils';

export const MODEL_TYPE_NAME = {
	[ModelType.Edit]: '编辑角色',
	[ModelType.Create]: '创建角色'
};

export const MODEL_OPT_NAME = {
	[ModelType.Edit]: '编辑',
	[ModelType.Create]: '创建'
};

export const getCols = (
	navigate: ReturnType<typeof useNavigateTo>,
	onStartEdit: (role: IRoleDTO) => void
) => {
	const cols: ColumnsType<IRoleDTO> = [
		{
			title: 'id',
			key: 'id',
			dataIndex: 'id'
		},
		{
			title: '角色名称',
			key: 'name',
			dataIndex: 'name'
		},
		{
			title: '描述',
			key: 'desc',
			dataIndex: 'desc'
		},
		{
			title: '用户数量',
			key: 'userCount',
			dataIndex: 'userCount',

			render: (userCount, data) =>
				userCount ? (
					<Button
						type="link"
						className="p-0"
						onClick={() => {
							navigate({
								target: MenuKeyEnum.UserList_3,
								query: {
									roleId: String(data.id)
								}
							});
						}}
					>
						{userCount}
					</Button>
				) : (
					0
				)
		},
		{
			title: '操作',
			key: 'action',
			render: (data) => {
				return (
					<Button type="link" onClick={() => onStartEdit(data)} className="p-0">
						编辑
					</Button>
				);
			}
		}
	];

	return cols;
};

export const INIT_FORM_VALUES: FieldType = {
	name: '',
	desc: '',
	menuKeys: []
};

export const TREE_DATA: TreeDataNode[] = convertLabelsToText(ROUTER_CONFIG);
