import { useCallback, useState } from 'react';

import { getMiniprogramCode } from '@/pages/briar/api/user';

const useWxLogin = () => {
	const [code, setCode] = useState<string>();
	const [imgCode, setImgCode] = useState<string>();

	const fetchCode = useCallback(async () => {
		if (!code) {
			const { imgBase64, code: imgCode } = await getMiniprogramCode();
			setCode(imgBase64);
			setImgCode(imgCode);
		}
	}, [code]);

	return {
		code,
		imgCode,
		fetchCode
	};
};

export default useWxLogin;
