// src/features/index-db-playground/strategies/friend.strategy.ts
import { UseFormReturn } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { addFriend, deleteFriend, getFriends, updateFriend } from '../query/friend';
import { DbName, EntityStrategy } from '../types/common';
import { Friend, FriendSchema } from '../types/friend';

export const friendStrategy: EntityStrategy<Friend> = {
	entityName: DbName.Friend,
	schema: FriendSchema,
	formSchema: FriendSchema.omit({ id: true }),
	add: addFriend,
	delete: deleteFriend,
	get: getFriends,
	update: updateFriend,
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
			key: 'age',
			header: 'Age',
			sortable: true,
			cell: (row) => `${row.age}岁`
		}
	],
	getFormFields: (form: UseFormReturn<Omit<Friend, 'id'>>) => (
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
				name="age"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Age</FormLabel>
						<FormControl>
							<Input
								type="number"
								placeholder="Enter age"
								{...field}
								onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	),
	getInitialFormValues: () => ({ name: '', age: 0 }),
	getTitle: (editingEntity) => (editingEntity?.id ? 'Edit Friend' : 'Add Friend')
};
