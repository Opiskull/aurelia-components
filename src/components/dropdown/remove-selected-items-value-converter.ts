export class RemoveSelectedItemsValueConverter {
  toView(items: any[], selectedItems: any[] = [], removeSelected: boolean = false) {
    if (removeSelected && selectedItems.length > 0) {
      let selectedItemsFilter = selectedItems.map((item) => typeof (item) === 'object' ? JSON.stringify(item) : item);
      let itemsFilter = items.map((item) => typeof (item) === 'object' ? JSON.stringify(item) : item);
      return items.filter(item => !selectedItems.includes(item));
    } else {
      return items;
    }
  }
}
