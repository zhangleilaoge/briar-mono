import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App.tsx';

window.addEventListener('load', function () {
	const loadingScreen = document.getElementById('loading-screen');

	loadingScreen && (loadingScreen.style.display = 'none');
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<Router basename="/briar">
		<App />
	</Router>
);
