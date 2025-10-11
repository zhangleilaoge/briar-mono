// src/features/index-db-playground/db/services/bro.ts
import { Bro, BroSchema, UpdateBro, UpdateBroSchema } from '../types/bro';
import { DbName, MaybeArray } from '../types/common';
import { addEntity, deleteEntity, getEntities, GetParams, updateEntity } from './common';

export const getBros = (params?: GetParams) => getEntities(DbName.Bro, BroSchema, params);

export const addBro = (raw: MaybeArray<Bro>) => addEntity(DbName.Bro, BroSchema, raw);

export const updateBro = (bro: MaybeArray<UpdateBro>) =>
	updateEntity(DbName.Bro, UpdateBroSchema, bro);

export const deleteBro = (id: MaybeArray<number>) => deleteEntity(DbName.Bro, id);
