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
	add: (values: Omit<T, 'id'>) => Promise<number>;
	delete: (id: number) => Promise<void>;
	get: (params: { sort?: any; pagination?: any }) => Promise<{ data: T[]; total: number }>;
	update: (values: T & { id: number }) => Promise<number>;
	columns: ColumnDef<T>[];
	getFormFields: (form: UseFormReturn<any>) => React.ReactNode;
	getInitialFormValues: () => Omit<T, 'id'>;
	getTitle: (editingEntity?: T | null) => string;
}
