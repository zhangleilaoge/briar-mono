import { useMemo } from 'react';

import useQuery from '@/pages/briar/hooks/useQuery';

import PageTitle from '../../components/page-title';
import Editor from './components/Editor';
const PostBlog = () => {
	const query = useQuery();
	const title = useMemo(() => {
		return query?.id ? '编辑博文' : '创建博文';
	}, [query?.id]);

	return (
		<>
			<PageTitle content={title} />
			<div className="m-[24px]">
				<Editor />
			</div>
		</>
	);
};

export default PostBlog;
