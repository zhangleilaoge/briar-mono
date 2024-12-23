import { Button, Result } from 'antd';

import useNavigateTo from '../../hooks/biz/useNavigateTo';
import s from './style.module.scss';
const Page404 = () => {
	const navigate = useNavigateTo();
	return (
		<Result
			className={s.ErrorContainer}
			status="404"
			title="404"
			subTitle="Sorry, the page you visited does not exist."
			extra={
				<Button type="primary" onClick={() => navigate({})}>
					Back Home
				</Button>
			}
		/>
	);
};

export default Page404;
