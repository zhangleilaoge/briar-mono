import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { IFile } from 'briar-shared';
import { useContext, useEffect, useRef, useState } from 'react';

import { uploadBase64 } from '@/pages/briar/api/material';
import { updateSelf } from '@/pages/briar/api/user';
import CropUpload from '@/pages/briar/components/crop-upload';
import CommonContext from '@/pages/briar/context/common';

interface FieldType {
	name: string;
	username: string;
	profileImg: IFile[];
	email: string;
}

const Account = () => {
	const urlMapRef = useRef<Record<string, string>>({});
	const [showUploadBtn, setShowUploadBtn] = useState(true);
	const { userInfo } = useContext(CommonContext);
	const [form] = useForm();

	const onFinish = async (val: FieldType) => {
		const { profileImg } = val;

		const formattedProfileImg = profileImg.map((item) => {
			return {
				thumbUrl: urlMapRef.current[item.name] || item.thumbUrl
			};
		});

		updateSelf({
			...val,
			profileImg: formattedProfileImg?.[0]?.thumbUrl || ''
		}).then(() => {
			message.success('修改成功，页面即将刷新。');
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		});
	};

	const customRequest: (options: any) => void = ({ onSuccess, file }) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = async function () {
			const { url } = await uploadBase64({
				filename: file.name,
				base64: reader.result as string
			});

			urlMapRef.current[file.name] = url;

			onSuccess?.('');
		};
	};

	const normFile = (e: any) => {
		let result = [];
		if (Array.isArray(e)) {
			result = e;
		}
		result = e?.fileList;

		if (result.length > 0) {
			setShowUploadBtn(false);
		}

		return result;
	};

	useEffect(() => {
		if (userInfo?.profileImg) {
			setShowUploadBtn(false);
		}
	}, [userInfo?.profileImg]);

	return (
		<>
			<Form
				form={form}
				onFinish={onFinish}
				layout="vertical"
				initialValues={{
					...userInfo,
					profileImg: userInfo.profileImg
						? [
								{
									thumbUrl: userInfo.profileImg
								}
							]
						: []
				}}
			>
				<div className="text-2xl">个人资料</div>
				<Divider plain></Divider>
				<Form.Item
					label="头像"
					name="profileImg"
					valuePropName="fileList"
					getValueFromEvent={normFile}
				>
					<CropUpload
						accept="image/*"
						customRequest={customRequest}
						listType="picture-card"
						maxCount={1}
						showUploadList={{
							showPreviewIcon: false
						}}
						onRemove={() => {
							setShowUploadBtn(true);
						}}
					>
						{showUploadBtn ? (
							<button style={{ border: 0, background: 'none' }} type="button">
								<PlusOutlined />
								<div style={{ marginTop: 8 }}>Upload</div>
							</button>
						) : null}
					</CropUpload>
				</Form.Item>
				<Form.Item<FieldType> label="用户名" name="username" style={{ width: 280 }}>
					<Input disabled />
				</Form.Item>
				<Form.Item<FieldType> label="昵称" name="name" style={{ width: 280 }}>
					<Input />
				</Form.Item>
				<Form.Item<FieldType> label="邮箱" name="email" style={{ width: 280 }}>
					<Input />
				</Form.Item>
				<Form.Item>
					<Button htmlType="submit" type="primary">
						修改
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default Account;
