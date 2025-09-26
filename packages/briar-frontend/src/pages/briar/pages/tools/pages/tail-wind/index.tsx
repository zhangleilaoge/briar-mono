import { Tabs } from 'antd';

import Bird from './tabs/bird';
import RegisterForm from './tabs/shadcn';
import { AuroraBackgroundDemo } from './tabs/ui/code.demo';

const TailWind = () => {
	// 定义 Tabs 的配置项
	const items = [
		{
			key: '1', // Tab 的唯一标识
			label: 'Aurora 背景', // Tab 的标题
			children: <AuroraBackgroundDemo /> // Tab 的内容
		},
		{
			key: '2',
			label: 'Bird 游戏',
			children: <Bird />
		},
		{
			key: '3',
			label: 'shadcn',
			children: <RegisterForm />
		}
	];

	return (
		<div>
			<Tabs defaultActiveKey="1" items={items} />
		</div>
	);
};

export default TailWind;
