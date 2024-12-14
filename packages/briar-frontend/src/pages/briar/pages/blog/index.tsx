import { Layout, List, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';

import Footer from '@/pages/briar/components/Footer';

const data = ['Racing ', 'Japanese', 'Australian', 'Man .', 'Los.'];

const Blog = () => {
	return (
		<Layout>
			<Layout className="mx-[120px] mt-[24px] flex flex-row gap-[24px]">
				<List
					bordered
					dataSource={data}
					renderItem={(item) => (
						<List.Item className="hover:bg-gray-100 !border-0 cursor-pointer !px-[16px] !py-[8px] mx-[8px] my-[4px] rounded">
							{item}
						</List.Item>
					)}
					className="basis-[180px] bg-white overflow-hidden border-0 py-[4px]"
				/>
				<Content className="shrink-1 px-[24px] py-[12px] bg-white">Content</Content>
			</Layout>
			<Footer />
		</Layout>
	);
};

export default Blog;
