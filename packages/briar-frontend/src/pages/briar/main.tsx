import '../../tailwind-to.css';

// import './base/i18n.ts';
import { BRIAR_BASENAME } from 'briar-shared';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<Router basename={BRIAR_BASENAME}>
		<App />
	</Router>
);
