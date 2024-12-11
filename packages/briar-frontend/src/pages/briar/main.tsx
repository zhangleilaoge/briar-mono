import '../../tailwind-to.css';
import './base/i18n.ts';

import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<Router basename="/briar">
		<App />
	</Router>
);
