import { IGetBlogsResponse } from 'briar-shared';
import cx from 'classnames';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

import { getBlogs } from '@/pages/briar/api/blog';
import useQuery from '@/pages/briar/hooks/useQuery';

import User from '../../components/user';
import s from './style.module.scss';

const MyBlogPost = () => {
	const query = useQuery();
	const [detail, setDetail] = useState<IGetBlogsResponse['items'][number]>();

	const id = useMemo(() => {
		return +query.id;
	}, [query?.id]);

	useEffect(() => {
		getBlogs({ id }).then((res) => {
			const { items } = res;
			setDetail(items[0]);
		});
	}, [id]);

	if (!detail) {
		return null;
	}

	return (
		<div className="m-[24px] flex flex-col gap-[20px]">
			<div className="text-4xl">{detail?.title}</div>
			<div className="flex gap-[12px]">
				<User user={detail.author} />
				<div className="text-neutral-500">
					{format(new Date(detail.createdAt), 'yyyy-MM-dd HH:mm')}
				</div>
			</div>
			<div
				dangerouslySetInnerHTML={{ __html: detail.content }}
				className={cx('prose', s['blog-detail'])}
			></div>
		</div>
	);
};

export default MyBlogPost;
