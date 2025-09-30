import { useSearchParams } from 'react-router-dom';

import { getRedirectPath } from '../utils';

const useRedirect = () => {
	const [searchParams] = useSearchParams();
	const redirect = () => {
		window.location.href = getRedirectPath(searchParams);
	};

	return {
		redirect
	};
};

export default useRedirect;
