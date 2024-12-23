import { useMount } from 'ahooks';
import { useRequest } from 'alova/client';
import { List, Skeleton } from 'antd';
import { IGetBlogsResponse, IPageInfo } from 'briar-shared';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { getBlogs } from '@/pages/briar/api/blog';

import BlogItem from '../../components/blog-item';

const DEFAULT_PAGE_INFO: IPageInfo = {
	page: 1,
	pageSize: 20,
	total: 0
};

const RecommendBlogPost = () => {
	const [data, setData] = useState<IGetBlogsResponse['items']>([]);
	const [pageInfo, setPageInfo] = useState<IPageInfo>(DEFAULT_PAGE_INFO);

	const { onSuccess, loading, send } = useRequest(getBlogs, {
		immediate: false
	});

	onSuccess(({ data }) => {
		const { items, paginator } = data;
		setData((prev) => [...prev, ...items]);
		setPageInfo({
			...pageInfo,
			...paginator,
			page: paginator.page + 1
		});
	});

	const loadMoreData = (paginator?: IPageInfo) => {
		send({
			pageInfo: paginator || pageInfo
		});
	};

	useMount(() => {
		loadMoreData();
	});

	const refresh = () => {
		setData([]);
		setPageInfo(DEFAULT_PAGE_INFO);
		loadMoreData(DEFAULT_PAGE_INFO);
	};

	return (
		<InfiniteScroll
			dataLength={data.length}
			next={loadMoreData}
			hasMore={data.length < pageInfo.total!}
			loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
		>
			<List
				dataSource={data}
				loading={loading}
				renderItem={(item) => <BlogItem data={item} refresh={refresh} />}
			/>
		</InfiniteScroll>
	);
};

export default RecommendBlogPost;
