import { Button, Form, Modal, Select } from 'antd';
import { FormInstance } from 'antd/es/form/Form';

import { INIT_FORM_VALUES } from '../constants';
import { FieldType } from '../type';

interface IProps {
	isModalOpen: boolean;
	setIsModalOpen: (isModalOpen: boolean) => void;
	onFinish: () => void;
	form: FormInstance<FieldType>;
	roleOption: {
		label: string;
		value: number;
	}[];
}

const Edit = (props: IProps) => {
	const { isModalOpen, roleOption, setIsModalOpen, onFinish, form } = props;
	return (
		<Modal
			open={isModalOpen}
			footer={null}
			onCancel={() => {
				setIsModalOpen(false);
			}}
			title={'编辑用户'}
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
				<Form.Item name="roles" hidden></Form.Item>
				<Form.Item<FieldType> label="角色" name="roles">
					<Select mode="multiple" allowClear options={roleOption} className="min-w-[400px]" />
				</Form.Item>
				<Form.Item>
					<Button htmlType="submit" type="primary">
						编辑
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default Edit;
