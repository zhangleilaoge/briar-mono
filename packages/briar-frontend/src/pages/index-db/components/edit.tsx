// src/features/index-db-playground/components/edit-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { omit } from 'lodash-es';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { EntityStrategy } from '../db/types/common';

type EditFormProps<T extends { id?: number }> = {
	strategy: EntityStrategy<T>;
	editingEntity?: T | null;
	onSubmit: (values: Omit<T, 'id'>) => Promise<void>;
	onCancel: () => void;
};

export function EditForm<T extends { id?: number }>({
	strategy,
	editingEntity,
	onSubmit,
	onCancel
}: EditFormProps<T>) {
	const form = useForm<Omit<T, 'id'>>({
		// @ts-ignore
		resolver: zodResolver(strategy.formSchema),
		// @ts-ignore
		defaultValues: strategy.getInitialFormValues()
	});

	useEffect(() => {
		if (editingEntity) {
			form.reset(omit(editingEntity, 'id') as Omit<T, 'id'>);
		} else {
			form.reset(strategy.getInitialFormValues());
		}
	}, [editingEntity, form, strategy]);

	return (
		<Form {...form}>
			{/* @ts-ignore */}
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-8">
				<div className="grid grid-cols-2 gap-4">{strategy.getFormFields(form)}</div>
				<div className="flex space-x-2">
					<Button type="submit">{strategy.getTitle(editingEntity)}</Button>
					{editingEntity && (
						<Button variant="outline" onClick={onCancel}>
							Cancel
						</Button>
					)}
				</div>
			</form>
		</Form>
	);
}
