/*
 * @Description:
 * @Author: zhanglei
 * @Date: 2025-04-08 21:03:47
 * @LastEditTime: 2025-04-09 10:26:51
 * @LastEditors: zhanglei
 * @Reference:
 */
import EventEmitter from './event-emitter';

export default class Time extends EventEmitter {
	elapsed: number;
	delta: number;
	current: number;
	start: number;

	constructor() {
		super();

		// Setup
		this.start = Date.now();
		this.current = this.start;
		this.elapsed = 0;
		this.delta = 16;

		window.requestAnimationFrame(() => {
			this.tick();
		});
	}

	tick() {
		const currentTime = Date.now();
		this.delta = currentTime - this.current;
		this.current = currentTime;
		this.elapsed = this.current - this.start;

		this.trigger('tick');

		window.requestAnimationFrame(() => {
			this.tick();
		});
	}
}
