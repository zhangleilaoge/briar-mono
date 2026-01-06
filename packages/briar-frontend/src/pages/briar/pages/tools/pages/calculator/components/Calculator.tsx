import React, { useEffect, useState } from 'react';

import { CalculationHistory, Operation } from '../types';

const Calculator: React.FC = () => {
	const [display, setDisplay] = useState('0');
	const [expression, setExpression] = useState('');
	const [history, setHistory] = useState<CalculationHistory[]>([]);
	const [lastOp, setLastOp] = useState<Operation>(null);
	const [waitingForOperand, setWaitingForOperand] = useState(false);
	const [prevValue, setPrevValue] = useState<number | null>(null);

	// Load history from localStorage
	useEffect(() => {
		const saved = localStorage.getItem('calc_history');
		if (saved) {
			try {
				setHistory(JSON.parse(saved));
			} catch (e) {
				console.error('Failed to parse history', e);
			}
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('calc_history', JSON.stringify(history));
	}, [history]);

	const clearAll = () => {
		setDisplay('0');
		setExpression('');
		setLastOp(null);
		setPrevValue(null);
		setWaitingForOperand(false);
	};

	const clearEntry = () => {
		setDisplay('0');
	};

	const inputDigit = (digit: string) => {
		if (waitingForOperand) {
			setDisplay(digit);
			setWaitingForOperand(false);
		} else {
			setDisplay(display === '0' ? digit : display + digit);
		}
	};

	const inputDot = () => {
		if (waitingForOperand) {
			setDisplay('0.');
			setWaitingForOperand(false);
			return;
		}
		if (!display.includes('.')) {
			setDisplay(display + '.');
		}
	};

	const performCalculation = (nextValue: number) => {
		if (prevValue === null || lastOp === null) return nextValue;

		switch (lastOp) {
			case '+':
				return prevValue + nextValue;
			case '-':
				return prevValue - nextValue;
			case '*':
				return prevValue * nextValue;
			case '/':
				return nextValue !== 0 ? prevValue / nextValue : NaN;
			default:
				return nextValue;
		}
	};

	const handleOperator = (nextOp: Operation) => {
		const inputValue = parseFloat(display);

		if (prevValue === null) {
			setPrevValue(inputValue);
			setExpression(`${inputValue} ${nextOp}`);
		} else if (lastOp) {
			const result = performCalculation(inputValue);
			setPrevValue(result);
			setDisplay(String(result));
			setExpression(`${result} ${nextOp}`);
		}

		setWaitingForOperand(true);
		setLastOp(nextOp);
	};

	const handleEqual = () => {
		const inputValue = parseFloat(display);

		if (prevValue !== null && lastOp) {
			const result = performCalculation(inputValue);
			const fullExpression = `${prevValue} ${lastOp} ${inputValue} =`;

			const newHistory: CalculationHistory = {
				id: Date.now().toString(),
				expression: fullExpression,
				result: String(result),
				timestamp: Date.now()
			};

			setHistory([newHistory, ...history].slice(0, 50));
			setDisplay(String(result));
			setExpression(fullExpression);
			setPrevValue(null);
			setLastOp(null);
			setWaitingForOperand(true);
		}
	};

	const deleteHistory = (id: string) => {
		setHistory(history.filter((h) => h.id !== id));
	};

	const clearHistory = () => {
		setHistory([]);
	};

	return (
		<div className="flex flex-col lg:flex-row gap-6 h-full">
			{/* Calculator Body */}
			<div className="flex-1 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl overflow-hidden relative">
				<div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none"></div>

				{/* Display Area */}
				<div className="mb-6 p-6 bg-slate-950 rounded-2xl border border-slate-800 text-right overflow-hidden shadow-inner">
					<div className="text-slate-500 h-6 overflow-hidden text-ellipsis whitespace-nowrap mono text-sm mb-1">
						{expression || '\u00A0'}
					</div>
					<div className="text-4xl md:text-5xl font-bold text-white mono overflow-hidden text-ellipsis">
						{display}
					</div>
				</div>

				{/* Buttons Grid */}
				<div className="grid grid-cols-4 gap-3">
					<button onClick={clearAll} className="btn-calc btn-danger">
						AC
					</button>
					<button onClick={clearEntry} className="btn-calc btn-secondary">
						CE
					</button>
					<button
						onClick={() => setDisplay(String(-parseFloat(display)))}
						className="btn-calc btn-secondary"
					>
						+/-
					</button>
					<button onClick={() => handleOperator('/')} className="btn-calc btn-primary">
						÷
					</button>

					{[7, 8, 9].map((n) => (
						<button key={n} onClick={() => inputDigit(String(n))} className="btn-calc btn-number">
							{n}
						</button>
					))}
					<button onClick={() => handleOperator('*')} className="btn-calc btn-primary">
						×
					</button>

					{[4, 5, 6].map((n) => (
						<button key={n} onClick={() => inputDigit(String(n))} className="btn-calc btn-number">
							{n}
						</button>
					))}
					<button onClick={() => handleOperator('-')} className="btn-calc btn-primary">
						−
					</button>

					{[1, 2, 3].map((n) => (
						<button key={n} onClick={() => inputDigit(String(n))} className="btn-calc btn-number">
							{n}
						</button>
					))}
					<button onClick={() => handleOperator('+')} className="btn-calc btn-primary">
						+
					</button>

					<button onClick={() => inputDigit('0')} className="btn-calc btn-number col-span-2">
						0
					</button>
					<button onClick={inputDot} className="btn-calc btn-number">
						.
					</button>
					<button
						onClick={handleEqual}
						className="btn-calc bg-indigo-600 hover:bg-indigo-500 text-white border-transparent"
					>
						=
					</button>
				</div>
			</div>

			{/* History Sidebar */}
			<div className="w-full lg:w-80 bg-slate-900/50 rounded-3xl p-6 border border-slate-800 flex flex-col max-h-[600px] lg:max-h-full">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-bold flex items-center gap-2">
						<i className="fas fa-history text-indigo-400"></i>
						History
					</h3>
					{history.length > 0 && (
						<button
							onClick={clearHistory}
							className="text-xs text-slate-500 hover:text-red-400 transition-colors uppercase font-bold"
						>
							Clear All
						</button>
					)}
				</div>

				<div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">
					{history.length === 0 ? (
						<div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-10">
							<i className="fas fa-ghost text-4xl"></i>
							<p className="text-sm italic">No recent calculations</p>
						</div>
					) : (
						history.map((item) => (
							<div
								key={item.id}
								className="group relative bg-slate-800/50 hover:bg-slate-800 p-3 rounded-xl border border-slate-700 transition-all"
							>
								<button
									onClick={() => deleteHistory(item.id)}
									className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center shadow-lg transition-opacity"
								>
									<i className="fas fa-times"></i>
								</button>
								<div className="text-[10px] text-slate-500 mb-1 mono">
									{new Date(item.timestamp).toLocaleTimeString()}
								</div>
								<div className="text-xs text-slate-400 mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
									{item.expression}
								</div>
								<div className="text-lg font-bold text-indigo-300 mono">{item.result}</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default Calculator;
