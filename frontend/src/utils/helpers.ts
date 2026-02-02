export type Join<K, P> = K extends string | number
  ? P extends string
    ? `${K}.${P}`
    : `${K}`
  : never;

export type DeepestPaths<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? Join<K, DeepestPaths<T[K]>>
        : never;
    }[keyof T]
  : -1;
