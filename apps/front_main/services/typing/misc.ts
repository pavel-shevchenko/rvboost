export declare type AnyClass<ReturnType = any> = new (
  ...args: any[]
) => ReturnType;

export type StringOrRetValsObject = {
  [key: string]: string | StringOrRetValsObject;
};
