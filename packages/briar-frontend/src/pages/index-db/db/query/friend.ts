// src/features/index-db-playground/db/services/friend.ts
import { DbName, MaybeArray } from '../types/common';
import { Friend, FriendSchema, UpdateFriend, UpdateFriendSchema } from '../types/friend';
import { addEntity, deleteEntity, getEntities, GetParams, updateEntity } from './common';

export const getFriends = (params?: GetParams) => getEntities(DbName.Friend, FriendSchema, params);

export const addFriend = (raw: MaybeArray<Friend>) => addEntity(DbName.Friend, FriendSchema, raw);

export const updateFriend = (friend: MaybeArray<UpdateFriend>) =>
	updateEntity(DbName.Friend, UpdateFriendSchema, friend);

export const deleteFriend = (id: MaybeArray<number>) => deleteEntity(DbName.Friend, id);
