// src/features/index-db-playground/page.tsx
'use client';

import { message } from 'antd';
import { useCallback, useState } from 'react';

import { DataTable } from '@/components/biz/data-table';
import { Operation } from '@/components/biz/data-table/operation';
import { useDataTable } from '@/components/biz/data-table/useDataTable';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { errorNotify } from '../briar/utils/notify';
import { EditForm } from './components/edit';
import { broStrategy } from './db/strategies/bro';
import { friendStrategy } from './db/strategies/friend';
import { DbName, EntityStrategy, MaybeArray } from './db/types/common';

const allStrategies: EntityStrategy<any>[] = [friendStrategy, broStrategy];

export default function IndexDBPlayground() {
	const [currentStrategy, setCurrentStrategy] = useState<DbName>(DbName.Friend);
	const [editingEntity, setEditingEntity] = useState<any | null>(null);

	const strategy = allStrategies.find((s) => s.entityName === currentStrategy)!;

	const {
		data,
		pagination,
		isLoading,
		sortConfig,
		refresh,
		onSortChange,
		onPageChange,
		onPageSizeChange
	} = useDataTable({
		fetchData: async ({ sort, pagination }) => {
			return strategy.get({ sort, pagination });
		},
		updateKey: strategy.entityName
	});

	const handleStartEdit = useCallback((entity: any) => {
		setEditingEntity(entity || null);
	}, []);

	const handleCancelEdit = useCallback(() => {
		setEditingEntity(null);
	}, []);

	const handleSubmit = useCallback(
		async (values: any) => {
			try {
				if (editingEntity) {
					await strategy.update({ id: editingEntity.id, ...values });
					message.success(`${currentStrategy} updated successfully`);
				} else {
					await strategy.add(values);
					message.success(`${currentStrategy} added successfully`);
				}
				setEditingEntity(null);
				await refresh();
			} catch (error) {
				errorNotify(error);
			}
		},
		[editingEntity, refresh, strategy, currentStrategy]
	);

	const handleDelete = useCallback(
		async (id: MaybeArray<number>) => {
			try {
				await strategy.delete(id);
				message.success(`${currentStrategy} deleted successfully`);
				await refresh();
			} catch (error) {
				errorNotify(error);
			}
		},
		[refresh, strategy, currentStrategy]
	);

	const handleStrategyChange = useCallback(
		(newStrategy: DbName) => {
			setCurrentStrategy(newStrategy);
			setEditingEntity(null);

			onSortChange();
		},
		[onSortChange]
	);

	const columns = [
		...strategy.columns,
		{
			key: 'actions',
			header: 'Actions',
			cell: (row: any) => (
				<Operation
					data={row}
					config={[
						{
							title: 'Edit',
							onClick: () => handleStartEdit(row)
						},
						{
							title: 'Delete',
							onClick: () => handleDelete(row.id!),
							confirm: {
								title: `Delete ${currentStrategy}`,
								description: `Are you sure you want to delete this ${currentStrategy}?`,
								confirmText: 'Delete',
								cancelText: 'Cancel',
								type: 'popover'
							}
						}
					]}
				/>
			)
		}
	];

	return (
		<div className="container mx-auto p-4 max-w-2xl space-y-6">
			<div className="space-y-2">
				<h1 className="text-2xl font-bold">Select Entity</h1>
				<Tabs
					value={currentStrategy}
					onValueChange={(value) => handleStrategyChange(value as DbName)}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-2">
						{allStrategies.map((s) => (
							<TabsTrigger key={s.entityName} value={s.entityName}>
								{s.entityName}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>
			<Separator />
			<div className="space-y-2">
				<h1 className="text-2xl font-bold">{strategy.getTitle(editingEntity)}</h1>
				<EditForm
					strategy={strategy}
					editingEntity={editingEntity}
					onSubmit={handleSubmit}
					onCancel={handleCancelEdit}
				/>
			</div>
			<Separator />
			<div className="space-y-2">
				<h1 className="text-2xl font-bold">
					{currentStrategy === DbName.Friend ? 'Friend Database' : 'Bro Database'}
				</h1>
				<DataTable
					data={data?.data}
					columns={columns}
					total={data?.total}
					pagination={pagination}
					isLoading={isLoading}
					onSortChange={onSortChange}
					onPageChange={onPageChange}
					onPageSizeChange={onPageSizeChange}
					sortConfig={sortConfig}
					batchActions={[
						{
							label: 'Delete All',
							danger: true,
							onClick: (rows) => handleDelete(rows.map((row) => row.id))
						}
					]}
				/>
			</div>
		</div>
	);
}
