// src/types/prisma-utils.ts (or a suitable location for shared types)

export * from './admin';
export * from './appointment';
export * from './data-types';
export * from './doctor';
export * from './patients';
export * from './payment';
export * from './query';
export * from './records';
export * from './staff';
export * from './user';
export * from './vitals';
export type SearchParamsProps = {
    searchParams?: Promise<{ [key: string]: string | undefined }>;
};

export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export type EmptyProps<T extends React.ElementType> = Omit<React.ComponentProps<T>, keyof React.ComponentProps<T>>;

export type SearchParams = {
    [key: string]: string | string[] | undefined;
};
