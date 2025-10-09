import Dexie from 'dexie';

import { Bro } from './types/bro';
import { DbName } from './types/common';
import { Friend } from './types/friend';

class Db extends Dexie {
	[DbName.Friend]!: Dexie.Table<Friend, number>; // number = 主键类型
	[DbName.Bro]!: Dexie.Table<Bro, number>;
	constructor() {
		super('Db');
		this.version(1).stores({
			friends: '++id, name, age', // 自增 id
			bros: '++id, name, hobby'
		});
	}
}

export const db = new Db();
