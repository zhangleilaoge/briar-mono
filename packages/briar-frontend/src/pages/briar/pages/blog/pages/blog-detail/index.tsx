import { Button } from 'antd';
import { IGetBlogsResponse, RoleEnum } from 'briar-shared';
import cx from 'classnames';
import { format } from 'date-fns';
import { useContext, useEffect, useMemo, useState } from 'react';

import { getBlog } from '@/pages/briar/api/blog';
import { MenuKeyEnum } from '@/pages/briar/constants/router';
import CommonContext from '@/pages/briar/context/common';
import useNavigateTo from '@/pages/briar/hooks/biz/useNavigateTo';
import useQuery from '@/pages/briar/hooks/useQuery';

import User from '../../components/user';
import s from './style.module.scss';

const MyBlogPost = () => {
	const query = useQuery();
	const [detail, setDetail] = useState<IGetBlogsResponse['items'][number]>();
	const navigate = useNavigateTo();
	const { userInfo } = useContext(CommonContext);

	const id = useMemo(() => {
		return +query.id;
	}, [query?.id]);

	useEffect(() => {
		getBlog({ id }).then((res) => {
			setDetail(res);
		});
	}, [id]);

	const showEdit = useMemo(() => {
		return userInfo?.id === detail?.userId || userInfo?.roles?.includes(RoleEnum.Admin);
	}, [detail, userInfo]);

	if (!detail) {
		return null;
	}

	return (
		<div className="m-[24px] flex flex-col gap-[20px]">
			<div className="text-4xl">{detail?.title}</div>
			<div className="flex gap-[12px] items-center">
				<User user={detail.author} />
				<div className="text-neutral-500">
					{format(new Date(detail.createdAt), 'yyyy-MM-dd HH:mm')}
				</div>
				{showEdit ? (
					<Button
						type="link"
						className="p-0 h-[22px]"
						onClick={() => {
							navigate({
								target: MenuKeyEnum.PostBlog_2,
								query: {
									id: String(detail?.id)
								}
							});
						}}
					>
						编辑
					</Button>
				) : null}
			</div>
			<div
				dangerouslySetInnerHTML={{ __html: detail.content }}
				className={cx('prose', s['blog-detail'], 'max-w-none')}
			></div>
		</div>
	);
};

export default MyBlogPost;
