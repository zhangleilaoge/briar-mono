import { SetMetadata } from '@nestjs/common';
import { AbilityEnum } from 'briar-shared';

export const USER_ABILITY_KEY = 'ability';
export const Ability = (abilities: AbilityEnum[] | AbilityEnum) =>
  SetMetadata(
    USER_ABILITY_KEY,
    Array.isArray(abilities) ? abilities : [abilities],
  );
