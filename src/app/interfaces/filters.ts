export interface Filter {
    name: string,
    key: string,
    values: FilterValues[],
    checked: string[]
}

export interface FilterValues {
    name: string,
    key: string
}