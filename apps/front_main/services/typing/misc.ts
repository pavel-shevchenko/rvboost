export type ClassType<T> = new (...args: any[]) => T;

export type AnyClass = { new (...args: any[]): any };

export type StringOrRetValsObject = {
  [key: string]: string | StringOrRetValsObject;
};
