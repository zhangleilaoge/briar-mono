import z from 'zod';

import { db } from '../db';
import { Bro, BroSchema } from '../types/bro';

export async function addBro(raw: Bro) {
	const data = BroSchema.parse(raw); // 校验失败直接抛错
	return db.bros.add(data); // 返回新增主键
}

export async function getBros({
	sort = { field: 'id', direction: 'asc' },
	pagination = { page: 1, pageSize: 10 }
}: {
	sort?: { field: string; direction: 'asc' | 'desc' };
	pagination?: { page: number; pageSize: number };
} = {}): Promise<{ data: Bro[]; total: number }> {
	const { field, direction } = sort;
	const { page, pageSize } = pagination;
	const offset = (page - 1) * pageSize;

	// 获取总数
	const total = await db.bros.count();

	// 构建查询
	let query = db.bros.orderBy(field).offset(offset).limit(pageSize);

	if (direction === 'desc') {
		query = query.reverse();
	}

	const data = await query.toArray();

	return {
		data: z.array(BroSchema).parse(data),
		total
	};
}

export async function updateBro(bro: Bro) {
	if (!bro.id) {
		throw new Error('Bro id is required');
	}
	const data = BroSchema.parse(bro);
	return db.bros.update(bro.id, data);
}

export async function deleteBro(id: number) {
	if (!id) {
		throw new Error('Bro id is required');
	}
	return db.bros.delete(id);
}
