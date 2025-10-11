import { UseFormReturn } from 'react-hook-form';
import z from 'zod';

import { ColumnDef } from '@/components/biz/data-table';

export enum DbName {
	Friend = 'friends',
	Bro = 'bros'
}

export interface EntityStrategy<T extends { id?: number }> {
	entityName: DbName;
	schema: z.ZodSchema<T>;
	formSchema: z.ZodSchema<Omit<T, 'id'>>;
	add: (values: MaybeArray<Omit<T, 'id'>>) => Promise<MaybeArray<number>>;
	delete: (id: MaybeArray<number>) => Promise<void>;
	get: (params: { sort?: any; pagination?: any }) => Promise<{ data: T[]; total: number }>;
	update: (values: MaybeArray<T & { id: number }>) => Promise<MaybeArray<number>>;
	columns: ColumnDef<T>[];
	getFormFields: (form: UseFormReturn<any>) => React.ReactNode;
	getInitialFormValues: () => Omit<T, 'id'>;
	getTitle: (editingEntity?: T | null) => string;
}

export type MaybeArray<T> = T | T[];
