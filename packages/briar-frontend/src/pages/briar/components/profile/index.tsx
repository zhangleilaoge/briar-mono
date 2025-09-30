import {
	ControlOutlined,
	LoginOutlined,
	LogoutOutlined,
	SignatureOutlined,
	UserOutlined
} from '@ant-design/icons';
import { Dropdown, message, Modal } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import CommonContext from '@/pages/briar/context/common';

import { TranslationEnum } from '../../constants/locales/common';
import { MenuKeyEnum } from '../../constants/router';
import useNavigateTo from '../../hooks/biz/useNavigateTo';
import Avatar from '../avatar';

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

const Profile = () => {
	const { userInfo, logout, availablePage } = useContext(CommonContext);
	const { t } = useTranslation();

	const navigate = useNavigateTo();

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
							location.href = `/account/register?redirectTo=${location.href}`;
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
							location.href = `/account/login?redirectTo=${location.href}`;
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

	return (
		<>
			<Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
				<div>
					<Avatar user={userInfo}></Avatar>
				</div>
			</Dropdown>
		</>
	);
};

export default Profile;
