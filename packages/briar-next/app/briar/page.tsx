/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { supabase } from '@/src/supabase';
import { useEffect, useState } from 'react';

// 登录
// await supabase.auth.signInWithPassword({
// 	email: '137101851@qq.com',
// 	password: 'password'
// });

// 注册
// const { data, error } = await supabase.auth.signUp({
// 	email: '1371018512@qq.com',
// 	password: 'password'
// });

// 查看登陆状态
// const {
// 	data: { user }
// } = await supabase.auth.getUser();
// if (user?.role) {
// 	// 已登陆
// 	console.log('user', user);
// } else {
// 	// 未登陆
// }

export default function Briar() {
	const [user, setUser] = useState<any>(null);
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLogin, setIsLogin] = useState(true); // 切换登录/注册表单
	const [error, setError] = useState<string | null>(null);

	const fetchData = async () => {
		const { data, error } = await supabase.from('hello').select();
		if (error) {
			console.error('数据获取错误:', error);
			setError('获取数据失败');
		} else {
			setData(data);
		}
	};

	const checkAuth = async () => {
		const {
			data: { user }
		} = await supabase.auth.getUser();
		setUser(user);
		setLoading(false);

		if (user?.role) {
			fetchData(); // 已登录 -> 步骤5
		}
	};

	const handleAuth = async () => {
		setError(null);
		try {
			let authData;

			if (isLogin) {
				// 登录逻辑
				authData = await supabase.auth.signInWithPassword({
					email,
					password
				});
			} else {
				// 注册逻辑
				authData = await supabase.auth.signUp({
					email,
					password
				});
			}

			if (authData.error) {
				throw authData.error;
			}

			// 登录/注册成功 -> 步骤4
			setUser(authData.data.user);
			fetchData();
		} catch (err: any) {
			setError(err.message);
			console.error('认证错误:', err);
		}
	};

	// 登出
	const handleLogout = async () => {
		await supabase.auth.signOut();
		setUser(null);
		setData([]);
	};

	useEffect(() => {
		checkAuth();
	}, []);

	useEffect(() => {
		const init = async () => {
			const { data, error } = await supabase.from('hello').select();
			if (error) {
				console.log('error', error);
			} else {
				console.log('data', data);
			}
		};

		init();
	}, []);

	if (loading) {
		return <div>加载中...</div>;
	}

	// 未登录状态
	if (!user) {
		return (
			<div className="auth-container">
				<h2>{isLogin ? '登录' : '注册'}</h2>

				{error && <div className="error">{error}</div>}

				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="邮箱"
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="密码"
				/>

				<button onClick={handleAuth}>{isLogin ? '登录' : '注册'}</button>

				<button onClick={() => setIsLogin(!isLogin)} className="switch-mode">
					{isLogin ? '没有账号？去注册' : '已有账号？去登录'}
				</button>
			</div>
		);
	}

	// 已登录状态 -> 步骤5
	return (
		<div className="data-container">
			<div className="user-info">
				欢迎，{user.email}
				<button onClick={handleLogout}>退出登录</button>
			</div>

			<h3>数据列表：</h3>
			{data.length > 0 ? (
				<ul>
					{data.map((item) => (
						<li key={item.id}>{JSON.stringify(item)}</li>
					))}
				</ul>
			) : (
				<p>没有数据或加载中...</p>
			)}
		</div>
	);
}
