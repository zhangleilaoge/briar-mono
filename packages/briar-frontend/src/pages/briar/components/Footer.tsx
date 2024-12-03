import { Modal } from 'antd';
import { Footer as AntdFooter } from 'antd/es/layout/layout';
import { useState } from 'react';

const Footer = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<AntdFooter className="text-center text-slate-600">
			<div>
				Briar ©{new Date().getFullYear()} Created by&nbsp;
				<a onClick={() => setIsModalOpen(true)}>zhangleilaoge</a>
			</div>
			<a
				href="https://beian.miit.gov.cn"
				target="_blank"
				rel="noreferrer"
				className="text-slate-400"
			>
				浙ICP备2024116093号
			</a>
			<Modal
				open={isModalOpen}
				footer={null}
				closable={false}
				onCancel={() => {
					setIsModalOpen(false);
				}}
				title={'关于我'}
				destroyOnClose
			>
				<p>微信：zlws892221504</p>
				<p>邮箱：zhangleilaoge@qq.com</p>
				<p>
					github：<a href="https://github.com/zhangleilaoge">https://github.com/zhangleilaoge</a>
				</p>
			</Modal>
		</AntdFooter>
	);
};

export default Footer;
