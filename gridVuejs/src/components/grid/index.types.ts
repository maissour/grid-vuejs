export interface GridColumns {
    title: string;
    field: string;
    filterable?: boolean;
    format?: string;
    filterCell?: ((h: any, defaultRendering: any | null, props: GridFilterCellProps, listeners: any) => any) | string | any;
}

export interface SortState {
    field: string;
    direction: string
}

export interface FilterState {
    field: string;
    value: string
}

export interface GroupState {
  field: string
  title: string
}

export interface PageState {
    skip: number;
    take: number;
}

export interface GridFilterCellProps {
    field: string;
    value: string;
    filterType: string;
}

export enum SortDirection {
    ascending = "asc",
    descending = "desc",
}