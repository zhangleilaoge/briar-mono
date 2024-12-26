export type ItemTypeOfArray<T> = T extends (infer U)[] ? U : never;
