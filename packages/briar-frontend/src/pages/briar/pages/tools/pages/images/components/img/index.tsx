import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, message } from 'antd';
import { Image as Img } from 'antd';
import { IMaterial } from 'briar-shared';
import { useRef } from 'react';

import LineText from '@/pages/briar/components/LineText';
import { copyToClipboard, download } from '@/pages/briar/utils/document';

import s from './style.module.scss';
``;

const ImageItem = ({
	data,
	onDelete,
	selected,
	onSelect
}: {
	data: IMaterial;
	onDelete: (id: number, name: string) => Promise<any>;
	selected?: boolean;
	onSelect?: (id: number, shiftKey: boolean) => void;
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const onClick = (e: any) => {
		if (e.shiftKey) {
			e.preventDefault(); // 禁用默认行为
		}

		console.log();
		if (
			onSelect &&
			(e.target === containerRef.current || e.target.className?.includes('can-click'))
		) {
			onSelect(data.id, e.shiftKey);
		}
	};

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
		},
		{
			key: 'delete',
			label: (
				<span
					onClick={() => {
						onDelete(data.id, data.name).then(() => {
							message.success('删除成功');
						});
					}}
				>
					删除
				</span>
			)
		}
	];

	return (
		<div
			ref={containerRef}
			className={`w-[120px] h-[120px] flex flex-col gap-[4px] pt-[16px] justify-center items-center hover:bg-gray-100 relative group ${selected ? s['img-selected'] : ''}`}
			onClick={onClick}
		>
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
			<LineText className="text-[12px] w-[84px] h-[36px]" line={2} text={data.name} />
		</div>
	);
};

export default ImageItem;