import { Spin } from 'antd';
import { Suspense, useCallback } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import useLogin from '../briar/hooks/biz/useLogin';
import Login from './pages/login';
import PasswordRecovery from './pages/password-recover';
import Register from './pages/register';

function App() {
	const navigate = useNavigate();
	useLogin({});

	// 保留当前 query 参数进行跳转
	const jump = useCallback(
		(path: string) => {
			const query = new URLSearchParams(window.location.search);
			navigate(`${path}?${query.toString()}`);
		},
		[navigate]
	);

	return (
		<Suspense
			fallback={
				<div>
					<Spin size="large" />
				</div>
			}
		>
			<Routes>
				<Route path="/">
					<Route index element={<Navigate to="/login" replace />} />
					<Route
						path="login"
						element={
							<Login
								finishSignIn={() => {}}
								retrievePassword={() => {
									jump('/retrieve-password');
								}}
							/>
						}
					/>
					<Route path="register" element={<Register finishSignUp={() => {}} />} />
					<Route path="retrieve-password" element={<PasswordRecovery jump={jump} />} />
				</Route>
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		</Suspense>
	);
}

export default App;
