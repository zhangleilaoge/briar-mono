import 'react-quill/dist/quill.snow.css';

import { Button, Form, Input, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill';

import { createBlog } from '@/pages/briar/api/blog';
import { MenuKeyEnum } from '@/pages/briar/constants/router';
import useNavigateTo from '@/pages/briar/hooks/biz/useNavigateTo';

export type FieldType = {
	title: string;
	content: string;
};

enum Scene {
	create = 'create',
	update = 'update'
}

function Editor() {
	const [form] = useForm();
	const scene = Scene.create;
	const submitTitle = scene === Scene.create ? '创建' : '更新';
	const navigate = useNavigateTo();

	const submit = useCallback(
		(v: FieldType) => {
			createBlog({
				blog: v
			}).then(() => {
				message.success('创建成功');
				navigate({
					target: MenuKeyEnum.Blog_1
				});
			});
		},
		[navigate]
	);

	const initValues = useMemo(() => {
		return {
			title: '',
			content: ''
		};
	}, []);

	return (
		<Form
			onFinish={submit}
			requiredMark={false}
			form={form}
			initialValues={initValues}
			className="mt-[12px]"
		>
			<Button type="primary" htmlType="submit" className="mb-[24px]">
				{submitTitle}
			</Button>
			<Form.Item name="title" label="标题" rules={[{ required: true }]} validateTrigger="onBlur">
				<Input placeholder="输入标题" />
			</Form.Item>
			<Form.Item name="content" rules={[{ required: true }]} validateTrigger="onBlur">
				<ReactQuill theme="snow" />
			</Form.Item>
		</Form>
	);
}

export default Editor;
