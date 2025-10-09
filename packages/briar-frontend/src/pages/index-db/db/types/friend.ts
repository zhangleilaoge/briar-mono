import z from 'zod';

export const FriendSchema = z.object({
	id: z.number().optional(), // 自增主键，入库前可能没有
	name: z.string().min(1),
	age: z.number().int().min(0).max(150)
});
export type Friend = z.infer<typeof FriendSchema>;
export type FriendFormValues = Omit<Friend, 'id'>;
