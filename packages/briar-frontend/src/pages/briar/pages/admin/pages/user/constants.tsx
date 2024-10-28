import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { IRoleDTO, IUserInfoDTO } from 'briar-shared';

export const getCols = (roleList: IRoleDTO[], onStartEdit: (role: IUserInfoDTO) => void) => {
	const cols: ColumnsType<IUserInfoDTO> = [
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
			title: '创建时间',
			key: 'createdAt',
			dataIndex: 'createdAt',
			render: (value) => new Date(value).toLocaleString()
		},
		{
			title: '用户角色',
			key: 'roles',
			dataIndex: 'roles',
			render: (roles) => {
				const result = roles
					.map((roleId: number) => {
						return roleList.find((role) => role.id === roleId)?.name;
					})
					.filter(Boolean)
					.join('、');

				return result || '-';
			}
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

export const INIT_FORM_VALUES = {
	roles: []
};
