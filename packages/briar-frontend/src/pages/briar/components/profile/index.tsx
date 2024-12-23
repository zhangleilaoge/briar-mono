import {
	ControlOutlined,
	LoginOutlined,
	LogoutOutlined,
	SignatureOutlined,
	UserOutlined
} from '@ant-design/icons';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Dropdown, message, Modal } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { clientId } from '@/pages/briar/constants/user';
import CommonContext from '@/pages/briar/context/common';

import { TranslationEnum } from '../../constants/locales/common';
import { MenuKeyEnum } from '../../constants/router';
import useNavigateTo from '../../hooks/biz/useNavigateTo';
import Avatar from '../avatar';
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
	Personal = 'personal',
	Admin = 'admin'
}

export const ModelTitle = {
	[OperationEnum.Login]: '登录',
	[OperationEnum.Register]: '注册',
	[OperationEnum.ResetPassword]: '重置密码',
	[OperationEnum.RetrievePassword]: '找回密码'
};

const Profile = () => {
	const { userInfo, logout, availablePage } = useContext(CommonContext);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { t } = useTranslation();
	const [modelType, setModelType] = useState<
		| OperationEnum.Login
		| OperationEnum.Register
		| OperationEnum.ResetPassword
		| OperationEnum.RetrievePassword
	>(OperationEnum.Login);
	const navigate = useNavigateTo();
	// 重置密码用
	const [checkedEmail, setCheckedEmail] = useState<string>('');
	const [checkedCode, setCheckedCode] = useState<string>('');

	const personalAccess = useMemo(() => {
		return availablePage.includes(MenuKeyEnum.Personal_1);
	}, [availablePage]);

	const AdminAccess = useMemo(() => {
		return availablePage.includes(MenuKeyEnum.Admin_1);
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
							navigate({
								target: MenuKeyEnum.Personal_1
							});
						}}
					>
						{t(TranslationEnum.PersonalHomepage)}
					</a>
				)
			},
			AdminAccess && {
				key: OperationEnum.Admin,
				icon: <ControlOutlined />,
				label: (
					<a
						onClick={async () => {
							navigate({
								target: MenuKeyEnum.Admin_1
							});
						}}
					>
						{t(TranslationEnum.Admin)}
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
						{t(TranslationEnum.SignUp)}
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
						{t(TranslationEnum.SignIn)}
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
						{t(TranslationEnum.SignOut)}
					</a>
				)
			}
		].filter(Boolean) as ItemType[];
	}, [AdminAccess, logout, navigate, personalAccess, t, userInfo?.isAuthenticated, userInfo?.name]);

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
				<div>
					<Avatar user={userInfo}></Avatar>
				</div>
			</Dropdown>
			<Modal
				open={isModalOpen}
				footer={null}
				closable={false}
				onCancel={() => {
					setIsModalOpen(false);
				}}
				title={ModelTitle[modelType]}
				destroyOnClose
			>
				{modelContent}
			</Modal>
		</>
	);
};

export default Profile;
