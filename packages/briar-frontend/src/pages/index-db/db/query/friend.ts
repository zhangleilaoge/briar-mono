import z from 'zod';

import { db } from '../db';
import { Friend, FriendSchema } from '../types/friend';

export async function addFriend(raw: Friend) {
	const data = FriendSchema.parse(raw); // 校验失败直接抛错
	return db.friends.add(data); // 返回新增主键
}

export async function getFriends({
	sort = { field: 'id', direction: 'asc' },
	pagination = { page: 1, pageSize: 10 }
}: {
	sort?: { field: string; direction: 'asc' | 'desc' };
	pagination?: { page: number; pageSize: number };
} = {}): Promise<{ data: Friend[]; total: number }> {
	const { field, direction } = sort;
	const { page, pageSize } = pagination;
	const offset = (page - 1) * pageSize;

	// 获取总数
	const total = await db.friends.count();

	// 构建查询
	let query = db.friends.orderBy(field).offset(offset).limit(pageSize);

	if (direction === 'desc') {
		query = query.reverse();
	}

	const data = await query.toArray();

	return {
		data: z.array(FriendSchema).parse(data),
		total
	};
}

export async function updateFriend(friend: Friend) {
	if (!friend.id) {
		throw new Error('Friend id is required');
	}
	const data = FriendSchema.parse(friend);
	return db.friends.update(friend.id, data);
}

export async function deleteFriend(id: number) {
	if (!id) {
		throw new Error('Friend id is required');
	}
	return db.friends.delete(id);
}
