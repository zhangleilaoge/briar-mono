import './index.css';

import Calculator from './components/Calculator';
const App = () => {
	return (
		<div className="min-h-screen flex flex-col items-center bg-slate-950 p-4 md:p-8">
			{/* Header */}
			<header className="w-full max-w-6xl flex items-center justify-between gap-4 mb-8">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
						<i className="fas fa-calculator text-white text-xl"></i>
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-white">Visionary Calc</h1>
						<p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
							Precision Performance
						</p>
					</div>
				</div>
			</header>

			{/* Main Content Area */}
			<main className="w-full max-w-6xl flex-grow">
				<Calculator />
			</main>

			{/* Footer */}
			<footer className="mt-12 w-full text-center text-slate-500 text-sm pb-4">
				&copy; {new Date().getFullYear()} Visionary Calc. All calculations processed locally.
			</footer>
		</div>
	);
};

export default App;
