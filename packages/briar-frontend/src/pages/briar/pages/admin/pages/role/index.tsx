import { useRequest } from 'alova/client';
import { Button, Divider, Form, Input, message, Modal, Table, Tree } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { IRoleDTO, IRolesWithUserCount } from 'briar-shared';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { addRole, getRoleList, updateRole } from '@/pages/briar/api/user';
import { errorNotify } from '@/pages/briar/utils/notify';

import { getCols, INIT_FORM_VALUES, MODEL_OPT_NAME, MODEL_TYPE_NAME, TREE_DATA } from './constants';
import { FieldType, ICheckKeys, ModelType } from './type';

const Role = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = useForm();
	const [model, setModel] = useState(ModelType.Create);
	const [tableData, setTableData] = useState<IRolesWithUserCount[]>([]);
	const { send, onSuccess, loading } = useRequest(getRoleList, {
		immediate: true
	});
	const navigate = useNavigate();

	onSuccess(({ data }) => {
		setTableData(data);
	});

	const onFinish = (values: FieldType) => {
		console.log('values: ', values);
		if (model === ModelType.Create) {
			addRole(values)
				.then(() => {
					setIsModalOpen(false);
					message.success('添加角色成功');
					send();
				})
				.catch((err) => {
					errorNotify(err);
				});
		} else {
			if (!values.id) {
				message.error('缺少编辑对象');
				return;
			}
			// @ts-ignore 已对 id 有效性进行校验
			updateRole(values)
				.then(() => {
					setIsModalOpen(false);
					message.success('编辑角色成功');
					send();
				})
				.catch((err) => {
					errorNotify(err);
				});
		}
	};

	const onCheck = (checkedKeys: ICheckKeys) => {
		form.setFieldsValue({ menuKeys: checkedKeys });
	};

	const openCreateModal = () => {
		setIsModalOpen(true);
		setModel(ModelType.Create);
		form.setFieldsValue(INIT_FORM_VALUES);
	};

	const onStartEdit = useCallback(
		(role: IRoleDTO) => {
			setIsModalOpen(true);
			setModel(ModelType.Edit);
			form.setFieldsValue({
				...role,
				modelName: MODEL_TYPE_NAME[ModelType.Edit]
			});
		},
		[form]
	);

	const cols = useMemo(() => {
		return getCols(navigate, onStartEdit);
	}, [navigate, onStartEdit]);

	return (
		<div>
			<Modal
				open={isModalOpen}
				footer={null}
				onCancel={() => {
					setIsModalOpen(false);
				}}
				title={MODEL_TYPE_NAME[model]}
				destroyOnClose
			>
				<Form
					onFinish={onFinish}
					className="wd-full flex gap-[8px] flex-col items-center mt-[32px]"
					layout="vertical"
					initialValues={INIT_FORM_VALUES}
					form={form}
				>
					<Form.Item name="id" hidden></Form.Item>
					<Form.Item<FieldType>
						label="角色名称"
						name="name"
						validateTrigger="onBlur"
						rules={[{ required: true }]}
					>
						<Input style={{ width: '400px' }} />
					</Form.Item>
					<Form.Item<FieldType>
						label="描述"
						name="desc"
						validateTrigger="onBlur"
						rules={[{ required: true }]}
					>
						<Input.TextArea style={{ width: '400px' }} />
					</Form.Item>
					<Form.Item<FieldType> label="权限菜单" name="menuKeys">
						<Tree
							className="w-[400px] max-h-[240px] overflow-y-auto"
							checkable
							defaultCheckedKeys={form.getFieldValue('menuKeys') || []}
							onCheck={onCheck}
							treeData={TREE_DATA}
						/>
					</Form.Item>
					<Form.Item>
						<Button htmlType="submit" type="primary">
							{MODEL_OPT_NAME[model]}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
			<Button type="primary" onClick={openCreateModal}>
				添加角色
			</Button>
			<Divider plain></Divider>
			<Table
				loading={loading}
				dataSource={tableData}
				columns={cols}
				scroll={{ x: 'max-content' }}
				bordered
			/>
		</div>
	);
};

export default Role;
