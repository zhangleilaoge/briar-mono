// src/features/index-db-playground/db/services/bro.ts
import { Bro, BroSchema, UpdateBro, UpdateBroSchema } from '../types/bro';
import { DbName } from '../types/common';
import { addEntity, deleteEntity, getEntities, updateEntity } from './common';

export const getBros = (params?: any) => getEntities(DbName.Bro, BroSchema, params);

export const addBro = (raw: Omit<Bro, 'id'>) => addEntity(DbName.Bro, BroSchema, raw);

export const updateBro = (bro: UpdateBro) => updateEntity(DbName.Bro, UpdateBroSchema, bro);

export const deleteBro = (id: number) => deleteEntity(DbName.Bro, id);
