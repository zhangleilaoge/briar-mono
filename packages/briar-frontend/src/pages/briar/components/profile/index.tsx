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

import CommonContext from '@/pages/briar/context/common';

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
						{'个人主页'}
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
						{'控制台'}
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
						{'注册'}
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
						{'登录'}
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
						{'退出登录'}
					</a>
				)
			}
		].filter(Boolean) as ItemType[];
	}, [AdminAccess, logout, navigate, personalAccess, userInfo?.isAuthenticated, userInfo?.name]);

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
