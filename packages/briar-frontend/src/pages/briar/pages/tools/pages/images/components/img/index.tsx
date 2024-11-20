import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, message } from 'antd';
import { Image as Img } from 'antd';
import { IMaterial } from 'briar-shared';

import LineText from '@/pages/briar/components/LineText';
import { copyToClipboard, download } from '@/pages/briar/utils/document';

const ImageItem = ({ data }: { data: IMaterial }) => {
	const items: MenuProps['items'] = [
		{
			key: 'copy',
			label: (
				<span
					onClick={() => {
						copyToClipboard(data?.url || data?.thumbUrl);
						message.success('复制成功');
					}}
				>
					复制
				</span>
			)
		},
		{
			key: 'download',
			label: (
				<span
					onClick={() => {
						download(data?.url || data?.thumbUrl, data.name);
						message.success('下载成功');
					}}
				>
					下载
				</span>
			)
		}
	];

	return (
		<div className="w-[120px] h-[120px] flex flex-col gap-[4px] pt-[16px] justify-center items-center hover:bg-gray-100 relative group">
			<div className="absolute right-[8px] top-[4px] opacity-0 group-hover:opacity-100">
				<Dropdown menu={{ items }}>
					<EllipsisOutlined className="cursor-pointer text-[18px]" />
				</Dropdown>
			</div>
			<Img
				preview={{
					src: data.url
				}}
				src={data.thumbUrl}
				alt={data.name}
				width={60}
				height={60}
				className="object-cover"
			/>
			<LineText className="text-[12px] w-[78px] h-[36px]" line={2} text={data.name} />
		</div>
	);
};

export default ImageItem;
