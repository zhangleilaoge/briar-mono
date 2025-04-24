type KeyCallback = (keyCode: string) => void;

class KeyEventManager {
	// 按按键存储回调函数
	private keyCallbacks: Map<string, { down: KeyCallback[]; up: KeyCallback[] }> = new Map();
	// 按名称存储回调函数
	private nameCallbacks: Map<string, { down: KeyCallback[]; up: KeyCallback[] }> = new Map();
	// 记录当前按下的按键
	pressedKeys: Set<string> = new Set();

	constructor() {
		window.addEventListener('keydown', this.handleKeyDown);
		window.addEventListener('keyup', this.handleKeyUp);
	}

	// 订阅按键事件
	subscribe({
		key,
		name,
		callback,
		eventType
	}: {
		key: string;
		name: string;
		callback: KeyCallback;
		eventType: 'down' | 'up';
	}) {
		if (!this.keyCallbacks.has(key)) {
			this.keyCallbacks.set(key, { down: [], up: [] });
		}
		if (!this.nameCallbacks.has(name)) {
			this.nameCallbacks.set(name, { down: [], up: [] });
		}
		this.keyCallbacks.get(key)?.[eventType].push(callback);
		this.nameCallbacks.get(name)?.[eventType].push(callback);
	}

	// 取消订阅
	unsubscribe({
		key,
		name,
		eventType
	}: {
		key?: string;
		name?: string;
		eventType?: 'down' | 'up';
	}) {
		if (key) {
			const callbacks = this.keyCallbacks.get(key);
			if (callbacks) {
				if (eventType) {
					callbacks[eventType] = [];
				} else {
					callbacks.down = [];
					callbacks.up = [];
				}
			}
		}
		if (name) {
			const callbacks = this.nameCallbacks.get(name);
			if (callbacks) {
				if (eventType) {
					callbacks[eventType] = [];
				} else {
					callbacks.down = [];
					callbacks.up = [];
				}
			}
		}
	}

	// 触发按键按下回调
	private handleKeyDown = (e: KeyboardEvent) => {
		console.log('按下', e.code);
		const key = e.code;

		// 如果按键已经按下，直接返回
		if (this.pressedKeys.has(key)) {
			return;
		}

		// 记录按键
		this.pressedKeys.add(key);

		// 触发当前按键的回调
		const callbacks = this.keyCallbacks.get(key)?.down;
		if (callbacks) {
			e.preventDefault(); // 阻止默认行为（如空格滚动）
			callbacks.forEach((cb) => cb(key));
		}

		// 触发所有按下的按键的回调
	};

	// 触发按键释放回调
	private handleKeyUp = (e: KeyboardEvent) => {
		console.log('释放', e.code);
		const key = e.code;

		// 从记录中移除按键
		this.pressedKeys.delete(key);

		// 触发当前按键的释放回调
		const callbacks = this.keyCallbacks.get(key)?.up;
		if (callbacks) {
			e.preventDefault(); // 阻止默认行为
			callbacks.forEach((cb) => cb(key));
		}
	};

	// 销毁（移除事件监听）
	destroy() {
		window.removeEventListener('keydown', this.handleKeyDown);
		window.removeEventListener('keyup', this.handleKeyUp);
	}
}

// 全局单例
export const keyEventManager = new KeyEventManager();
