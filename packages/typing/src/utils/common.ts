export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export type ObjectValuesTypesUnion<TObj> = TObj[keyof TObj];

export type AnyClass<ReturnType = any> = new (...args: any[]) => ReturnType;

export type StringOrRetValsObject = {
  [key: string]: string | StringOrRetValsObject;
};
