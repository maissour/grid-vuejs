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

export interface GroupState {
  field: string
  title: string
}

export interface PageState {
    skip: number;
    take: number;
}

export enum SortDirection {
    ascending = "asc",
    descending = "desc",
}