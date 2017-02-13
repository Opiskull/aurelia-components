export class FilteredItemsValueConverter {
  toView(items: any[], filteredItems: any[]) {
    filteredItems.splice(0, filteredItems.length);
    items.forEach(item => filteredItems.push(item));
    return items;
  }
}
