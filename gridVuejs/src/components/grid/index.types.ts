export interface GridColumns {
    title: string;
    field: string;
    filterable?: boolean;
}

export interface SortState {
    field: string;
    direction: string
}

export interface FilterState {
    field: string;
    value: string
}

export enum SortDirection {
    ascending = "asc",
    descending = "desc",
}