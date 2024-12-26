import { MENU_KEY_NAMES, MenuKeyEnum } from '@/pages/briar/constants/router';

import BlogList from '../../components/blog-list';
import PageTitle from '../../components/page-title';

const FavoriteBlogPost = () => {
	return (
		<>
			<PageTitle content={MENU_KEY_NAMES[MenuKeyEnum.FavoriteBlog_2]} />
			<BlogList favorite={true} />
		</>
	);
};

export default FavoriteBlogPost;
