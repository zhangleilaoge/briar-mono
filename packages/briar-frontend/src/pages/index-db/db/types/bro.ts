import z from 'zod';

export const BroSchema = z.object({
	id: z.number().optional(), // 自增主键，入库前可能没有
	name: z.string().min(1),
	hobby: z.string().min(1)
});
export type Bro = z.infer<typeof BroSchema>;
export type BroFormValues = Omit<Bro, 'id'>;
