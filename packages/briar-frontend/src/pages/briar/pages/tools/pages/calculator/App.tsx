import { useCallback, useContext, useEffect, useState } from 'react';

// @ts-ignore
import Button from './components/Button.jsx';
// @ts-ignore
import ButtonBox from './components/ButtonBox.jsx';
// @ts-ignore
import Screen from './components/Screen.jsx';
// @ts-ignore
import Wrapper from './components/Wrapper.jsx';
import CalculateContext from './context';

const btnValues = [
	['C', '+-', '%', '/'],
	[7, 8, 9, 'X'],
	[4, 5, 6, '-'],
	[1, 2, 3, '+'],
	[0, '.', '=']
];

const toLocaleString = (num: number) =>
	String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1 ');
const removeSpaces = (num: number | string) => num.toString().replace(/\s/g, '');
const math = (a: number, b: number, sign: string) =>
	sign === '+' ? a + b : sign === '-' ? a - b : sign === 'X' ? a * b : a / b;
const zeroDivisionError = "Can't divide with 0";

const App = ({ onEqual }: { onEqual: (res: string | number) => void }) => {
	const [calc, setCalc] = useState<{
		sign: string;
		num: number | string;
		res: number | string;
	}>({
		sign: '',
		num: 0,
		res: 0
	});
	const { calculatorDisabledRef } = useContext(CalculateContext);

	const numClickHandler = useCallback(
		(e: { preventDefault: () => void; target: { innerHTML: string } }) => {
			e.preventDefault();
			const value = e.target.innerHTML;
			if (removeSpaces(calc.num).length < 16) {
				setCalc({
					...calc,
					num:
						+removeSpaces(calc.num) % 1 === 0 && !calc.num.toString().includes('.')
							? toLocaleString(Number(removeSpaces(calc.num + value)))
							: toLocaleString(+calc.num + +value),
					res: !calc.sign ? 0 : calc.res
				});
			}
		},
		[calc]
	);

	const comaClickHandler = useCallback(
		(e: { preventDefault: () => void; target: { innerHTML: string } }) => {
			e.preventDefault();
			const value = e.target.innerHTML;

			setCalc({
				...calc,
				num: !calc.num.toString().includes('.') ? calc.num + value : calc.num
			});
		},
		[calc]
	);

	const signClickHandler = useCallback(
		(e: { target: { innerHTML: string } }) => {
			setCalc({
				...calc,
				sign: e.target.innerHTML,
				res: !calc.num
					? calc.res
					: !calc.res
						? calc.num
						: toLocaleString(
								math(Number(removeSpaces(calc.res)), Number(removeSpaces(calc.num)), calc.sign)
							),
				num: 0
			});
		},
		[calc]
	);

	const equalsClickHandler = useCallback(() => {
		if (calc.sign && calc.num) {
			const res =
				calc.num === '0' && calc.sign === '/'
					? zeroDivisionError
					: toLocaleString(
							math(Number(removeSpaces(calc.res)), Number(removeSpaces(calc.num)), calc.sign)
						);

			onEqual(res);
			setCalc({
				...calc,
				res,
				num: 0
			});
		}
	}, [calc, onEqual]);

	const invertClickHandler = useCallback(() => {
		setCalc({
			...calc,
			num: calc.num ? toLocaleString(+removeSpaces(calc.num) * -1) : 0,
			res: calc.res ? toLocaleString(+removeSpaces(calc.res) * -1) : 0,
			sign: ''
		});
	}, [calc]);

	const percentClickHandler = useCallback(() => {
		let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
		let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;
		setCalc({
			...calc,
			num: (num /= Math.pow(100, 1)),
			res: (res /= Math.pow(100, 1)),
			sign: ''
		});
	}, [calc]);

	const resetClickHandler = useCallback(() => {
		setCalc({
			...calc,
			sign: '',
			num: 0,
			res: 0
		});
	}, [calc]);

	const buttonClickHandler = useCallback(
		(e: { preventDefault?: () => void; target: { innerHTML: string } }, btn: string | number) => {
			btn === 'C' || calc.res === zeroDivisionError
				? resetClickHandler()
				: btn === '+-'
					? invertClickHandler()
					: btn === '%'
						? percentClickHandler()
						: btn === '='
							? equalsClickHandler()
							: btn === '/' || btn === 'X' || btn === '-' || btn === '+'
								? signClickHandler(e)
								: btn === '.'
									? comaClickHandler(e as any)
									: numClickHandler(e as any);
		},
		[
			calc.res,
			comaClickHandler,
			equalsClickHandler,
			invertClickHandler,
			numClickHandler,
			percentClickHandler,
			resetClickHandler,
			signClickHandler
		]
	);

	const simulateButtonClick = useCallback(
		(value: string | number) => {
			const button = btnValues.flat().find((btn) => btn === value);
			if (button !== undefined) {
				const e = {
					preventDefault: () => {},
					target: { innerHTML: String(button) }
				};
				buttonClickHandler(e, button);
			}
		},
		[buttonClickHandler]
	);

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			const key = event.key;

			if (calculatorDisabledRef.current) {
				return;
			}

			// Prevent default behavior for calculator keys
			if (/[\d./+\-*=]/.test(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
				event.preventDefault();
			}

			// Number keys
			if (/\d/.test(key)) {
				simulateButtonClick(Number(key));
			}
			// Operator keys
			else if (key === '+' || key === '-' || key === '*' || key === '/') {
				const operatorMap: { [key: string]: string } = {
					'*': 'X'
				};
				simulateButtonClick(operatorMap[key] || key);
			}
			// Enter or = for equals
			else if (key === 'Enter' || key === '=') {
				simulateButtonClick('=');
			}
			// Escape for clear
			else if (key === 'Escape') {
				simulateButtonClick('C');
			}
			// Period for decimal
			else if (key === '.') {
				simulateButtonClick('.');
			}
			// Backspace for clear last digit
			else if (key === 'Backspace') {
				setCalc((prev) => ({
					...prev,
					num: String(prev.num).slice(0, -1) || 0
				}));
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [calculatorDisabledRef, simulateButtonClick]);

	return (
		<Wrapper>
			<Screen value={calc.num ? calc.num : calc.res} />
			<ButtonBox>
				{btnValues.flat().map((btn, i) => {
					return (
						<Button
							key={i}
							className={btn === '=' ? 'equals' : ''}
							value={btn}
							onClick={(e: any) => buttonClickHandler(e, btn)}
						/>
					);
				})}
			</ButtonBox>
		</Wrapper>
	);
};

export default App;
