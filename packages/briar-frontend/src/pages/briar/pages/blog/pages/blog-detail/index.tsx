import 'react-quill/dist/quill.snow.css';

import { LockOutlined, RollbackOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { Button, message, Tooltip } from 'antd';
import { IGetBlogsResponse, RoleEnum, ShowRangeEnum } from 'briar-shared';
import cx from 'classnames';
import { format } from 'date-fns';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { favorite, getBlog } from '@/pages/briar/api/blog';
import NoAccess from '@/pages/briar/components/NoAccess';
import { MenuKeyEnum } from '@/pages/briar/constants/router';
import CommonContext from '@/pages/briar/context/common';
import useNavigateTo from '@/pages/briar/hooks/biz/useNavigateTo';
import useQuery from '@/pages/briar/hooks/useQuery';
import { errorNotify } from '@/pages/briar/utils/notify';

import User from '../../components/user';
import s from './style.module.scss';

const MyBlogPost = () => {
	const query = useQuery();
	const [detail, setDetail] = useState<IGetBlogsResponse['items'][number]>();
	const navigate = useNavigateTo();
	const { userInfo, goBack } = useContext(CommonContext);
	const [favoriteOffset, setFavoriteOffset] = useState(0);

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

	const favo = useCallback(() => {
		if (!detail) return;
		favorite({ id: detail?.id, favorite: !detail.favorite })
			.then(() => {
				message.success(detail?.favorite ? '取消收藏成功' : '收藏成功');

				setFavoriteOffset((prev) => prev + (detail?.favorite ? -1 : 1));
				setDetail((prev) => ({ ...prev!, favorite: !prev?.favorite }));
			})
			.catch((e) => {
				errorNotify(e);
			});
	}, [detail]);

	if (!detail) {
		return null;
	} else if (!detail?.content) {
		return <NoAccess />;
	}

	return (
		<div className="m-[24px] flex flex-col gap-[20px]">
			<div className="text-4xl flex justify-between items-center">
				<div>
					{detail?.showRange === ShowRangeEnum.Private ? (
						<Tooltip title="仅我可见">
							<LockOutlined className="text-neutral-500 mr-[16px]" />
						</Tooltip>
					) : null}
					{detail?.title}
				</div>
				<Button onClick={goBack} icon={<RollbackOutlined />}>
					返回
				</Button>
			</div>
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
				className={cx('prose', s['blog-detail'], 'max-w-none', 'ql-editor')}
			></div>
			<div className="flex justify-center flex-col items-center mt-[12px]">
				<Button
					type="text"
					className={cx('!p-0', s['blog-opt'])}
					onClick={favo}
					icon={detail?.favorite ? <StarFilled className="text-star-yellow" /> : <StarOutlined />}
				/>
				<div>{detail?.favoriteCount + favoriteOffset}</div>
			</div>
		</div>
	);
};

export default MyBlogPost;
