import { Key } from 'react';

export enum ModelType {
	Edit = 'edit',
	Create = 'create'
}

export interface FieldType {
	id?: number;
	name: string;
	desc: string;
	menuKeys: string[];
}

export type ICheckKeys =
	| {
			checked: Key[];
			halfChecked: Key[];
	  }
	| Key[];
