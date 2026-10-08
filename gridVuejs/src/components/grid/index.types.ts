export interface GridColumns {
    title: string;
    field: string;
    hidden?: boolean;
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

export type GroupItem = { 
    type: 'group'; 
    key: string; 
    label: string; 
    level: number; 
    ancestors: string[] 
}
export type RowItem = { 
    type: 'row'; 
    row: Record<string, any>; 
    ancestors: string[] 
}
export type DisplayItem = GroupItem | RowItem

export interface PageState {
    skip: number;
    take: number;
}

export interface GridFilterCellProps {
    field: string;
    value: string;
    filterType: string;
}

export interface IdTextDto {
    id: number;
    text: string;
}

export enum SortDirection {
    ascending = "asc",
    descending = "desc",
}