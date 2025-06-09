import { useMount } from 'ahooks';
import { useRequest } from 'alova/client';
import { List, Skeleton } from 'antd';
import { Input } from 'antd';
import { IGetBlogsResponse, IPageInfo, ItemTypeOfArray } from 'briar-shared';
import { useCallback, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { getBlogs } from '@/pages/briar/api/blog';

import BlogItem from '../blog-item';

const { Search } = Input;
const DEFAULT_PAGE_INFO: IPageInfo = {
	page: 1,
	pageSize: 20,
	total: 0
};

interface IBlogListProps {
	favorite?: boolean;
	mine?: boolean;
}

const BlogList = (props: IBlogListProps) => {
	const { favorite = false, mine = false } = props;
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

	const loadMoreData = (paginator?: IPageInfo, keyword?: string) => {
		send({
			pageInfo: paginator || pageInfo,
			favorite,
			keyword,
			mine
		});
	};

	useMount(() => {
		loadMoreData();
	});

	const refresh = (keyword?: string) => {
		setData([]);
		setPageInfo(DEFAULT_PAGE_INFO);
		loadMoreData(DEFAULT_PAGE_INFO, keyword);
	};

	const update = useCallback((newItem: ItemTypeOfArray<typeof data>) => {
		setData((_data) => {
			return _data.map((item) => {
				if (item?.id === newItem?.id)
					return {
						...item,
						...newItem
					};
				return item;
			});
		});
	}, []);

	return (
		<InfiniteScroll
			dataLength={data.length}
			next={loadMoreData}
			hasMore={data.length < pageInfo.total!}
			loader={<Skeleton avatar paragraph={{ rows: 1 }} active className="px-[24px] py-[12px]" />}
		>
			<Search
				placeholder="在此处搜索，输入关键词"
				enterButton="搜索"
				loading={loading}
				className="px-[24px] mt-[12px]"
				onSearch={refresh}
			/>
			<List
				dataSource={data}
				loading={loading}
				renderItem={(item) => <BlogItem data={item} refresh={refresh} update={update} />}
			/>
		</InfiniteScroll>
	);
};

export default BlogList;
