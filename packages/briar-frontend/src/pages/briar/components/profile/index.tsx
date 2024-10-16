import { LoginOutlined, LogoutOutlined, SignatureOutlined, UserOutlined } from '@ant-design/icons';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Avatar, Dropdown, message, Modal } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { useContext, useMemo, useState } from 'react';

import { clientId } from '@/pages/briar/constants/user';
import CommonContext from '@/pages/briar/context/common';

import Login from './Login';
import Register from './Register';
import s from './style.module.scss';

enum OperationEnum {
	Login = 'login',
	Logout = 'logout',
	Register = 'register'
}

const Profile = () => {
	const { userInfo, logout } = useContext(CommonContext);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modelType, setModelType] = useState(OperationEnum.Login);

	const dropdownItems = useMemo(() => {
		return [
			!userInfo?.isAuthenticated && {
				key: OperationEnum.Register,
				icon: <SignatureOutlined />,
				label: (
					<a
						onClick={async () => {
							setModelType(OperationEnum.Register);
							setIsModalOpen(true);
						}}
					>
						sign up
					</a>
				)
			},
			!userInfo?.isAuthenticated && {
				key: OperationEnum.Login,
				icon: <LoginOutlined />,
				label: (
					<a
						onClick={async () => {
							setModelType(OperationEnum.Login);
							setIsModalOpen(true);
						}}
					>
						sign in
					</a>
				)
			},
			userInfo?.isAuthenticated && {
				key: OperationEnum.Logout,
				icon: <LogoutOutlined />,
				label: (
					<a
						onClick={() => {
							Modal.confirm({
								title: '退出登录',
								content: '确认要退出登录吗？',
								onOk: () => {
									message.success('登出成功，页面即将刷新。');
									logout();
								}
							});
						}}
					>
						logout
					</a>
				)
			}
		].filter(Boolean) as ItemType[];
	}, [logout, userInfo?.isAuthenticated]);

	const displayName = useMemo(() => {
		return (userInfo.name || '')?.slice(0, 5);
	}, [userInfo.name]);

	const modelContent = useMemo(() => {
		switch (modelType) {
			case OperationEnum.Login:
				return (
					<div className={s.ModalContent}>
						<GoogleOAuthProvider clientId={clientId}>
							<Login finishSignIn={() => setIsModalOpen(false)} />
						</GoogleOAuthProvider>
					</div>
				);
			case OperationEnum.Register:
				return (
					<div className={s.ModalContent}>
						<Register finishSignUp={() => setIsModalOpen(false)} />
					</div>
				);
			default:
				return null;
		}
	}, [modelType]);

	return (
		<>
			<Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
				<Avatar
					size={40}
					src={userInfo.profileImg || ''}
					icon={displayName || userInfo.profileImg ? null : <UserOutlined />}
				>
					{displayName}
				</Avatar>
			</Dropdown>
			<Modal
				open={isModalOpen}
				footer={null}
				closable={false}
				onCancel={() => {
					setIsModalOpen(false);
				}}
				destroyOnClose
			>
				{modelContent}
			</Modal>
		</>
	);
};

export default Profile;
