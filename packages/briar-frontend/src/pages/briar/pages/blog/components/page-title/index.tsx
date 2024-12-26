import { Typography } from 'antd';
const { Title } = Typography;

interface IPageTitle {
	content: string;
}

const PageTitle = (props: IPageTitle) => {
	const { content } = props;
	return (
		<Title level={5} className="mt-[16px] mx-[24px]">
			{content}
		</Title>
	);
};

export default PageTitle;
