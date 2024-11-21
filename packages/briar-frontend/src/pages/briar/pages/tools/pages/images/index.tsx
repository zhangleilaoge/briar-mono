import { PlusOutlined } from '@ant-design/icons';
import { Button, List, message, Modal, Upload } from 'antd';
import { Image as Img } from 'antd';
import { IMaterial, IPageInfo, RUNTIME_PREFIX, THUMB_URL_SUFFIX } from 'briar-shared';
import { useCallback, useEffect, useState } from 'react';

import {
	createImgMaterial,
	deleteImgs,
	getImgMaterials,
	uploadBase64
} from '@/pages/briar/api/material';
import ClickOutside from '@/pages/briar/components/ClickOutSide';

import Image from './components/img';
import useDisableMouseEvent from './hooks/useDisableMouseEvent';

const DEFAULT_PAGE_INFO: IPageInfo = {
	page: 1,
	pageSize: 1000,
	total: 0
};

const Images = () => {
	const [imgs, setImgs] = useState<IMaterial[]>([]);
	const [uploadList, setUploadList] = useState<Pick<IMaterial, 'name' | 'url' | 'thumbUrl'>[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedList, setSelectedList] = useState<number[]>([]);
	const [loading, seLoading] = useState(false);
	useDisableMouseEvent();

	const customRequest: (options: any) => void = ({ onSuccess, file }) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = async function () {
			const { url } = await uploadBase64({
				filename: file.name,
				base64: reader.result as string
			});

			setUploadList((pre) => [
				...pre,
				{
					name: decodeURIComponent(url.split(RUNTIME_PREFIX)[1]),
					thumbUrl: url + THUMB_URL_SUFFIX,
					url
				}
			]);

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
		seLoading(true);

		getImgMaterials({
			pagination: DEFAULT_PAGE_INFO
		})
			.then((res) => {
				setImgs(res.items);
			})
			.finally(() => {
				seLoading(false);
			});
	}, []);

	const onDelete = useCallback(
		async (id: number, name: string) => {
			(await deleteImgs([
				{
					id,
					name
				}
			])) as unknown as Promise<any>;

			refresh();
		},
		[refresh]
	);

	const onSelect = useCallback(
		async (id: number, shiftKey: boolean) => {
			setSelectedList((pre) => {
				if (shiftKey) {
					if (pre.includes(id)) {
						return [...pre];
					} else if (pre.length > 0) {
						const idIndex = imgs.findIndex((item) => item.id === id);
						const anyOtherIndex = imgs.findIndex((item) => item.id !== id && pre.includes(item.id));

						// 将 idIndex 和 anyOtherIndex 之间的所有 id 加入到 pre 中
						return Array.from(
							new Set([
								...pre,
								...imgs
									.slice(Math.min(idIndex, anyOtherIndex), Math.max(idIndex, anyOtherIndex) + 1)
									.map((item) => item.id)
							])
						);
					} else {
						return [id];
					}
				} else {
					return [id];
				}
			});
		},
		[imgs]
	);

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
							setUploadList((pre) => pre.filter((item) => item.name.indexOf(file.name) === -1));
							console.log(file.name);
						}}
					>
						<button style={{ border: 0, background: 'none' }} type="button">
							<PlusOutlined />
							<div style={{ marginTop: 8 }}>Upload</div>
						</button>
					</Upload>
				</Modal>
			</div>
			<ClickOutside onClickOutside={() => setSelectedList([])}>
				<List
					grid={{
						gutter: 32
					}}
					loading={loading}
					dataSource={imgs}
					renderItem={(item) => (
						<List.Item>
							<Img.PreviewGroup
								items={imgs.map((img) => ({
									src: img.url
								}))}
							>
								<Image
									data={item}
									onDelete={onDelete}
									selected={selectedList.includes(item.id)}
									onSelect={onSelect}
								/>
							</Img.PreviewGroup>
						</List.Item>
					)}
					pagination={{
						pageSize: 100
					}}
				/>
			</ClickOutside>
		</div>
	);
};

export default Images;
