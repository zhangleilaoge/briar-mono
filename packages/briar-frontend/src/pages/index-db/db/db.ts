import Dexie from 'dexie';

import { Bro, FieldEnum as BroFieldEnum } from './types/bro';
import { DbName } from './types/common';
import { FieldEnum as FriendFieldEnum, Friend } from './types/friend';

const getFieldValues = (Field: Record<string, any>) => {
	return Object.values(Field).filter(
		(k) => isNaN(Number(k)) && k !== 'id'
	) as (keyof typeof Field)[];
};

class Db extends Dexie {
	[DbName.Friend]!: Dexie.Table<Friend, number>; // number = 主键类型
	[DbName.Bro]!: Dexie.Table<Bro, number>;
	constructor() {
		super('Db');
		this.version(1).stores({
			friends: `++id, ${getFieldValues(FriendFieldEnum).join(', ')}`, // 自增 id
			bros: `++id, ${getFieldValues(BroFieldEnum).join(', ')}`
		});
	}
}

export const db = new Db();
