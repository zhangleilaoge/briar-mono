// import 'prismjs/components/prism-javascript';
// import 'prismjs/components/prism-java';
// import 'prismjs/themes/prism.css';


import Prism from 'prismjs';
import React from 'react';
import 'prismjs/components/prism-typescript';

interface FilePreviewProps {
	code: string;
	fileName: string;
	keyword?: string;
}

function getLanguage(fileName: string): string {
	if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) return 'typescript';
	if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) return 'javascript';
	if (fileName.endsWith('.java')) return 'java';
	return 'none';
}

function highlightKeywordHtml(html: string, keyword?: string): string {
	if (!keyword) return html;
	// 只在文本节点里高亮关键词，避免破坏 PrismJS token 标签结构
	const re = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
	// 用 DOM 解析再递归处理
	const container = document.createElement('div');
	container.innerHTML = html;
	function walk(node: Node) {
		if (node.nodeType === Node.TEXT_NODE) {
			const frag = document.createDocumentFragment();
			let lastIdx = 0;
			const text = node.textContent || '';
			text.replace(re, (match, idx) => {
				// 前面部分
				if (idx > lastIdx) {
					frag.appendChild(document.createTextNode(text.slice(lastIdx, idx)));
				}
				// 高亮部分
				const mark = document.createElement('mark');
				mark.style.background = '#952d52';
				// mark.style.fontWeight = 'bold';
				mark.textContent = match;
				frag.appendChild(mark);
				lastIdx = idx + match.length;
				return match;
			});
			// 剩余部分
			if (lastIdx < text.length) {
				frag.appendChild(document.createTextNode(text.slice(lastIdx)));
			}
			if (frag.childNodes.length) {
				node.parentNode?.replaceChild(frag, node);
			}
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			Array.from(node.childNodes).forEach(walk);
		}
	}
	Array.from(container.childNodes).forEach(walk);
	return container.innerHTML;
}

const FilePreview: React.FC<FilePreviewProps> = ({ code, fileName, keyword }) => {
	const language = getLanguage(fileName);
	const highlightedCode = Prism.highlight(code, Prism.languages[language] || {}, language);
	const finalHtml = highlightKeywordHtml(highlightedCode, keyword);

	return (
		<pre
			className={`language-${language} text-xs font-mono`}
			style={{ background: '#f8f8fa', padding: 0, margin: 0 }}
		>
			<code dangerouslySetInnerHTML={{ __html: finalHtml }} />
		</pre>
	);
};

export default FilePreview;
