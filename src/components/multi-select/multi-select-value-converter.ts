export class MultiSelectValueConverter {
  toView(items: any[], selectedItems: any[], filter: string, removeSelected: boolean) {
    if (filter === "" && selectedItems.length === 0) {
      return items;
    }
    let filteredItems = items.filter((item) => item.includes(filter));
    return removeSelected ? filteredItems.filter((item) => !selectedItems.includes(item)) : filteredItems;
  }
}
