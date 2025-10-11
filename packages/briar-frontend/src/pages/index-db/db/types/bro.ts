// src/features/index-db-playground/db/types/bro.ts
import z from 'zod';

// 定义星座枚举
export const ZodiacSigns = [
	'Aries',
	'Taurus',
	'Gemini',
	'Cancer',
	'Leo',
	'Virgo',
	'Libra',
	'Scorpio',
	'Sagittarius',
	'Capricorn',
	'Aquarius',
	'Pisces'
] as const;

export const BroSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(1),
	hobby: z.string().min(1),
	zodiac: z.enum(ZodiacSigns).optional() // 星座字段，可选
});

export const UpdateBroSchema = BroSchema.required({ id: true });

export type Bro = z.infer<typeof BroSchema>;
export type UpdateBro = z.infer<typeof UpdateBroSchema>;
export type BroFormValues = Omit<Bro, 'id'>;
export type ZodiacSign = (typeof ZodiacSigns)[number];

export enum FieldEnum {
	Id = 'id',
	Name = 'name',
	Hobby = 'hobby',
	Zodiac = 'zodiac'
}
