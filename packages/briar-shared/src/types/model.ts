export type IModel<T> = T & {
	createdAt: string;
	updatedAt: string;
	id: number;
};

export type PureModel<T> = Omit<T, 'createdAt' | 'updatedAt' | 'id'>;
