// src/features/index-db-playground/strategies/bro.strategy.ts
import { UseFormReturn } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';

import { addBro, deleteBro, getBros, updateBro } from '../query/bro';
import { Bro, BroSchema, ZodiacSigns } from '../types/bro';
import { DbName, EntityStrategy } from '../types/common';

export const broStrategy: EntityStrategy<Bro> = {
	entityName: DbName.Bro,
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
		},
		{
			key: 'zodiac',
			header: 'Zodiac',
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
			<FormField
				control={form.control}
				name="zodiac"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Zodiac Sign</FormLabel>
						<Select onValueChange={field.onChange} value={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Select zodiac sign" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{ZodiacSigns.map((sign) => (
									<SelectItem key={sign} value={sign}>
										{sign}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	),
	getInitialFormValues: () => ({ name: '', hobby: '', zodiac: undefined }),
	getTitle: (editingEntity) => (editingEntity?.id ? 'Edit Bro' : 'Add Bro')
};
