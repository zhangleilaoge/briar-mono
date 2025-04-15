import { Button, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';

import { LocalStorageKey } from '@/pages/briar/constants/env';

const DecodeEncode = () => {
	const [input, setInput] = useState(localStorage.getItem(LocalStorageKey.DecodeContent) || '');

	// Save input to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem(LocalStorageKey.DecodeContent, input);
	}, [input]);

	const decode = () => {
		setInput(decodeURIComponent(input));
	};

	const encode = () => {
		setInput(encodeURIComponent(input));
	};

	const copyToClipboard = () => {
		navigator.clipboard
			.writeText(input)
			.then(() => {
				message.success('已复制到剪贴板!');
			})
			.catch(() => {
				message.error('复制失败!');
			});
	};

	const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === 'Tab') {
			e.preventDefault(); // 阻止默认事件（跳转到下一个输入框）
			// @ts-ignore
			const { selectionStart, selectionEnd } = e.target;
			// 在光标位置插入制表符
			const newValue = input.substring(0, selectionStart) + '\t' + input.substring(selectionEnd);
			setInput(newValue);
			// 移动光标到插入后的位置
			setTimeout(() => {
				// @ts-ignore
				e.target.selectionStart = e.target.selectionEnd = selectionStart + 1;
			}, 0);
		}
	};

	return (
		<>
			<div className="mb-[12px]">
				<Button onClick={encode}>UrlEncode</Button>
				<Button onClick={decode} style={{ marginLeft: '10px' }}>
					UrlDecode
				</Button>
				<Button onClick={copyToClipboard} style={{ marginLeft: '10px' }}>
					复制
				</Button>
			</div>
			<Form.Item>
				<Input.TextArea
					rows={22}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="此处输入需要编码/解码的字符串"
					onKeyDown={handleKeyDown}
				/>
			</Form.Item>
		</>
	);
};

export default DecodeEncode;
