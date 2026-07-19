export interface GridColumns {
    title: string;
    field: string;
}

export interface SortState {
    field: string;
    direction: string
}

export enum SortDirection {
    ascending = "asc",
    descending = "desc",
}