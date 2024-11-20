import { PlusOutlined } from '@ant-design/icons';
import { Button, List, message, Modal, Upload } from 'antd';
import { Image as Img } from 'antd';
import { IMaterial, IPageInfo, THUMB_URL_SUFFIX } from 'briar-shared';
import { useCallback, useEffect, useState } from 'react';

import { createImgMaterial, getImgMaterials, uploadBase64 } from '@/pages/briar/api/material';

import Image from './components/img';

const DEFAULT_PAGE_INFO: IPageInfo = {
	page: 1,
	pageSize: 1000,
	total: 0
};

const Images = () => {
	const [imgs, setImgs] = useState<IMaterial[]>([]);
	const [uploadList, setUploadList] = useState<Pick<IMaterial, 'name' | 'url' | 'thumbUrl'>[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const customRequest: (options: any) => void = ({ onSuccess, file }) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = async function () {
			const { url } = await uploadBase64({
				filename: file.name,
				base64: reader.result as string
			});

			setUploadList((pre) => [...pre, { name: file.name, thumbUrl: url + THUMB_URL_SUFFIX, url }]);

			onSuccess?.('');
		};
	};

	const handleUpload = () => {
		if (uploadList.length === 0) {
			message.error('请上传图片');
			return;
		}

		createImgMaterial({
			files: uploadList
		}).then(() => {
			setIsModalOpen(false);
			message.success('上传成功');
			refresh();
		});
	};

	const refresh = useCallback(() => {
		getImgMaterials({
			pagination: DEFAULT_PAGE_INFO
		}).then((res) => {
			setImgs(res.items);
		});
	}, []);

	useEffect(() => {
		!isModalOpen && setUploadList([]);
	}, [isModalOpen]);

	useEffect(() => {
		refresh();
	}, []);

	return (
		<div>
			<div className="mb-[32px]">
				<Button onClick={() => setIsModalOpen(true)}>上传图片</Button>
				<Modal
					title="上传图片"
					open={isModalOpen}
					onOk={handleUpload}
					onCancel={() => setIsModalOpen(false)}
					cancelText="取消"
					okText="上传"
					destroyOnClose
					width={480}
				>
					<Upload
						multiple
						accept="image/*"
						customRequest={customRequest}
						listType="picture-card"
						showUploadList={{
							showPreviewIcon: false
						}}
						onRemove={(file) => {
							setUploadList((pre) => pre.filter((item) => item.name !== file.name));
						}}
					>
						<button style={{ border: 0, background: 'none' }} type="button">
							<PlusOutlined />
							<div style={{ marginTop: 8 }}>Upload</div>
						</button>
					</Upload>
				</Modal>
			</div>
			<List
				grid={{
					gutter: 32
				}}
				dataSource={imgs}
				renderItem={(item) => (
					<List.Item>
						<Img.PreviewGroup
							items={imgs.map((img) => ({
								src: img.url
							}))}
						>
							<Image data={item} />
						</Img.PreviewGroup>
					</List.Item>
				)}
				pagination={{
					pageSize: 100
				}}
			/>
		</div>
	);
};

export default Images;
