// src/features/index-db-playground/db/services/friend.ts
import { DbName } from '../types/common';
import { Friend, FriendSchema, UpdateFriend, UpdateFriendSchema } from '../types/friend';
import { addEntity, deleteEntity, getEntities, updateEntity } from './common';

export const getFriends = (params?: any) => getEntities(DbName.Friend, FriendSchema, params);

export const addFriend = (raw: Omit<Friend, 'id'>) => addEntity(DbName.Friend, FriendSchema, raw);

export const updateFriend = (friend: UpdateFriend) =>
	updateEntity(DbName.Friend, UpdateFriendSchema, friend);

export const deleteFriend = (id: number) => deleteEntity(DbName.Friend, id);
