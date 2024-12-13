import { Tooltip } from 'antd';
import cx from 'classnames';
import { useEffect, useRef, useState } from 'react';

const LineText = ({
	text,
	line,
	className
}: {
	text: string;
	line: number;
	className?: string;
}) => {
	const textRef = useRef(null);
	const [displayedText, setDisplayedText] = useState(text);

	useEffect(() => {
		const checkTextOverflow = () => {
			if (textRef.current) {
				const { scrollHeight } = textRef.current;
				const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight);

				// 计算允许的高度（line * lineHeight）
				if (scrollHeight > lineHeight * line) {
					// 如果溢出，进行缩略处理
					const startChars = 6; // 保留开头字符数
					const endChars = 12; // 保留结尾字符数
					const truncatedText = `${text.substring(0, startChars)}...${text.substring(text.length - endChars)}`;
					setDisplayedText(truncatedText);
				} else {
					setDisplayedText(text);
				}
			}
		};

		checkTextOverflow();
		window.addEventListener('resize', checkTextOverflow);

		return () => window.removeEventListener('resize', checkTextOverflow);
	}, [text, line]);

	return (
		<Tooltip title={text} placement={'bottom'}>
			<span
				ref={textRef}
				className={cx(
					'flex break-all justify-center items-start overflow-hidden text-center',
					className
				)}
			>
				{displayedText}
			</span>
		</Tooltip>
	);
};

export default LineText;
