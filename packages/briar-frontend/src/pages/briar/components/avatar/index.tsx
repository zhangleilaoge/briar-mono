import { UserOutlined } from '@ant-design/icons';
import { Avatar as AntdAvatar } from 'antd';
import { IUserInfoDTO } from 'briar-shared';
import { useMemo } from 'react';

interface IAvatarProps {
	user: IUserInfoDTO;
}

const Avatar = (props: IAvatarProps) => {
	const { user: userInfo } = props;
	const displayName = useMemo(() => {
		return (userInfo.name || '')?.slice(0, 5);
	}, [userInfo.name]);

	return (
		<AntdAvatar
			size={40}
			src={userInfo.profileImg || ''}
			icon={displayName || userInfo.profileImg ? null : <UserOutlined />}
		>
			{displayName}
		</AntdAvatar>
	);
};

export default Avatar;
