import Dexie from 'dexie';

import { Bro } from './types/bro';
import { Friend } from './types/friend';

class Db extends Dexie {
	friends!: Dexie.Table<Friend, number>; // number = 主键类型
	bros!: Dexie.Table<Bro, number>;
	constructor() {
		super('Db');
		this.version(1).stores({
			friends: '++id, name, age', // 自增 id
			bros: '++id, name, hobby'
		});
	}
}

export const db = new Db();
