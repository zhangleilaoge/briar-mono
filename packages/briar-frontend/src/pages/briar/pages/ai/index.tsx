import { Layout, Menu, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { useContext } from 'react';

import Footer from '@/pages/briar/components/Footer';
import CommonContext from '@/pages/briar/context/common';
import { connectContainers } from '@/pages/briar/hooks/useContainer';
import { useContainer } from '@/pages/briar/hooks/useContainer';
import useSider from '@/pages/briar/hooks/biz/useSider';
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
	const { fullScreenInfo } = useContext(CommonContext);
	const { isCollapsed, setIsCollapsed } = useSider();
	const { menuConfig, currentConversationKey, clickMenuItem } = useContainer(conversationContainer);

	return (
		<Layout>
			<Sider
				width={240}
				className={`${fullScreenInfo.SiderClass} ${s.ShadowSider}`}
				collapsed={isCollapsed}
			>
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
			<div className={fullScreenInfo.LayoutClass}>
				<Content
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
