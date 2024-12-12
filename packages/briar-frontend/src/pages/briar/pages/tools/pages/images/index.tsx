import { PlusOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';
import { Button, Checkbox, CheckboxProps, Divider, List, message, Modal, Upload } from 'antd';
import { Image as Img } from 'antd';
import { IMaterial, IPageInfo } from 'briar-shared';
import { uniq } from 'lodash-es';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { createImgMaterial, deleteImgs, getImgMaterials } from '@/pages/briar/api/material';
import SortList from '@/pages/briar/components/sort-list/SortList';
import useUploadImg from '@/pages/briar/hooks/biz/useUploadImg';
import useGlobalClick from '@/pages/briar/hooks/useGlobalClick';

import Image from './components/img';
import useDisableMouseEvent from './hooks/useDisableMouseEvent';

const DEFAULT_PAGE_INFO: IPageInfo = {
	page: 1,
	pageSize: 1000,
	total: 0
};

const frontendPagesize = 100;

const Images = () => {
	const [imgs, setImgs] = useState<IMaterial[]>([]);
	const [sortedImg, setSortedImg] = useState<IMaterial[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedList, setSelectedList] = useState<number[]>([]);
	const [loading, seLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const { cancel } = useGlobalClick(() => setSelectedList([]));
	const { uploadList, customRequest, setUploadList } = useUploadImg();
	useDisableMouseEvent();

	const indeterminate = useMemo(() => {
		return selectedList.length > 0 && selectedList.length < imgs.length;
	}, [imgs.length, selectedList.length]);

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
		async (data: { id: number; name: string }[]) => {
			(await deleteImgs(data)) as unknown as Promise<any>;

			refresh();
		},
		[refresh]
	);

	const onSelect = useCallback(
		async (id: number, shiftKey: boolean, isCommandPressed: boolean) => {
			setSelectedList((pre) => {
				if (shiftKey) {
					if (pre.includes(id)) {
						return [...pre];
					} else if (pre.length > 0) {
						const idIndex = sortedImg.findIndex((item) => item.id === id);
						const anyOtherIndex = sortedImg.findIndex(
							(item) => item.id !== id && pre.includes(item.id)
						);

						// 将 idIndex 和 anyOtherIndex 之间的所有 id 加入到 pre 中
						return uniq([
							...pre,
							...sortedImg
								.slice(Math.min(idIndex, anyOtherIndex), Math.max(idIndex, anyOtherIndex) + 1)
								.map((item) => item.id)
						]);
					} else {
						return [id];
					}
				} else if (isCommandPressed) {
					return uniq([...pre, id]);
				} else {
					return [id];
				}
			});
		},
		[sortedImg]
	);

	const currentPageImgs = useMemo(() => {
		return sortedImg.slice((currentPage - 1) * frontendPagesize, frontendPagesize);
	}, [currentPage, sortedImg]);

	const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
		setSelectedList(e.target.checked ? currentPageImgs.map((item) => item.id) : []);
	};

	const checkAll = useMemo(() => {
		return (
			selectedList.length === Math.min(imgs.length, frontendPagesize) && selectedList.length > 0
		);
	}, [imgs.length, selectedList.length]);

	const deleteSelected = () => {
		if (selectedList.length === 0) {
			message.error('请选中要删除的图片');
			return;
		}

		Modal.confirm({
			title: '提示',
			content: `确认删除选中的图片吗？（共${selectedList.length}张图片）`,
			okText: '确认',
			cancelText: '取消',
			onOk: async () => {
				await onDelete(
					selectedList.map((item) => ({
						id: item,
						name: imgs.find((img) => img.id === item)!.name
					}))
				);
				setSelectedList([]);
			}
		});
	};

	useEffect(() => {
		!isModalOpen && setUploadList([]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isModalOpen]);

	useMount(() => {
		refresh();
	});

	return (
		<div>
			<div>
				<div className="flex gap-[12px]" onClick={cancel}>
					<Button onClick={() => setIsModalOpen(true)}>上传图片</Button>
					{selectedList.length > 0 && (
						<Button onClick={deleteSelected} type="primary">
							删除
						</Button>
					)}
				</div>
				<Divider plain></Divider>
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
						}}
					>
						<button style={{ border: 0, background: 'none' }} type="button">
							<PlusOutlined />
							<div style={{ marginTop: 8 }}>Upload</div>
						</button>
					</Upload>
				</Modal>
			</div>
			<div className="mb-[32px] flex gap-[8px]" onClick={cancel}>
				<Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
					全选
				</Checkbox>
				<SortList
					list={imgs}
					setSortedList={setSortedImg}
					sortByMap={[
						{
							key: 'name',
							label: '名称'
						},
						{
							key: 'createdAt',
							label: '创建日期',
							compare: (a, b) => {
								console.log(Date.parse(a.createdAt), Date.parse(b.createdAt));
								return Date.parse(a.createdAt) - Date.parse(b.createdAt);
							}
						}
					]}
				/>
			</div>

			<List
				grid={{
					gutter: 32
				}}
				loading={loading}
				dataSource={sortedImg}
				renderItem={(item) => (
					<List.Item onClick={cancel} key={item.id}>
						<Img.PreviewGroup
							items={currentPageImgs.map((img) => ({
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
					pageSize: frontendPagesize,
					current: currentPage,
					onChange: (page) => {
						setCurrentPage(page);
						setSelectedList([]);
					}
				}}
			/>
		</div>
	);
};

export default Images;
