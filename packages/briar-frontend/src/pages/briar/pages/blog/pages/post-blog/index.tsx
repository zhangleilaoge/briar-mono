import { MENU_KEY_NAMES, MenuKeyEnum } from '@/pages/briar/constants/router';

import PageTitle from '../../components/page-title';
import Editor from './components/Editor';
const PostBlog = () => {
	return (
		<>
			<PageTitle content={MENU_KEY_NAMES[MenuKeyEnum.PostBlog_2]} />
			<div className="mx-[12px] my-[24px]">
				<Editor />
			</div>
		</>
	);
};

export default PostBlog;
