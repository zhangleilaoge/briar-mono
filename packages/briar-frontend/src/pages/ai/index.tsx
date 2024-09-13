import { Layout, Menu, theme } from 'antd';
import Sider from 'antd/es/layout/Sider';
import useConversationList from './hooks/useConversationList';
import mainStyle from '@/styles/main.module.scss';
import { Content } from 'antd/es/layout/layout';
import Footer from '@/components/Footer';
import Conversation from './components/conversation';
import ConversationContext from './context/conversation';
import useSider from '@/hooks/useSider';
import CommonContext from '@/context/common';
import { useContext } from 'react';
import SiderOperations from './components/sider-operations';
function CodeConverter() {
	const {
		token: { borderRadiusLG }
	} = theme.useToken();
	const { fullScreenInfo } = useContext(CommonContext);
	const { isCollapsed, setIsCollapsed } = useSider();
	const {
		menuConfig,
		currentConversationKey,
		currentConversation,
		multiSelectMode,
		selectedConversationKeys,
		messageArr,
		createImgMode,
		setCreateImgMode,
		updateConversation,
		createConversation,
		setCurrentConversationKey,
		deleteSelectedConversation,
		inMultiSelectMode,
		outMultiSelectMode,
		setSelectedConversationKeys,
		setMessageArr,
		clickMenuItem,
		refreshConversationList
	} = useConversationList();

	return (
		<ConversationContext.Provider
			value={{
				createImgMode,
				currentConversation,
				multiSelectMode,
				selectedConversationKeys,
				messageArr,
				setCreateImgMode,
				updateConversation,
				createConversation,
				setCurrentConversationKey,
				deleteSelectedConversation,
				inMultiSelectMode,
				outMultiSelectMode,
				setSelectedConversationKeys,
				setMessageArr,
				refreshConversationList
			}}
		>
			<Layout>
				<Sider width={240} className={fullScreenInfo.SiderClass} collapsed={isCollapsed}>
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
							background: '#efeaed',
							borderRadius: borderRadiusLG
						}}
					>
						<Conversation />
					</Content>
					<Footer />
				</div>
			</Layout>
		</ConversationContext.Provider>
	);
}

export default CodeConverter;
