import CommonContext from '@/context/common';
import { LoginOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, message, Modal } from 'antd';
import { useContext, useMemo, useState } from 'react';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { clientId } from '@/constants/user';
import s from './style.module.scss';
import { errorNotify } from '@/utils/notify';
import { ItemType } from 'antd/es/menu/interface';
import { authenticateUserByGoogle } from '@/api/user';
import { LocalStorageKey } from '@/constants/env';

enum OperationEnum {
	Login = 'login',
	Logout = 'logout'
}

const Profile = () => {
	const { userInfo, logout } = useContext(CommonContext);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const onSuccess = async (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
		const { tokenId } = res as GoogleLoginResponse;
		const accessToken = await authenticateUserByGoogle(tokenId);

		console.log('google userInfo: ', res);

		if (accessToken) {
			message.success('登录成功，页面即将刷新。');
			localStorage.setItem(LocalStorageKey.AccessToken, accessToken);
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		} else errorNotify('登录失败。');
	};
	const onFailure = (err: Error) => {
		errorNotify(err);
	};

	const dropdownItems = useMemo(() => {
		return [
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

	return (
		<>
			<Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
				<Avatar size={40} src={userInfo.profileImg || ''} icon={<UserOutlined />} />
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
					<GoogleLogin
						clientId={clientId}
						buttonText="Sign in with Google"
						onSuccess={onSuccess}
						onFailure={onFailure}
						cookiePolicy={'single_host_origin'}
						isSignedIn={true}
					/>
				</div>
			</Modal>
		</>
	);
};

export default Profile;
