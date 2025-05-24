export type FunctionProperties<T extends object> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

export type OmitFunctionProperties<T extends object> = {
  [K in keyof Omit<T, FunctionProperties<T>>]: T[K] extends object
    ? OmitFunctionProperties<T[K]>
    : T[K];
};
