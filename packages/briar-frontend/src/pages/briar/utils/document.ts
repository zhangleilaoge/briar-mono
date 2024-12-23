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

function getMimeType(url: string) {
	const cleanUrl = url.split('?')[0]; // 取问号前的部分
	const extension = cleanUrl.split('.').pop()?.toLowerCase();
	switch (extension) {
		case 'jpg':
		case 'jpeg':
			return 'image/jpeg';
		case 'png':
			return 'image/png';
		case 'gif':
			return 'image/gif';
		case 'bmp':
			return 'image/bmp';
		case 'webp':
			return 'image/webp';
		case 'svg':
			return 'image/svg+xml';
		default:
			return 'application/octet-stream'; // 其他类型可以返回默认类型
	}
}

export async function copyImageToClipboard(imageUrl: string) {
	const response = await fetch(imageUrl);
	const blob = await response.blob(); // 将响应转换为 Blob 对象

	// 自动识别 MIME 类型
	const mimeType = getMimeType(imageUrl);
	const item = new ClipboardItem({ [mimeType]: blob }); // 动态设置 MIME 类型

	return navigator.clipboard.write([item]); // 写入剪贴板
}

// 根据 URL 扩展名获取 MIME 类型的辅助函数
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

export function downloadByDataUrl(dataUrl: string, fileName: string) {
	const link = document.createElement('a'); // 创建一个链接元素
	link.href = dataUrl; // 设置链接的 href 属性为 dataUrl
	link.download = fileName || 'downloaded_image.png'; // 设置下载的文件名
	document.body.appendChild(link); // 将链接添加到文档中
	link.click(); // 触发点击事件进行下载
	document.body.removeChild(link); // 下载后移除链接
}

export function removeHtmlTags(html: string): string {
	// 使用正则表达式匹配闭合的HTML标签
	const cleanHtml = html.replace(/<\/?\w+[^>]*>/g, '');
	return cleanHtml;
}
