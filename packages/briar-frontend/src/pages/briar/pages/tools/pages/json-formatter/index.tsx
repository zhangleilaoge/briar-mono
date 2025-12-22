import { Button, Form, Input, message } from 'antd';
import { useMemo, useState } from 'react';
import ReactJson from 'react-json-view';

import { LocalStorageKey } from '@/constants';

const JsonFormatter = () => {
	const [input, setInput] = useState(localStorage.getItem(LocalStorageKey.JSON) || '');
	const [object, setObject] = useState<object>({});
	const [validateStatus, setValidateStatus] = useState<
		'' | 'success' | 'error' | 'warning' | 'validating' | undefined
	>('');
	const [error, setError] = useState('');

	const formatJson = () => {
		setValidateStatus('');
		setError(''); // 重置错误信息

		try {
			let json;

			// 尝试解析 JSON 字符串
			try {
				json = JSON.parse(input);
			} catch (error) {
				// 如果解析失败，尝试处理为 JavaScript 对象
				// 这里假设用户可能在输入一个 JavaScript 对象的形式
				// 例如："{ key: value }"（注意这是不合法的 JSON）
				const jsObject = eval(`(${input})`); // 注意：使用 eval 要小心，确保输入安全
				json = jsObject;
			}

			// 格式化 JSON
			const formatted = JSON.stringify(json, null, 2);
			setObject(json);
			setInput(formatted);
			setValidateStatus('success'); // 格式化成功，状态为成功
		} catch (error) {
			// 设置错误信息
			// @ts-ignore
			setError(error.message);
			setValidateStatus('error'); // 格式化失败，状态为错误
		}
	};

	const escapeString = () => {
		// 使用正则表达式进行转义
		const escaped = input
			.replace(/\\/g, '\\\\') // 转义反斜杠
			.replace(/\"/g, '\\"') // 转义双引号
			.replace(/\'/g, "\\'"); // 转义单引号
		// .replace(/\n/g, '\\n') // 转义换行符
		// .replace(/\r/g, '\\r') // 转义回车符
		// .replace(/\t/g, '\\t'); // 转义制表符
		setInput(escaped);
	};

	const removeEscapes = () => {
		// 使用正则表达式去除转义字符
		const cleaned = input.replace(/\\\"/g, '"').replace(/\\\\/g, '\\');
		setInput(cleaned);
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

	const compressText = () => {
		// 压缩文本，去除多余空行、换行符和空格
		const compressed = input
			.replace(/\s*\n\s*/g, '\n') // 去除多余的换行符
			.replace(/^\s+|\s+$/g, '') // 去除每行的前后空格
			.replace(/\n+/g, '\n') // 去除多余的空行
			.replace(/\s+/g, ' '); // 将多个空格替换为一个空格

		setInput(compressed.trim()); // 设置压缩后的结果，并去除开头和结尾的空格
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

	const help = useMemo(() => {
		if (validateStatus === 'error') {
			return error;
		}
	}, [error, validateStatus]);

	return (
		<>
			<div className="mb-[12px]">
				<Button type="primary" onClick={formatJson}>
					格式化 JSON
				</Button>
				<Button onClick={escapeString} style={{ marginLeft: '10px' }}>
					转义
				</Button>
				<Button onClick={removeEscapes} style={{ marginLeft: '10px' }}>
					去除转义
				</Button>
				<Button onClick={compressText} style={{ marginLeft: '10px' }}>
					压缩
				</Button>
				<Button onClick={copyToClipboard} style={{ marginLeft: '10px' }}>
					复制
				</Button>
			</div>
			<Form.Item validateStatus={validateStatus} help={help}>
				<Input.TextArea
					rows={22}
					value={input}
					onChange={(e) => {
						setInput(e.target.value);
						localStorage.setItem(LocalStorageKey.JSON, e.target.value);
					}}
					placeholder="输入 JSON 字符串"
					onKeyDown={handleKeyDown}
				/>
			</Form.Item>
			{validateStatus === 'success' && (
				<ReactJson src={object} collapsed={2} displayDataTypes={false} />
			)}
		</>
	);
};

export default JsonFormatter;
