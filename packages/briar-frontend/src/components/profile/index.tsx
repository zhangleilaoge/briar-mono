import CommonContext from '@/context/common';
import { LoginOutlined, LogoutOutlined, SignatureOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, message, Modal } from 'antd';
import { useContext, useMemo, useState } from 'react';
import s from './style.module.scss';
import { ItemType } from 'antd/es/menu/interface';
import Register from './Register';
import Login from './Login';
import { clientId } from '@/constants/user';
import { GoogleOAuthProvider } from '@react-oauth/google';

enum OperationEnum {
	Login = 'login',
	Logout = 'logout',
	Register = 'register'
}

const Profile = () => {
	const { userInfo, logout } = useContext(CommonContext);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

	const dropdownItems = useMemo(() => {
		return [
			!userInfo?.isAuthenticated && {
				key: OperationEnum.Register,
				icon: <SignatureOutlined />,
				label: (
					<a
						onClick={async () => {
							setIsRegisterModalOpen(true);
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
							setIsModalOpen(true);
						}}
					>
						login
					</a>
				)
			},
			userInfo?.isAuthenticated && {
				key: OperationEnum.Logout,
				icon: <LogoutOutlined />,
				label: (
					<a
						onClick={() => {
							message.success('登出成功，页面即将刷新。');
							logout();
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
			>
				<div className={s.ModalContent}>
					<GoogleOAuthProvider clientId={clientId}>
						<Login finishSignIn={() => setIsModalOpen(false)} />
					</GoogleOAuthProvider>
				</div>
			</Modal>
			<Modal
				open={isRegisterModalOpen}
				footer={null}
				closable={false}
				onCancel={() => {
					setIsRegisterModalOpen(false);
				}}
			>
				<div className={s.ModalContent}>
					<Register finishSignUp={() => setIsRegisterModalOpen(false)} />
				</div>
			</Modal>
		</>
	);
};

export default Profile;
