import { Tabs } from 'antd';

import Bird from '@/components/bird';
import { AuroraBackgroundDemo } from '@/components/ui/code.demo';

const ComponentB = () => {
	return <div>这是组件 B 的内容</div>;
};

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
			label: '组件 B',
			children: <ComponentB />
		}
	];

	return (
		<div>
			<Tabs defaultActiveKey="1" items={items} />
		</div>
	);
};

export default TailWind;
