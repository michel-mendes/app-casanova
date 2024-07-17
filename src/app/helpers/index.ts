// Private interfaces
interface ISortableObject {
    [key: string]: any;
}

// Sort any array of objects by their object properties
// Ex: const sortedArray = sortArrayOfObjects<myArrayType>(myArrayToBeSorted, "propertyToBeSorted", true || false);
export function sortArrayOfObjects<T extends ISortableObject>(
    listToSort: T[],
    propertyToSort: keyof T,
    isAscending: boolean
): T[] {

    const sortedList = listToSort.sort((a, b) => {
        const sortOrder = (isAscending) ? 1 : -1
        const aValue = a[propertyToSort]
        const bValue = b[propertyToSort]

        if (aValue < bValue) {
            return (-1 * sortOrder)
        }
        else if (aValue > bValue) {
            return (1 * sortOrder)
        }
        else {
            return 0
        }
    })

    return sortedList

}