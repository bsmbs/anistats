export interface Filter {
    name: string,
    key: string,
    type: string,
    values?: FilterValues[],
    checked: string[] | string
}

export interface FilterValues {
    name: string,
    key: string
}