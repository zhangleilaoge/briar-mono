import { Tabs, TabsProps } from 'antd';
import { useState } from 'react';

import Create from './create';
import Search from './search';

enum TabKeyEnum {
	Create = 'create',
	Search = 'search'
}

const items: TabsProps['items'] = [
	{
		key: TabKeyEnum.Create,
		label: '短链生成',
		children: <Create />
	},
	{
		key: TabKeyEnum.Search,
		label: '短链列表',
		children: <Search />
	}
];

const ShortUrl = () => {
	const [active, setActive] = useState(TabKeyEnum.Create);

	return (
		<Tabs
			defaultActiveKey={active}
			items={items}
			onChange={(key) => {
				setActive(key as TabKeyEnum);
			}}
		/>
	);
};

export default ShortUrl;
