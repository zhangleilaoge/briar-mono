// src/features/index-db-playground/db/services/crud.ts
import z from 'zod';

import { db } from '../db';
import { DbName, MaybeArray } from '../types/common';

type SortParams = { field: string; direction: 'asc' | 'desc' };
type PaginationParams = { page: number; pageSize: number };
export type GetParams = {
	sort?: SortParams;
	pagination?: PaginationParams;
};

export async function getEntities<T>(
	tableName: DbName,
	schema: z.ZodSchema<T>,
	params: GetParams = {}
): Promise<{ data: T[]; total: number }> {
	const { sort = { field: 'id', direction: 'asc' }, pagination = { page: 1, pageSize: 10 } } =
		params;
	const { field, direction } = sort;
	const { page, pageSize } = pagination;
	const offset = (page - 1) * pageSize;

	const table = db[tableName];
	const total = await table.count();

	let query = table.orderBy(field).offset(offset).limit(pageSize);
	if (direction === 'desc') {
		query = query.reverse();
	}

	const data = await query.toArray();
	return {
		data: z.array(schema).parse(data),
		total
	};
}

export async function addEntity<T>(
	tableName: DbName,
	schema: z.ZodSchema<T>,
	raw: MaybeArray<Omit<T, 'id'>>
): Promise<MaybeArray<number>> {
	const table = db[tableName];
	const list = Array.isArray(raw) ? raw : [raw];
	const parsed = z.array(schema).parse(list);

	return db.transaction('rw', table, async () => {
		const ids = await Promise.all(parsed.map((it) => table.add(it as any)));
		return Array.isArray(raw) ? ids : ids[0]; // 调用方传单条就返回单个 number
	});
}

export async function updateEntity<T extends { id: number }>(
	tableName: DbName,
	schema: z.ZodSchema<T>,
	entity: MaybeArray<T>
): Promise<MaybeArray<number>> {
	const table = db[tableName];
	const list = Array.isArray(entity) ? entity : [entity];
	const parsed = z.array(schema).parse(list);

	return db.transaction('rw', table, async () => {
		const affected = await Promise.all(parsed.map((it) => table.update(it.id, it as any)));
		return Array.isArray(entity) ? affected : affected[0];
	});
}

//

export async function deleteEntity(tableName: DbName, id: MaybeArray<number>): Promise<void> {
	const table = db[tableName];
	const ids = Array.isArray(id) ? id : [id];
	if (ids.some((v) => !v)) throw new Error('ID is required');

	return db.transaction('rw', table, async () => {
		await Promise.all(ids.map((pk) => table.delete(pk)));
	});
}
