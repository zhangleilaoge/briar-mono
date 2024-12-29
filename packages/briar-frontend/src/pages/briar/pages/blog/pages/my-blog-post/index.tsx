import BlogList from '../../components/blog-list';
import PageTitle from '../../components/page-title';

const MyBlogPost = () => {
	return (
		<>
			<PageTitle content={'我的博客'} />
			<BlogList mine={true} />
		</>
	);
};

export default MyBlogPost;
