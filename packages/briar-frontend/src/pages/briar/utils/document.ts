export function copyToClipboard(textToCopy: string) {
	// navigator clipboard 需要https等安全上下文
	if (navigator.clipboard && window.isSecureContext) {
		// navigator clipboard 向剪贴板写文本
		return navigator.clipboard.writeText(textToCopy);
	} else {
		// 创建text area
		const textArea = document.createElement('textarea');
		textArea.value = textToCopy;
		// 使text area不在viewport，同时设置不可见
		textArea.style.position = 'absolute';
		textArea.style.opacity = '0';
		textArea.style.left = '-999999px';
		textArea.style.top = '-999999px';
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		return new Promise((res, rej) => {
			// 执行复制命令并移除文本框
			document.execCommand('copy') ? res('') : rej();
			textArea.remove();
		});
	}
}

export const download = (link: string, picName: string) => {
	const img = new Image();
	img.setAttribute('crossOrigin', 'Anonymous');
	img.onload = function () {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		canvas.width = img.width;
		canvas.height = img.height;
		context?.drawImage(img, 0, 0, img.width, img.height);
		const url = canvas.toDataURL('images/png');
		const a = document.createElement('a');
		const event = new MouseEvent('click');
		a.download = picName || 'default.png';
		a.href = url;
		a.dispatchEvent(event);
	};
	img.src = link + '?v=' + Date.now();
};
