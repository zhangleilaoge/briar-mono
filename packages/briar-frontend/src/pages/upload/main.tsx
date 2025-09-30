import '../../tailwind-to.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<Router basename={'upload'}>
		<App />
	</Router>
);
