import 'react-quill/dist/quill.snow.css';

import { Button, Form, Input, message, Radio } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { IBlogDTO, ShowRangeEnum } from 'briar-shared';
import { useCallback, useEffect, useMemo } from 'react';
import ReactQuill from 'react-quill';

import { createBlog, editBlog, getBlog } from '@/pages/briar/api/blog';
import { MenuKeyEnum } from '@/pages/briar/constants/router';
import useNavigateTo from '@/pages/briar/hooks/biz/useNavigateTo';
import useQuery from '@/pages/briar/hooks/useQuery';
import { errorNotify } from '@/pages/briar/utils/notify';

export type FieldType = Pick<IBlogDTO, 'title' | 'content' | 'showRange'>;

const SHOW_RANGE_OPTIONS = [
	{
		label: '公开',
		value: ShowRangeEnum.Public
	},
	{
		label: '私密',
		value: ShowRangeEnum.Private
	}
];

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
			form.setFieldValue('showRange', res.showRange);
		});
	}, [form, query?.id]);

	const initValues = useMemo(() => {
		return {
			title: '',
			content: '',
			showRange: ShowRangeEnum.Public
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
			<Form.Item
				name="title"
				labelCol={{ span: 3 }}
				label="标题"
				rules={[{ required: true }]}
				validateTrigger="onBlur"
			>
				<Input placeholder="输入标题" maxLength={30} showCount />
			</Form.Item>
			<Form.Item
				labelCol={{ span: 3 }}
				label="正文"
				name="content"
				rules={[{ required: true }]}
				validateTrigger="onBlur"
			>
				<ReactQuill theme="snow" modules={modules} className="ql-editor !p-0" />
			</Form.Item>
			<Form.Item
				labelCol={{ span: 3 }}
				label="可见范围"
				name="showRange"
				rules={[{ required: true }]}
			>
				<Radio.Group options={SHOW_RANGE_OPTIONS} />
			</Form.Item>
			<div className="flex flex-row-reverse">
				<Button type="primary" htmlType="submit">
					提交
				</Button>
			</div>
		</Form>
	);
}

export default Editor;
