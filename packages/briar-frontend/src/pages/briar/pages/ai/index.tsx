import { Layout, Menu, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import cx from 'classnames';
import { useContext } from 'react';

import Footer from '@/pages/briar/components/Footer';
import CommonContext from '@/pages/briar/context/common';
import useSider from '@/pages/briar/hooks/biz/useSider';
import { connectContainers } from '@/pages/briar/hooks/useContainer';
import { useContainer } from '@/pages/briar/hooks/useContainer';
import mainStyle from '@/pages/briar/styles/main.module.scss';

import { ThemeColor } from '../../constants/styles';
import Conversation from './components/conversation';
import SiderOperations from './components/sider-operations';
import { conversationContainer } from './container/conversationContainer';
import s from './style.module.scss';
function AiPage() {
	const {
		token: { borderRadiusLG }
	} = theme.useToken();
	const { fullRef } = useContext(CommonContext);
	const { isCollapsed, setIsCollapsed } = useSider();
	const { menuConfig, currentConversationKey, clickMenuItem } = useContainer(conversationContainer);

	return (
		<Layout>
			<Sider width={240} className={cx(mainStyle.Sider, s.ShadowSider)} collapsed={isCollapsed}>
				<SiderOperations setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
				<Menu
					mode="inline"
					selectedKeys={[`${currentConversationKey}`].filter(Boolean) as string[]}
					defaultOpenKeys={[]}
					items={menuConfig}
					className={mainStyle.SiderMenu}
					onClick={({ key }) => clickMenuItem(+key)}
				/>
			</Sider>
			<div className={mainStyle.ContentLayout}>
				<Content
					ref={fullRef}
					style={{
						padding: 24,
						margin: 0,
						minHeight: 280,
						background: ThemeColor.selectedBgColor,
						borderRadius: borderRadiusLG
					}}
				>
					<Conversation />
				</Content>
				<Footer />
			</div>
		</Layout>
	);
}

export default connectContainers([conversationContainer])(AiPage);
