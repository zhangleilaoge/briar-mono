import 'react-quill/dist/quill.snow.css';

import { Button, Form, Input, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect, useMemo } from 'react';
import ReactQuill from 'react-quill';

import { createBlog, editBlog, getBlog } from '@/pages/briar/api/blog';
import { MenuKeyEnum } from '@/pages/briar/constants/router';
import useNavigateTo from '@/pages/briar/hooks/biz/useNavigateTo';
import useQuery from '@/pages/briar/hooks/useQuery';
import { errorNotify } from '@/pages/briar/utils/notify';

export type FieldType = {
	title: string;
	content: string;
};

function Editor() {
	const [form] = useForm();
	const query = useQuery();

	const navigate = useNavigateTo();

	const modules = useMemo(() => {
		return {
			toolbar: [
				[
					{ header: [1, 2, 3, 4, 5, false] },
					'bold',
					'italic',
					'underline',
					'strike',
					'blockquote',
					{ list: 'ordered' },
					{ list: 'bullet' },
					{ indent: '-1' },
					{ indent: '+1' },
					'link',
					'image',
					{ color: [] },
					{ background: [] },
					'formula',
					'clean'
				]
			]
		};
	}, []);

	const submit = useCallback(
		(v: FieldType) => {
			if (query?.id) {
				editBlog({
					blog: v,
					id: +query?.id
				})
					.then(() => {
						message.success('编辑成功');
						navigate({
							target: MenuKeyEnum.Blog_1
						});
					})
					.catch((e) => {
						errorNotify(e);
					});
			} else {
				createBlog({
					blog: v
				}).then(() => {
					message.success('创建成功');
					navigate({
						target: MenuKeyEnum.Blog_1
					});
				});
			}
		},
		[navigate, query?.id]
	);

	useEffect(() => {
		if (!query?.id) return;
		getBlog({ id: +query?.id }).then((res) => {
			form.setFieldValue('title', res.title);
			form.setFieldValue('content', res.content);
		});
	}, [form, query?.id]);

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
			<div className="flex justify-between">
				<Form.Item
					name="title"
					label="标题"
					rules={[{ required: true }]}
					validateTrigger="onBlur"
					className="w-[480px]"
				>
					<Input placeholder="输入标题" maxLength={30} showCount />
				</Form.Item>
				<Button type="primary" htmlType="submit" className="mb-[24px]">
					提交
				</Button>
			</div>

			<Form.Item name="content" rules={[{ required: true }]} validateTrigger="onBlur">
				<ReactQuill theme="snow" modules={modules} className="ql-editor" />
			</Form.Item>
		</Form>
	);
}

export default Editor;
