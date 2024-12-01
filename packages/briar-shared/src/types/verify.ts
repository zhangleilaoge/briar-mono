import { IModel } from './model';

export enum VerifyScene {
	RetrievePassword = 'RetrievePassword'
}

export type IVerifyCodeDTO = IModel<{
	creator: number;
	validDuration: number;
	code: string;
	scene: VerifyScene;
	consumer: number;
}>;
