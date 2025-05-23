export type PromiseOf<T> = T extends Promise<infer U> ? U : T;
