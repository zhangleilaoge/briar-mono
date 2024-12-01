import { LoginOutlined, LogoutOutlined, SignatureOutlined, UserOutlined } from '@ant-design/icons';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Avatar, Dropdown, message, Modal } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { clientId } from '@/pages/briar/constants/user';
import CommonContext from '@/pages/briar/context/common';

import { MenuKeyEnum } from '../../constants/router';
import Login from './Login';
import Register from './Register';
import ResetPassword from './ResetPassword';
import RetrievePassword from './RetrievePassword';
import s from './style.module.scss';

export enum OperationEnum {
	Name = 'name',
	Login = 'login',
	Logout = 'logout',
	Register = 'register',
	RetrievePassword = 'retrievePassword',
	ResetPassword = 'resetPassword',
	Personal = 'personal'
}

const Profile = () => {
	const { userInfo, logout, availablePage } = useContext(CommonContext);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modelType, setModelType] = useState(OperationEnum.Login);
	const navigate = useNavigate();
	// 重置密码用
	const [checkedEmail, setCheckedEmail] = useState<string>('');
	const [checkedCode, setCheckedCode] = useState<string>('');

	const personalAccess = useMemo(() => {
		return availablePage.includes(MenuKeyEnum.Personal_1);
	}, [availablePage]);

	const dropdownItems = useMemo(() => {
		return [
			{
				key: OperationEnum.Name,
				label: userInfo?.name,
				disabled: true
			},
			personalAccess && {
				key: OperationEnum.Personal,
				icon: <UserOutlined />,
				label: (
					<a
						onClick={async () => {
							navigate('/' + MenuKeyEnum.Personal_1);
						}}
					>
						个人
					</a>
				)
			},
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
						注册
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
						登录
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
						登出
					</a>
				)
			}
		].filter(Boolean) as ItemType[];
	}, [logout, navigate, personalAccess, userInfo?.isAuthenticated, userInfo?.name]);

	const displayName = useMemo(() => {
		return (userInfo.name || '')?.slice(0, 5);
	}, [userInfo.name]);

	const modelContent = useMemo(() => {
		switch (modelType) {
			case OperationEnum.Login:
				return (
					<div className={s.ModalContent}>
						<GoogleOAuthProvider clientId={clientId}>
							<Login
								finishSignIn={() => setIsModalOpen(false)}
								retrievePassword={() => setModelType(OperationEnum.RetrievePassword)}
							/>
						</GoogleOAuthProvider>
					</div>
				);
			case OperationEnum.Register:
				return (
					<div className={s.ModalContent}>
						<Register finishSignUp={() => setIsModalOpen(false)} />
					</div>
				);
			case OperationEnum.RetrievePassword:
				return (
					<div className={s.ModalContent}>
						<RetrievePassword
							finishCheckCode={(email: string, code: string) => {
								setModelType(OperationEnum.ResetPassword);
								setCheckedEmail(email);
								setCheckedCode(code);
							}}
						/>
					</div>
				);
			case OperationEnum.ResetPassword:
				return (
					<div className={s.ModalContent}>
						<ResetPassword
							checkedCode={checkedCode}
							checkedEmail={checkedEmail}
							finishReset={() => setIsModalOpen(false)}
						/>
					</div>
				);
			default:
				return null;
		}
	}, [checkedCode, checkedEmail, modelType]);

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
