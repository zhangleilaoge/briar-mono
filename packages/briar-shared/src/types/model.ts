export type IModel<T> = T & {
	createdAt: string;
	updatedAt: string;
	id: number;
};
