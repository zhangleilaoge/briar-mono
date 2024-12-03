import { InboxOutlined } from '@ant-design/icons';
import { Avatar, Button, List, Tooltip, Upload } from 'antd';
import { useMemo, useState } from 'react';
import TinyPNG, { CompressResult } from 'tinypng-lib';

import { downloadByDataUrl } from '@/pages/briar/utils/document';
import { convertBytes } from '@/pages/briar/utils/format';
const { Dragger } = Upload;

const CompressImg = () => {
	const [fileList, setFileList] = useState<File[]>([]);
	const [compressList, setCompressList] = useState<CompressResult[]>([]);
	const [compressing, setCompressing] = useState(false);
	const customRequest: (options: any) => void = async ({ onSuccess, file }) => {
		setFileList([...fileList, file]);
		onSuccess?.('');
	};

	const downloadAll = () => {
		compressList.forEach(async (item) => {
			const reader = new FileReader();

			reader.readAsDataURL(item.file);

			reader.onload = async function () {
				console.log(reader.result);
				downloadByDataUrl(reader.result as string, item.file.name);
			};
		});
	};

	const compressAll = async () => {
		setCompressing(true);

		const res = await Promise.all(
			fileList.map(async (item) => {
				const res = (await TinyPNG.compress(item, {})) as CompressResult;
				return res;
			})
		);

		setCompressing(false);

		setCompressList(res);
	};

	const compressDisable = useMemo(() => {
		return fileList.length === 0;
	}, [fileList.length]);

	const compressDisableTip = useMemo(() => {
		return compressDisable ? '请先上传图片' : '';
	}, [compressDisable]);

	const downloadDisable = useMemo(() => {
		return compressDisable || compressList.length === 0;
	}, [compressDisable, compressList.length]);

	const downloadDisableTip = useMemo(() => {
		if (compressDisableTip) {
			return compressDisableTip;
		}
		if (downloadDisable) {
			return '请先压缩图片';
		}
	}, [compressDisableTip, downloadDisable]);

	return (
		<div>
			<div className="text-2xl mb-[20px]">上传区域</div>
			<div>
				<Dragger
					accept="image/*"
					customRequest={customRequest}
					multiple
					onRemove={(file) => {
						setFileList((pre) => pre.filter((item) => item.name.indexOf(file.name) === -1));
					}}
				>
					<p className="ant-upload-drag-icon">
						<InboxOutlined />
					</p>
					<p className="ant-upload-text">点击或拖动文件到此区域上传</p>
					<p className="ant-upload-hint">支持单个或批量上传</p>
				</Dragger>
			</div>
			{/* <Divider plain /> */}
			<div className="text-2xl mb-[20px] mt-[64px]">下载区域</div>
			<div className="flex gap-[12px] mb-[12px]">
				<Tooltip title={compressDisableTip}>
					<Button disabled={compressDisable} type="primary" onClick={compressAll}>
						压缩
					</Button>
				</Tooltip>
				<Tooltip title={downloadDisableTip}>
					<Button disabled={downloadDisable} onClick={downloadAll}>
						下载
					</Button>
				</Tooltip>
			</div>
			<List
				itemLayout="horizontal"
				loading={compressing}
				dataSource={compressList}
				renderItem={(item) => (
					<List.Item>
						<List.Item.Meta
							avatar={<Avatar shape="square" src={URL.createObjectURL(item.file)} size={46} />}
							title={`${item.file.name}`}
							description={
								<div className="text-gray-500 text-[12px]">
									{convertBytes(item.originalSize)} -{`>`} {convertBytes(item.compressedSize)}
									{'('}
									{item.rateString}
									{')'}
								</div>
							}
						/>
					</List.Item>
				)}
			/>
		</div>
	);
};

export default CompressImg;
