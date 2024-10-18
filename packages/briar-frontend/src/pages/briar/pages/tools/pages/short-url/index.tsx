import { Button, Divider, Form, Input, message } from 'antd';
import { useState } from 'react';

import { createShortUrl } from '@/pages/briar/api/short-url';
import { errorNotify } from '@/pages/briar/utils/notify';

export type FieldType = {
	url: string;
};

const ShortUrl = () => {
	const [result, setResult] = useState('');
	const onFinish = async ({ url }: FieldType) => {
		if (!url) {
			message.error('请输入url');
		}

		createShortUrl({ url })
			.then(({ shortUrl }) => {
				setResult(shortUrl);
			})
			.catch((err) => {
				errorNotify(err);
			});
	};
	return (
		<>
			<Form onFinish={onFinish}>
				<Form.Item<FieldType> label="url" name="url">
					<Input placeholder="输入原始链接" />
				</Form.Item>
				<Form.Item>
					<Button htmlType="submit" type="primary">
						生成
					</Button>
				</Form.Item>
			</Form>
			{result ? (
				<>
					<Divider plain></Divider>
					<Form.Item<FieldType> label="短链结果" className="w-[280px]">
						{result}
					</Form.Item>
				</>
			) : null}
		</>
	);
};

export default ShortUrl;
