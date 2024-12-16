import { List } from 'antd';
import cx from 'classnames';
import { FC } from 'react';

import useLevelPath from '@/pages/briar/hooks/biz/useLevelPath';
import { IMenuRouterConfig } from '@/pages/briar/types/router';
interface IMenuProps {
	menus: IMenuRouterConfig[];
}

const Menu: FC<IMenuProps> = ({ menus }) => {
	const { menuKey, onLevelPathChange } = useLevelPath(2);
	return (
		<List
			bordered
			dataSource={menus}
			renderItem={(item) => (
				<List.Item
					className={cx(
						'hover:bg-gray-100 !border-0 cursor-pointer !px-[16px] !py-[8px] mx-[8px] my-[4px] rounded flex !justify-start',
						menuKey === item.key && '!bg-selected-bg-color'
					)}
					onClick={() => {
						onLevelPathChange(item.key);
					}}
				>
					<div className="mr-[8px] w-fit">{item.icon}</div>
					<div>{item.label}</div>
				</List.Item>
			)}
			className="basis-[180px] bg-white overflow-hidden border-0 py-[4px] h-fit flex-shrink-0"
		/>
	);
};

export default Menu;
