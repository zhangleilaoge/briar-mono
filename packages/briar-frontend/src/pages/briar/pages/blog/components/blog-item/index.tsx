import {
	DeleteFilled,
	EditFilled,
	EllipsisOutlined,
	StarFilled,
	StarOutlined
} from '@ant-design/icons';
import { Button, Divider, Dropdown, List, message, Typography } from 'antd';
import { IGetBlogsResponse, ItemTypeOfArray, RoleEnum } from 'briar-shared';
import { format } from 'date-fns';
import { useCallback, useContext, useMemo, useState } from 'react';

import { deleteBlog, favorite } from '@/pages/briar/api/blog';
import { MenuKeyEnum } from '@/pages/briar/constants/router';
import CommonContext from '@/pages/briar/context/common';
import useNavigateTo from '@/pages/briar/hooks/biz/useNavigateTo';
import { removeHtmlTags } from '@/pages/briar/utils/document';
import { errorNotify } from '@/pages/briar/utils/notify';

import User from '../user';

type IBlog = ItemTypeOfArray<IGetBlogsResponse['items']>;

interface IBlogItem {
	data: IBlog;
	refresh: () => void;
	update: (item: IBlog) => void;
}

enum OperationEnum {
	Edit = 'edit',
	Delete = 'delete',
	Favorite = 'favorite'
}

const BlogItem = (props: IBlogItem) => {
	const { data, refresh, update } = props;
	const { title = '', content = '', createdAt, userId } = data;
	const { userInfo } = useContext(CommonContext);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const navigate = useNavigateTo();

	const goBlogDetail = useCallback(() => {
		navigate({
			target: MenuKeyEnum.BlogDetail_2,
			query: {
				id: String(props?.data?.id)
			}
			// newPage: true
		});
	}, [navigate, props?.data?.id]);

	const operation = useMemo(() => {
		const showOperation = userInfo?.id === userId || userInfo?.roles?.includes(RoleEnum.Admin);
		if (!showOperation) return null;

		const items = [
			{
				key: OperationEnum.Edit,
				label: (
					<div
						onClick={(e) => {
							e.stopPropagation();
							setDropdownOpen(false);
							navigate({
								target: MenuKeyEnum.PostBlog_2,
								query: {
									id: String(props?.data?.id)
								}
							});
						}}
					>
						<EditFilled className="mr-[8px]" />
						编辑
					</div>
				)
			},
			{
				key: OperationEnum.Favorite,
				label: (
					<div
						onClick={(e) => {
							e.stopPropagation();
							setDropdownOpen(false);
							favorite({ id: props?.data?.id, favorite: !props?.data?.favorite })
								.then(() => {
									message.success(props?.data?.favorite ? '取消收藏成功' : '收藏成功');
									update({
										...props?.data,
										favorite: !props?.data?.favorite
									});
								})
								.catch((e) => {
									errorNotify(e);
								});
						}}
					>
						{props?.data?.favorite ? (
							<>
								<StarFilled className="mr-[8px] text-star-yellow" />
								取消收藏
							</>
						) : (
							<>
								<StarOutlined className="mr-[8px]" />
								收藏
							</>
						)}
					</div>
				)
			},
			{
				key: OperationEnum.Delete,
				label: (
					<div
						onClick={(e) => {
							e.stopPropagation();
							setDropdownOpen(false);
							deleteBlog({ id: props?.data?.id })
								.then(() => {
									message.success('删除成功');
									refresh();
								})
								.catch((e) => {
									errorNotify(e);
								});
						}}
						className="text-red-500"
					>
						<DeleteFilled className="mr-[8px]" />
						删除
					</div>
				)
			}
		];

		return (
			<>
				<Divider type="vertical" />
				<Dropdown
					menu={{ items }}
					placement="bottom"
					trigger={['click']}
					open={dropdownOpen}
					onOpenChange={setDropdownOpen}
				>
					<Button
						icon={<EllipsisOutlined />}
						type="text"
						onClick={(e) => e.stopPropagation()}
						className="!w-[24px] p-0 h-[22px]"
					></Button>
				</Dropdown>
			</>
		);
	}, [dropdownOpen, navigate, props?.data, refresh, update, userId, userInfo?.id, userInfo?.roles]);

	return (
		<List.Item className="box-border " onClick={goBlogDetail}>
			<List.Item.Meta
				className="my-[4px] mx-[16px] py-[8px] px-[8px] cursor-pointer hover:bg-gray-100 rounded-lg"
				title={title}
				description={
					<div className="flex flex-col gap-[4px] ">
						<Typography.Paragraph
							ellipsis={{
								rows: 1
							}}
							className="!mb-0 text-inherit"
						>
							{removeHtmlTags(content)}
						</Typography.Paragraph>
						<div className="flex justify-between">
							<div className="flex items-center">
								<User user={props?.data?.author} />
								{operation}
							</div>
							<div>{format(new Date(createdAt), 'yyyy-MM-dd HH:mm')}</div>
						</div>
					</div>
				}
			></List.Item.Meta>
		</List.Item>
	);
};

export default BlogItem;
