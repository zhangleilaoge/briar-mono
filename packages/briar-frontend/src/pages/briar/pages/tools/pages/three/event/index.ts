/*
 * @Description:
 * @Author: zhanglei
 * @Date: 2025-04-21 20:01:56
 * @LastEditTime: 2025-04-21 20:34:15
 * @LastEditors: zhanglei
 * @Reference:
 */
// src/utils/KeyEventManager.ts
type KeyCallback = () => void;

class KeyEventManager {
	private keyCallbacks: Map<string, KeyCallback[]> = new Map();

	constructor() {
		window.addEventListener('keydown', this.handleKeyDown);
	}

	// 订阅按键事件
	subscribe(key: string, callback: KeyCallback) {
		if (!this.keyCallbacks.has(key)) {
			this.keyCallbacks.set(key, []);
		}
		this.keyCallbacks.get(key)?.push(callback);
	}

	// 取消订阅
	unsubscribe(key: string, callback: KeyCallback) {
		const callbacks = this.keyCallbacks.get(key);
		if (callbacks) {
			this.keyCallbacks.set(
				key,
				callbacks.filter((cb) => cb !== callback)
			);
		}
	}

	// 触发按键回调
	private handleKeyDown = (e: KeyboardEvent) => {
		console.log('按下', e.code);
		const callbacks = this.keyCallbacks.get(e.code);
		if (callbacks) {
			e.preventDefault(); // 阻止默认行为（如空格滚动）
			callbacks.forEach((cb) => cb());
		}
	};

	// 销毁（移除事件监听）
	destroy() {
		window.removeEventListener('keydown', this.handleKeyDown);
	}
}

// 全局单例
export const keyEventManager = new KeyEventManager();
