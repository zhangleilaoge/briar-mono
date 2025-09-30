export const getRedirectPath = (searchParams: URLSearchParams) => {
	// 优先使用query中的redirectTo参数
	const redirectTo = searchParams.get('redirectTo');
	if (redirectTo) {
		// 可以添加安全性验证，确保重定向到应用内路径
		return redirectTo;
	}
	// 默认重定向路径
	return '/briar';
};
