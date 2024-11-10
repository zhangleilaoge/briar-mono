import { Footer as AntdFooter } from 'antd/es/layout/layout';

const Footer = () => {
	return (
		<AntdFooter className="text-center text-slate-600">
			<div> Briar ©{new Date().getFullYear()} Created by zhangleilaoge</div>
			<a
				href="https://beian.miit.gov.cn"
				target="_blank"
				rel="noreferrer"
				className="text-slate-400"
			>
				浙ICP备2024116093号
			</a>
		</AntdFooter>
	);
};

export default Footer;
