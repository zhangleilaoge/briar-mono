// src/features/index-db-playground/strategies/bro.strategy.ts
import { UseFormReturn } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { addBro, deleteBro, getBros, updateBro } from '../query/bro';
import { Bro, BroSchema } from '../types/bro';
import { EntityName, EntityStrategy } from '../types/common';

export const broStrategy: EntityStrategy<Bro> = {
	entityName: EntityName.Bro,
	schema: BroSchema,
	formSchema: BroSchema.omit({ id: true }),
	add: addBro,
	delete: deleteBro,
	get: getBros,
	update: updateBro,
	columns: [
		{
			key: 'id',
			header: 'ID',
			sortable: true
		},
		{
			key: 'name',
			header: 'Name',
			sortable: true
		},
		{
			key: 'hobby',
			header: 'Hobby',
			sortable: true
		}
	],
	getFormFields: (form: UseFormReturn<Omit<Bro, 'id'>>) => (
		<>
			<FormField
				control={form.control}
				name="name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Name</FormLabel>
						<FormControl>
							<Input placeholder="Enter name" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="hobby"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Hobby</FormLabel>
						<FormControl>
							<Input placeholder="Enter hobby" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	),
	getInitialFormValues: () => ({ name: '', hobby: '' }),
	getTitle: (editingEntity) => (editingEntity?.id ? 'Edit Bro' : 'Add Bro')
};
