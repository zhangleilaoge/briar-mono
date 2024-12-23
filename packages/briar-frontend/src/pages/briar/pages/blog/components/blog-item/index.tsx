import { List, Typography } from 'antd';
import { IGetBlogsResponse } from 'briar-shared';
import { format } from 'date-fns';
import { useCallback } from 'react';

import { MenuKeyEnum } from '@/pages/briar/constants/router';
import useNavigateTo from '@/pages/briar/hooks/biz/useNavigateTo';
import { removeHtmlTags } from '@/pages/briar/utils/document';

import User from '../user';

type IBlog = IGetBlogsResponse['items'][number];

interface IBlogItem {
	data: IBlog;
}

const BlogItem = (props: IBlogItem) => {
	const { title = '', content = '', createdAt } = props?.data;
	const navigate = useNavigateTo();
	const goBlogDetail = useCallback(() => {
		navigate({
			target: MenuKeyEnum.BlogDetail_2,
			query: {
				id: String(props?.data?.id)
			}
		});
	}, [navigate, props?.data?.id]);
	return (
		<List.Item className="box-border hover:bg-gray-100" onClick={goBlogDetail}>
			<List.Item.Meta
				className="my-[8px] mx-[24px] cursor-pointer"
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
								{/* <Divider type="vertical" /> */}
								{/* <div>
									<HeartOutlined /> 12
								</div> */}
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
