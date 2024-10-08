import { useEffect } from 'react';

import { getDosage } from '@/api/ai';

const Dosage = () => {
	useEffect(() => {
		console.log('???');
		getDosage().then((res) => console.log(res));
	}, []);
	return <div>123</div>;
};

export default Dosage;
