import { MENU_KEY_NAMES, MenuKeyEnum } from '@/pages/briar/constants/router';

import BlogList from '../../components/blog-list';
import PageTitle from '../../components/page-title';

const RecommendBlogPost = () => {
	return (
		<>
			<PageTitle content={MENU_KEY_NAMES[MenuKeyEnum.RecommendBlogPost_2]} />
			<BlogList />
		</>
	);
};

export default RecommendBlogPost;
