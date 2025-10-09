// src/features/index-db-playground/db/services/crud.ts
import z from 'zod';

import { db } from '../db';
import { DbName } from '../types/common';

type SortParams = { field: string; direction: 'asc' | 'desc' };
type PaginationParams = { page: number; pageSize: number };

export async function getEntities<T>(
	tableName: DbName,
	schema: z.ZodSchema<T>,
	params: {
		sort?: SortParams;
		pagination?: PaginationParams;
	} = {}
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
	raw: Omit<T, 'id'>
): Promise<number> {
	const data = schema.parse(raw);
	return db[tableName].add(data as any);
}

export async function updateEntity<T extends { id: number }>(
	tableName: DbName,
	schema: z.ZodSchema<T>,
	entity: T
): Promise<number> {
	if (!entity.id) {
		throw new Error('ID is required');
	}
	const data = schema.parse(entity);
	return db[tableName].update(entity.id, data);
}

export async function deleteEntity(tableName: DbName, id: number): Promise<void> {
	if (!id) {
		throw new Error('ID is required');
	}
	return db[tableName].delete(id);
}
