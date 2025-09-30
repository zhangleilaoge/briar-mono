// components/Profile.tsx
import { LogOut, User, UserPlus } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import useLogin from '@/pages/briar/hooks/biz/useLogin';

export const Profile = () => {
	const { userInfo, logout } = useLogin({});
	const isAuthenticated = userInfo && userInfo.isAuthenticated;

	const handleLogout = () => {
		logout();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="flex items-center gap-2 h-10 px-3">
					<Avatar className="h-8 w-8">
						{isAuthenticated ? (
							<>
								<AvatarImage src={userInfo.profileImg} alt={userInfo.name || '用户头像'} />
								<AvatarFallback>
									{userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
								</AvatarFallback>
							</>
						) : (
							<AvatarFallback>
								<User className="w-4 h-4" />
							</AvatarFallback>
						)}
					</Avatar>
					<span className="hidden sm:inline">
						{isAuthenticated ? userInfo.name || '用户' : '未登录'}
					</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-46">
				{isAuthenticated ? (
					<>
						<DropdownMenuLabel>
							<div className="flex flex-col space-y-1">
								<div className="text-sm font-medium">{userInfo.name || '用户'}</div>
								<div className="text-xs text-muted-foreground">{userInfo.email || ''}</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout}>
							<LogOut className="w-4 h-4 mr-2" />
							<span>退出登录</span>
						</DropdownMenuItem>
					</>
				) : (
					<>
						<DropdownMenuLabel>
							<div className="text-sm text-muted-foreground">未登录</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								location.href = `/account/login?redirectTo=${location.href}`;
							}}
						>
							<User className="w-4 h-4 mr-2" />
							<span>登录</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								location.href = `/account/register?redirectTo=${location.href}`;
							}}
						>
							<UserPlus className="w-4 h-4 mr-2" />
							<span>注册</span>
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
