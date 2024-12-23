import { Popover } from 'antd';
import { IUserInfoDTO } from 'briar-shared';

import Avatar from '@/pages/briar/components/avatar';

interface IUserProps {
	user: IUserInfoDTO;
}

const User = (props: IUserProps) => {
	const { user } = props;
	return (
		<Popover
			content={
				<div className="flex gap-[8px] items-center">
					<Avatar user={user}></Avatar>
					<div>{user.name}</div>
				</div>
			}
			placement="bottom"
		>
			<div className="cursor-pointer w-fit hover:text-selected-color">{user.name}</div>
		</Popover>
	);
};

export default User;
