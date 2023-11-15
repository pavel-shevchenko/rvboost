export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export type ObjectValuesTypesUnion<TObj> = TObj[keyof TObj];
